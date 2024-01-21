import fs from 'fs';
import type {
  GettyScopeNote,
  GettySubjectMergedStatType,
  GettyTerm,
  GettyTermHistoricFlag,
  GettyTermPreferred,
  GettyTermVernacular,
  TgnCoordinates,
  TgnPreferredTermRole,
  TgnSubject,
  TgnSubjectRecordType,
} from '@/types';

import { processFileLineByLine, writeJsonLFile } from '../util/fileUtils';
import updateFromFile from '../util/updateFromFile';
import { indexSettings } from './indexSettings';

const INDEX_NAME = 'tgn-subjects';

const CURRENT_VERSION = '0124';
const DATA_DIR = `./data/tgn/tgn_rel_${CURRENT_VERSION}`;
const TGN_SUBJECTS_FILE_PATH = `./data/json/tgn_subjects_${CURRENT_VERSION}.json`;

export async function loadSubjectsMap(
  filePath: string
): Promise<Map<string, TgnSubject>> {
  const subjectsMap = new Map<string, TgnSubject>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const subject: TgnSubject = {
      type: 'tgn',
      legacyId: fields[0],
      mergedStat: fields[1] as GettySubjectMergedStatType,
      parentKey: fields[2],
      recordType: fields[3] as TgnSubjectRecordType,
      sortOrder: fields[4] ? parseInt(fields[4]) : undefined,
      specialProj: fields[5],
      subjectId: fields[6],
    };
    subjectsMap.set(subject.subjectId, subject);
  });

  return subjectsMap;
}

async function addTermToSubjects(
  termFilePath: string,
  subjectsMap: Map<string, TgnSubject>
) {
  await processFileLineByLine(termFilePath, async (line) => {
    const fields = line.split('\t');
    const term: GettyTerm = {
      aacr2Flag: fields[0],
      displayDate: fields[1],
      displayName: fields[2],
      displayOrder: parseInt(fields[3]),
      endDate: parseInt(fields[4]),
      historicFlag: fields[5] as GettyTermHistoricFlag,
      otherFlags: fields[6],
      preferred: fields[7] as GettyTermPreferred,
      startDate: parseInt(fields[8]),
      subjectId: fields[9],
      term: fields[10],
      termId: fields[11],
      vernacular: fields[12] as GettyTermVernacular,
    };

    if (subjectsMap.has(term.subjectId)) {
      const subject = subjectsMap.get(term.subjectId);
      if (subject) {
        if (!subject.terms) {
          subject.terms = [];
        }
        subject.terms.push(term);
      }
    }
  });
}

export function addScopeNotesToSubjects(
  scopeNotesFilePath: string,
  subjectsMap: Map<string, TgnSubject>
) {
  return processFileLineByLine(scopeNotesFilePath, async (line) => {
    const fields = line.split('\t');
    const scopeNote: GettyScopeNote = {
      scopeNoteId: fields[0],
      subjectId: fields[1],
      languageCode: fields[2],
      noteText: fields[3],
    };

    const subject = subjectsMap.get(scopeNote.subjectId);
    if (subject) {
      if (!subject.scopeNotes) {
        subject.scopeNotes = [];
      }
      subject.scopeNotes.push(scopeNote);
    }
  });
}

export function addCoordinatesToSubjects(
  coordinatesFilePath: string,
  subjectsMap: Map<string, TgnSubject>
) {
  return processFileLineByLine(coordinatesFilePath, async (line) => {
    const fields = line.split('\t');
    const coordinates: Partial<TgnCoordinates> = {
      elevationFeet: parseInt(fields[0]),
      elevationMeters: parseInt(fields[1]),
      subjectId: fields[33],
    };
    const location = {
      lat: parseFloat(fields[2]),
      lon: parseFloat(fields[17]),
    };
    const boundingBoxLeast = {
      lat: parseFloat(fields[7]),
      lon: parseFloat(fields[23]),
    };
    const boundingBoxMost = {
      lat: parseFloat(fields[12]),
      lon: parseFloat(fields[27]),
    };
    if (location.lat !== null && location.lon !== null) {
      coordinates.location = location;
    }
    if (
      boundingBoxLeast.lat &&
      boundingBoxLeast.lon &&
      boundingBoxMost.lat &&
      boundingBoxMost.lon
    ) {
      coordinates.boundingBoxLeast = boundingBoxLeast;
      coordinates.boundingBoxMost = boundingBoxMost;
    }

    const subject = subjectsMap.get((coordinates as TgnCoordinates).subjectId);
    if (subject) {
      if (!subject.coordinates) {
        subject.coordinates = [];
      }
      subject.coordinates.push(coordinates as TgnCoordinates);
    }
  });
}

