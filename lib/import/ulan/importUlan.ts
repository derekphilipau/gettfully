import type {
  GettyTerm,
  GettyTermPreferred,
  GettyTermVernacular,
  UlanBiography,
  UlanNationality,
  UlanRole,
  UlanRoleHistoricFlag,
  UlanScopeNote,
  UlanSubject,
} from '@/types';

import { processFileLineByLine, writeJsonLFile } from '../util/fileUtils';
import updateFromFile from '../util/updateFromFile';
import { indexSettings } from './indexSettings';

const INDEX_NAME = 'ulan-subjects';

async function loadLookupValues(
  filePath: string
): Promise<Map<string, string>> {
  const lookupMap = new Map<string, string>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const id = fields[1];
    const value = fields[2];
    lookupMap.set(id, value);
  });

  return lookupMap;
}

async function loadPlaces(filePath: string): Promise<Map<string, string>> {
  const placesMap = new Map<string, string>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const name = fields[0];
    const id = fields[1];
    placesMap.set(id, name);
  });

  return placesMap;
}

async function loadRoleValues(filePath: string): Promise<Map<string, string>> {
  const roleMap = new Map<string, string>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const id = fields[1];
    const value = fields[0];
    roleMap.set(id, value);
  });

  return roleMap;
}

export async function loadSubjectsMap(
  filePath: string
): Promise<Map<string, UlanSubject>> {
  const subjectsMap = new Map<string, UlanSubject>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const term: GettyTerm = {
      aacr2Flag: fields[0],
      displayDate: fields[1],
      displayName: fields[2],
      displayOrder: parseInt(fields[3]),
      endDate: parseInt(fields[4]),
      historicFlag: fields[5] as UlanRoleHistoricFlag,
      otherFlags: fields[6],
      preferred: fields[7] as GettyTermPreferred,
      startDate: parseInt(fields[8]),
      subjectId: fields[9],
      term: fields[10],
      termId: fields[11],
      vernacular: fields[12] as GettyTermVernacular,
    };

    const subject = subjectsMap.get(term.subjectId);
    if (!subject) {
      const subject: UlanSubject = {
        type: 'ulan',
        subjectId: term.subjectId,
        terms: [term],
      };
      subjectsMap.set(term.subjectId, subject);
    } else {
      if (!subject?.terms) {
        subject.terms = [];
      }
      subject?.terms.push(term);
    }
  });

  return subjectsMap;
}

async function addBiographyToSubjects(
  biographyFilePath: string,
  subjectsMap: Map<string, UlanSubject>,
  placesMap: Map<string, string>
) {
  await processFileLineByLine(biographyFilePath, async (line) => {
    const fields = line.split('\t');
    const biography: UlanBiography = {
      bioId: fields[0],
      biographyText: fields[1],
      birthDate: parseInt(fields[2]),
      birthPlaceId: fields[3],
      contributor: fields[4],
      deathDate: parseInt(fields[5]),
      deathPlaceId: fields[6],
      preferred: fields[7],
      sex: fields[8],
      subjectId: fields[9],
    };

    if (biography.birthPlaceId) {
      const place = placesMap.get(biography.birthPlaceId);
      if (place) {
        biography.birthPlaceName = place;
      }
    }
    if (biography.deathPlaceId) {
      const place = placesMap.get(biography.deathPlaceId);
      if (place) {
        biography.deathPlaceName = place;
      }
    }

    if (subjectsMap.has(biography.subjectId)) {
      const subject = subjectsMap.get(biography.subjectId);
      if (subject) {
        if (!subject.biographies) {
          subject.biographies = [];
        }
        subject.biographies.push(biography);
      }
    }
  });
}

async function addNationalityToSubjects(
  nationalityFilePath: string,
  subjectsMap: Map<string, UlanSubject>,
  lookupMap: Map<string, string>
) {
  await processFileLineByLine(nationalityFilePath, async (line) => {
    const fields = line.split('\t');
    const nationality: UlanNationality = {
      displayOrder: parseInt(fields[0]),
      nationalId: fields[1],
      nationalityCode: fields[2],
      preferred: fields[3],
      subjectId: fields[4],
    };

    const name = lookupMap.get(fields[2]);
    if (name) {
      nationality.name = name;
    }

    if (subjectsMap.has(nationality.subjectId)) {
      const subject = subjectsMap.get(nationality.subjectId);
      if (subject) {
        if (!subject.nationalities) {
          subject.nationalities = [];
        }
        subject.nationalities.push(nationality);
      }
    }
  });
}

