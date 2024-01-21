import type {
  AatSubject,
  AatSubjectRecordType,
  GettyScopeNote,
  GettySubjectMergedStatType,
  GettyTerm,
  GettyTermHistoricFlag,
  GettyTermPreferred,
  GettyTermVernacular,
} from '@/types';

import { processFileLineByLine, writeJsonLFile } from '../util/fileUtils';
import updateFromFile from '../util/updateFromFile';
import { indexSettings } from './indexSettings';

const INDEX_NAME = 'aat-subjects';

export async function loadSubjectsMap(
  filePath: string
): Promise<Map<string, AatSubject>> {
  const subjectsMap = new Map<string, AatSubject>();

  await processFileLineByLine(filePath, async (line) => {
    const fields = line.split('\t');
    const subject: AatSubject = {
      type: 'aat',
      facetCode: fields[0],
      legacyId: fields[1],
      mergedStat: fields[2] as GettySubjectMergedStatType,
      parentKey: fields[3],
      recordType: fields[4] as AatSubjectRecordType,
      sortOrder: fields[5] ? parseInt(fields[5]) : undefined,
      specialProj: fields[6],
      subjectId: fields[7],
    };
    subjectsMap.set(subject.subjectId, subject);
  });

  return subjectsMap;
}

async function addTermToSubjects(
  termFilePath: string,
  subjectsMap: Map<string, AatSubject>
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
  subjectsMap: Map<string, AatSubject>
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

export function sortSubjectProperties(subjectsMap: Map<string, AatSubject>) {
  for (const subject of subjectsMap.values()) {
    subject.terms?.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}

export async function importAat() {
  console.log('import AAT data');
  const currentVersion = '0124';
  const dataDir = `./data/aat/aat_rel_${currentVersion}`;
  const outputFilePath = `./data/json/aat_${currentVersion}.jsonl`;

  console.log('AAT: loading subjects map...');
  const subjectsMap = await loadSubjectsMap(`${dataDir}/SUBJECT.out`);

  console.log('AAT: loading terms...');
  await addTermToSubjects(`${dataDir}/TERM.out`, subjectsMap);

  console.log('AAT: loading scope notes...');
  await addScopeNotesToSubjects(`${dataDir}/SCOPE_NOTES.out`, subjectsMap);

  console.log('sorting subject properties...');
  sortSubjectProperties(subjectsMap);

  console.log('writing jsonl file...');
  await writeJsonLFile(subjectsMap, outputFilePath);

  console.log('updating elasticsearch...');
  await updateFromFile(INDEX_NAME, indexSettings, outputFilePath, 'subjectId');
}