export async function loadSubjectPreferredTermMap(
  termFilePath: string
): Promise<Map<string, string>> {
  const subjectPreferredTermMap = new Map<string, string>();
  await processFileLineByLine(termFilePath, async (line) => {
    const fields = line.split('\t');
    const isPreferred = fields[7] === 'P';
    if (isPreferred) {
      const subjectId = fields[9];
      const term = fields[10];
      subjectPreferredTermMap.set(subjectId, term);
    }
  });
  return subjectPreferredTermMap;
}

/**
 * Load the parent child relationships from the SUBJECT_RELS.out file
 * @param filePath
 * @returns
 */
export async function loadSubjectPreferredTermRelsMap(
  filePath: string,
  subjectPreferredTermMap: Map<string, string>,
  subjectPreferredPtypeRoleRelsMap: Map<string, string>
): Promise<Map<string, TgnPreferredTermRole>> {
  const subjectRelsMap = new Map<string, TgnPreferredTermRole>();
  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const isPreferred = fields[3] === 'P';
    const isParentChild = fields[8] === 'P';
    if (isPreferred && isParentChild) {
      const parentSubjectId = fields[6];
      const childSubjectId = fields[7];
      const parentTerm = subjectPreferredTermMap.get(parentSubjectId);
      const parentRole = subjectPreferredPtypeRoleRelsMap.get(parentSubjectId);
      if (parentTerm && parentRole) {
        const parentInfo: TgnPreferredTermRole = {
          subjectId: parentSubjectId,
          term: parentTerm,
          role: parentRole,
        };
        subjectRelsMap.set(childSubjectId, parentInfo);
      }
    }
  });
  return subjectRelsMap;
}

async function addHierarchicalPositionToSubjects(
  subjectsMap: Map<string, TgnSubject>,
  subjectPreferredTermRelsMap: Map<string, TgnPreferredTermRole>
) {
  // Loop through all subjects:
  for (const subject of subjectsMap.values()) {
    // If the subject has a parent, then add the parent to the subject
    if (subject.parentKey) {
      const hierarchy = buildHierarchy(
        subject.subjectId,
        subjectPreferredTermRelsMap
      );
      if (hierarchy && hierarchy.length > 0) {
        subject.hierarchicalPosition = hierarchy;
      }
    }
  }
}

/**
 * Table: PTYPE_ROLE
 * Description: The place type/role table is the base table for all place type/role
 * information. In TGN, this table is used to contain place types.
 * e.g. "agricultural land       55001", "state   81175"
 */
export interface TgnPTypeRole {
  roleId: string; // number (30) Place Type/Role unique identification number
  role: string; // varchar2(100) Place Type/Role description
}
export async function loadPTypeRoleMap(
  filePath: string
): Promise<Map<string, TgnPTypeRole>> {
  const pTypeRoleMap = new Map<string, TgnPTypeRole>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const pTypeRole: TgnPTypeRole = {
      roleId: fields[1],
      role: fields[0],
    };
    pTypeRoleMap.set(pTypeRole.roleId, pTypeRole);
  });

  return pTypeRoleMap;
}

/**
 * Table: PTYPE_ROLE_RELS
 * Description: The place type/role relationship table contains links between the subject
 * record and role information.
 */
export interface TgnPTypeRoleRel {
  displayDate: string;
  displayOrder: number;
  endDate: number;
  historicFlag: string;
  preferred: string;
  pTypeRoleId: string;
  startDate: number;
  subjectId: string;
}

export async function loadSubjectPreferredPtypeRoleRelsMap(
  filePath: string,
  pTypeRoleMap: Map<string, TgnPTypeRole>
): Promise<Map<string, string>> {
  const pTypeRoleRelsMap = new Map<string, string>();
  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const isPreferred = fields[4] === 'P';
    if (isPreferred) {
      const subjectId = fields[7];
      const pTypeRoleId = fields[5];
      const pTypeRole = pTypeRoleMap.get(pTypeRoleId);
      if (pTypeRole) {
        pTypeRoleRelsMap.set(subjectId, pTypeRole.role);
      }
    }
  });
  return pTypeRoleRelsMap;
}

// Recursive function to build hierarchy
function buildHierarchy(
  subjectID: string,
  subjectRelsMap: Map<string, TgnPreferredTermRole>
): TgnPreferredTermRole[] {
  const parent = subjectRelsMap.get(subjectID);
  if (parent) {
    return [parent, ...buildHierarchy(parent.subjectId, subjectRelsMap)];
  } else {
    return [];
  }
}

