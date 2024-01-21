import * as T from '@elastic/elasticsearch/lib/api/types';

import * as S from '@/lib/elasticsearch/settings';
import {
  gettyScopeNoteObjectField,
  gettyTermObjectField,
} from '../globalIndexSettings';

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
  scopeNotes: gettyScopeNoteObjectField,
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
