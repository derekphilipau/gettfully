import type {
  GettyScopeNote,
  GettySubjectMergedStatType,
  GettyTerm,
  GettyTermHistoricFlag,
  GettyTermPreferred,
  GettyTermVernacular,
  TgnCoordinates,
  TgnSubject,
  TgnSubjectRecordType,
} from '@/types';

import { processFileLineByLine, writeJsonLFile } from '../util/fileUtils';
import updateFromFile from '../util/updateFromFile';
import { indexSettings } from './indexSettings';

const INDEX_NAME = 'tgn-subjects';

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
    console.log(fields);
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
interface ParentPreferredTerm {
  subjectId: string;
  term: string;
}
export async function loadSubjectPreferredTermRelsMap(
  filePath: string,
  subjectPreferredTermMap: Map<string, string>
): Promise<Map<string, ParentPreferredTerm>> {
  const subjectRelsMap = new Map<string, ParentPreferredTerm>();
  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const isPreferred = fields[3] === 'P';
    const isParentChild = fields[8] === 'P';
    if (isPreferred && isParentChild) {
      const parentSubjectId = fields[6];
      const childSubjectId = fields[7];
      const parentTerm = subjectPreferredTermMap.get(parentSubjectId);
      if (parentTerm) {
        const parentInfo: ParentPreferredTerm = {
          subjectId: parentSubjectId,
          term: parentTerm,
        };
        subjectRelsMap.set(childSubjectId, parentInfo);
      }
    }
  });
  return subjectRelsMap;
}

// Recursive function to build hierarchy
function buildHierarchy(
  subjectID: string,
  subjectRelsMap: Map<string, ParentPreferredTerm>
): ParentPreferredTerm[] {
  const parent = subjectRelsMap.get(subjectID);
  if (parent) {
    return [parent, ...buildHierarchy(parent.subjectId, subjectRelsMap)];
  } else {
    return [];
  }
}

/*
"HIERARCHICAL_POSITION": [
    {
      "LEVEL": "World",
      "LEVEL_TYPE": "facet",
      "SUBJECT_ID": 1001
    },
    {
      "LEVEL": "South America",
      "LEVEL_TYPE": "continent",
      "SUBJECT_ID": 1002
    },
    // ... more levels (nation, state, etc.)
  ],
  */
export function addHierarchicalPositionToSubjects() {}

export function sortSubjectProperties(subjectsMap: Map<string, TgnSubject>) {
  for (const subject of subjectsMap.values()) {
    subject.terms?.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}

export async function importTgn() {
  console.log('import TGN data');
  const currentVersion = '0124';
  const dataDir = `./data/tgn/tgn_rel_${currentVersion}`;
  const outputFilePath = `./data/json/tgn_${currentVersion}.jsonl`;

  const subjectPreferredTermMap = await loadSubjectPreferredTermMap(
    `${dataDir}/TERM.out`
  );

  const subjectPreferredTermRelsMap = await loadSubjectPreferredTermRelsMap(
    `${dataDir}/SUBJECT_RELS.out`,
    subjectPreferredTermMap
  );

  const hierarchy = buildHierarchy('8945996', subjectPreferredTermRelsMap);
  console.log(JSON.stringify(hierarchy, null, 2));

  return;

  console.log('TGN: loading subjects map...');
  const subjectsMap = await loadSubjectsMap(`${dataDir}/SUBJECT.out`);

  console.log('TGN: loading terms...');
  await addTermToSubjects(`${dataDir}/TERM.out`, subjectsMap);

  console.log('TGN: loading scope notes...');
  await addScopeNotesToSubjects(`${dataDir}/SCOPE_NOTES.out`, subjectsMap);

  console.log('TGN: loading coordinates...');
  await addCoordinatesToSubjects(`${dataDir}/COORDINATES.out`, subjectsMap);

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