export function sortSubjectProperties(subjectsMap: Map<string, TgnSubject>) {
  for (const subject of subjectsMap.values()) {
    subject.terms?.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}

export async function prepareTgnData() {
  console.log('import TGN data');

  console.log('TGN: loading subject preferred term map...');
  let subjectPreferredTermMap: Map<string, string> | null =
    await loadSubjectPreferredTermMap(`${DATA_DIR}/TERM.out`);

  console.log('TGN: loading ptype role map...');
  let pTypeRoleMap: Map<string, TgnPTypeRole> | null = await loadPTypeRoleMap(
    `${DATA_DIR}/PTYPE_ROLE.out`
  );

  console.log('TGN: loading subject ptype role rels map...');
  const subjectPreferredPtypeRoleRelsMap =
    await loadSubjectPreferredPtypeRoleRelsMap(
      `${DATA_DIR}/PTYPE_ROLE_RELS.out`,
      pTypeRoleMap
    );

  pTypeRoleMap = null;
  if (global.gc) global.gc();

  console.log('TGN: loading subject preferred term rels map...');
  let subjectPreferredTermRelsMap: Map<string, TgnPreferredTermRole> | null =
    await loadSubjectPreferredTermRelsMap(
      `${DATA_DIR}/SUBJECT_RELS.out`,
      subjectPreferredTermMap,
      subjectPreferredPtypeRoleRelsMap
    );

  subjectPreferredTermMap = null;
  if (global.gc) global.gc();

  console.log('TGN: loading subjects map...');
  const subjectsMap = await loadSubjectsMap(`${DATA_DIR}/SUBJECT.out`);

  console.log('TGN: adding hierarchical position...');
  await addHierarchicalPositionToSubjects(
    subjectsMap,
    subjectPreferredTermRelsMap
  );

  fs.writeFileSync(
    TGN_SUBJECTS_FILE_PATH,
    JSON.stringify(Array.from(subjectsMap.entries()))
  );

  console.log('TGN: subjectMap written to file');
}

export async function importTgn() {
  const outputFilePath = `./data/json/tgn_${CURRENT_VERSION}.jsonl`;

  console.log('TGN: loading subjects map...');
  const readData = JSON.parse(fs.readFileSync(TGN_SUBJECTS_FILE_PATH, 'utf8'));

  // Convert the object back to a Map
  const subjectsMap = new Map<string, TgnSubject>();
  Object.entries(readData).forEach(([key, value]) => {
    subjectsMap.set(key, value as TgnSubject);
  });
  console.log('TGN: subjects map loaded', subjectsMap.size);

  console.log('TGN: loading terms...');
  await addTermToSubjects(`${DATA_DIR}/TERM.out`, subjectsMap);

  console.log('TGN: loading scope notes...');
  await addScopeNotesToSubjects(`${DATA_DIR}/SCOPE_NOTES.out`, subjectsMap);

  console.log('TGN: loading coordinates...');
  await addCoordinatesToSubjects(`${DATA_DIR}/COORDINATES.out`, subjectsMap);

  console.log('sorting subject properties...');
  sortSubjectProperties(subjectsMap);

  console.log('writing jsonl file...');
  await writeJsonLFile(subjectsMap, outputFilePath);

  console.log('updating elasticsearch...');
  await updateFromFile(INDEX_NAME, indexSettings, outputFilePath, 'subjectId');
}

/*

Issue with tgn_rel_dd.pdf definition:

0,  1,  2,          3,    4,   5,   6,   7,  8,  9, 10,  11, 12, 13, 14, 15, 16,   17,    18,   19,  20,  21,  22,  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
'', '', '63.5',    '63', 'N', '30', '0', '', '', '', '', '', '', '', '', '', '', '-129', '129', 'N', 'W', '0', '0', '', '', '', '', '', '', '', '', '', '', '1109874'
'', '', '65.3333', '65', 'N', '20', '0', '', '', '', '', '', '', '', '', '', '', '-121', '121', 'N', 'W', '0', '0', '', '', '', '', '', '', '', '', '', '', '1104771'

0: elevation ft
1: elevation m
2: latitude decimal
3: latitude degrees
4: lat direction
5: lat min
6: lat sec
7: latleast decimal
8: latleast degree
9: latleast dir
10: latleast min
11: latleast sec
12: latmost decimal
13: latmost degrees
14: latmost dir
15: latmost min
16: latmost sec
17: longitude decimal
18: longitude degrees
19: long direction
20: long min
21: long sec
22: longleast decimal
23: longleast degrees !!!! longleast decimal <<<<<
24: longleast dir
25: longleast min
26: longleast sec
27: longmost decimal
28: longmost degrees
29: longmost dir
30: longmost min
31: longmost sec
???
33: id

*/
