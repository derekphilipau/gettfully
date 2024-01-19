import type {
  UlanBiography,
  UlanNationality,
  UlanRole,
  UlanSubject,
  UlanTerm,
} from '@/types';

import updateFromFile from '../util/updateFromFile';
import { processFileLineByLine, writeJsonLFile } from './fileUtils';
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

type UlanPlace = {
  name: string;
  type: string;
};
async function loadPlaces(filePath: string): Promise<Map<string, UlanPlace>> {
  const lookupMap = new Map<string, UlanPlace>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const name = fields[0];
    const type = fields[1];
    const id = fields[2];
    lookupMap.set(id, { name, type });
  });

  return lookupMap;
}

async function loadRoleValues(filePath: string): Promise<Map<string, string>> {
  const lookupMap = new Map<string, string>();
  // biochemist	41152
  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const id = fields[1];
    const value = fields[0];
    lookupMap.set(id, value);
  });

  return lookupMap;
}

export async function loadSubjectsMap(
  filePath: string
): Promise<Map<string, UlanSubject>> {
  const subjectsMap = new Map<string, UlanSubject>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const term: UlanTerm = {
      aacr2Flag: fields[0],
      displayDate: fields[1],
      displayName: fields[2],
      displayOrder: parseInt(fields[3]),
      endDate: parseInt(fields[4]),
      historicFlag: fields[5],
      otherFlags: fields[6],
      preferred: fields[7],
      startDate: parseInt(fields[8]),
      subjectId: fields[9],
      termEntry: fields[10],
      termId: fields[11],
      vernacular: fields[12],
    };

    const subject = subjectsMap.get(term.subjectId);
    if (!subject) {
      const subject: UlanSubject = {
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
  subjectsMap: Map<string, UlanSubject>
) {
  await processFileLineByLine(biographyFilePath, async (line) => {
    const fields = line.split('\t'); // Adjust based on actual file format
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
    const fields = line.split('\t'); // Adjust based on actual file format
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
    const fields = line.split('\t'); // Adjust based on actual file format
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
  await addBiographyToSubjects(`${dataDir}/BIOGRAPHY.out`, subjectsMap);
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

  console.log('sorting subject properties...');
  sortSubjectProperties(subjectsMap);

  console.log('writing jsonl file...');
  await writeJsonLFile(subjectsMap, outputFilePath);

  console.log('updating elasticsearch...');
  await updateFromFile(INDEX_NAME, indexSettings, outputFilePath, 'subjectId');
}