export function addRoleToSubjects(
  roleFilePath: string,
  subjectsMap: Map<string, UlanSubject>,
  roleMap: Map<string, string>
) {
  return processFileLineByLine(roleFilePath, async (line) => {
    const fields = line.split('\t');
    const role: UlanRole = {
      displayDate: fields[0],
      displayOrder: parseInt(fields[1]),
      endDate: parseInt(fields[2]),
      historicFlag: fields[3] as 'C' | 'H' | 'B' | 'NA' | 'U',
      preferred: fields[4] as 'P' | 'N',
      ptypeRoleId: fields[5],
      startDate: parseInt(fields[6]),
      subjectId: fields[7],
    };
    const roleName = roleMap.get(role.ptypeRoleId);
    if (roleName) {
      role.name = roleName;
    }
    if (role) {
      const subject = subjectsMap.get(role.subjectId);
      if (subject) {
        if (!subject.roles) {
          subject.roles = [];
        }
        subject.roles.push(role);
      }
    }
  });
}

export function addScopeNotesToSubjects(
  scopeNotesFilePath: string,
  subjectsMap: Map<string, UlanSubject>,
  lookupMap: Map<string, string>
) {
  return processFileLineByLine(scopeNotesFilePath, async (line) => {
    const fields = line.split('\t');
    const scopeNote: UlanScopeNote = {
      scopeNoteId: fields[0],
      subjectId: fields[1],
      languageCode: fields[2],
      noteText: fields[3],
    };
    if (scopeNote.languageCode) {
      const language = lookupMap.get(scopeNote.languageCode);
      if (language) {
        scopeNote.languageName = language;
      }
    }

    const subject = subjectsMap.get(scopeNote.subjectId);
    if (subject) {
      if (!subject.scopeNotes) {
        subject.scopeNotes = [];
      }
      subject.scopeNotes.push(scopeNote);
    }
  });
}

export function sortSubjectProperties(subjectsMap: Map<string, UlanSubject>) {
  for (const subject of subjectsMap.values()) {
    subject.terms?.sort((a, b) => a.displayOrder - b.displayOrder);
    // sort biographies so that preferred biography ("P") is first:
    subject.biographies?.sort((a, b) => {
      if (a.preferred === 'P' && b.preferred !== 'P') {
        return -1;
      } else if (a.preferred !== 'P' && b.preferred === 'P') {
        return 1;
      } else {
        return 0;
      }
    });
    subject.nationalities?.sort((a, b) => a.displayOrder - b.displayOrder);
    subject.roles?.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}

export async function importUlan() {
  console.log('import ULAN data');
  const currentVersion = '0124';
  const dataDir = `./data/ulan/ulan_rel_${currentVersion}`;
  const outputFilePath = `./data/json/ulan_${currentVersion}.jsonl`;

  console.log('loading lookup values...');
  const lookupFilePath = `${dataDir}/LOOKUP_VALUES.out`;
  const lookupMap = await loadLookupValues(lookupFilePath);

  console.log('loading places...');
  const placesFilePath = `${dataDir}/PLACE.out`;
  const placesMap = await loadPlaces(placesFilePath);

  console.log('loading role values...');
  const roleFilePath = `${dataDir}/PTYPE_ROLE.out`;
  const roleMap = await loadRoleValues(roleFilePath);

  console.log('loading subjects map via terms...');
  const subjectsMap = await loadSubjectsMap(`${dataDir}/TERM.out`);

  console.log('loading biographies and nationalities...');
  await addBiographyToSubjects(
    `${dataDir}/BIOGRAPHY.out`,
    subjectsMap,
    placesMap
  );
  await addNationalityToSubjects(
    `${dataDir}/NATIONALITY.out`,
    subjectsMap,
    lookupMap
  );
  await addRoleToSubjects(
    `${dataDir}/PTYPE_ROLE_RELS.out`,
    subjectsMap,
    roleMap
  );
  await addScopeNotesToSubjects(
    `${dataDir}/SCOPE_NOTES.out`,
    subjectsMap,
    lookupMap
  );

  console.log('sorting subject properties...');
  sortSubjectProperties(subjectsMap);

  console.log('writing jsonl file...');
  await writeJsonLFile(subjectsMap, outputFilePath);

  console.log('updating elasticsearch...');
  await updateFromFile(INDEX_NAME, indexSettings, outputFilePath, 'subjectId');
}
