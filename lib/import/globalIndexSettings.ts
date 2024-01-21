import * as T from '@elastic/elasticsearch/lib/api/types';

import * as S from '@/lib/elasticsearch/settings';

export const gettyTermObjectField: T.MappingProperty = {
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

export const gettyScopeNoteObjectField: T.MappingProperty = {
  properties: {
    scopeNoteId: S.keywordField,
    subjectId: S.keywordField,
    languageCode: S.keywordField,
    languageName: S.keywordField,
    noteText: S.textField,
  },
};
