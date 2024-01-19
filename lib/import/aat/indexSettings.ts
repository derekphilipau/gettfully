import * as T from '@elastic/elasticsearch/lib/api/types';

import * as S from '@/lib/elasticsearch/settings';

const gettyTermObjectField: T.MappingProperty = {
  properties: {
    aacr2Flag: S.keywordField,
    displayDate: S.keywordField,
    displayName: S.keywordField,
    displayOrder: S.integerField,
    endDate: S.keywordField,
    historicFlag: S.keywordField,
    otherFlags: S.keywordField,
    preferred: S.keywordField,
    startDate: S.keywordField,
    subjectId: S.keywordField,
    term: S.suggestUnaggregatedStandardAnalyzerField,
    termId: S.keywordField,
    vernacular: S.keywordField,
  },
};

const aatScopeNoteObjectField: T.MappingProperty = {
  properties: {
    scopeNoteId: S.keywordField,
    subjectId: S.keywordField,
    languageCode: S.keywordField,
    noteText: S.textField,
  },
};

const aatSubjectDocument: Record<T.PropertyName, T.MappingProperty> = {
  facetCode: S.keywordField,
  legacyId: S.keywordField,
  mergedStat: S.keywordField,
  parentKey: S.keywordField,
  recordType: S.keywordField,
  sortOrder: S.integerField,
  specialProj: S.keywordField,
  subjectId: S.keywordField,
  terms: gettyTermObjectField,
  scopeNotes: aatScopeNoteObjectField,
};

export const indexSettings: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: aatSubjectDocument,
  },
};
