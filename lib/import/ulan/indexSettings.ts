import * as T from '@elastic/elasticsearch/lib/api/types';

import * as S from '@/lib/elasticsearch/settings';
import {
  gettyScopeNoteObjectField,
  gettyTermObjectField,
} from '../globalIndexSettings';

export const biographyObjectField: T.MappingProperty = {
  properties: {
    bioId: S.keywordField,
    biographyText: S.textField,
    birthDate: S.keywordField,
    birthPlaceId: S.keywordField,
    birthPlaceName: S.searchableAggregatedKeywordAnalyzerField,
    contributor: S.keywordField,
    deathDate: S.keywordField,
    deathPlaceId: S.keywordField,
    deathPlaceName: S.searchableAggregatedKeywordAnalyzerField,
    preferred: S.keywordField,
    sex: S.keywordField,
    subjectId: S.keywordField,
  },
};

export const nationalityObjectField: T.MappingProperty = {
  properties: {
    displayOrder: S.integerField,
    nationalId: S.keywordField,
    nationalityCode: S.keywordField,
    name: S.searchableAggregatedKeywordAnalyzerField,
    preferred: S.keywordField,
    subjectId: S.keywordField,
  },
};

export const roleObjectField: T.MappingProperty = {
  properties: {
    name: S.searchableAggregatedKeywordAnalyzerField,
    displayDate: S.keywordField,
    displayOrder: S.integerField,
    endDate: S.integerField,
    historicFlag: S.keywordField,
    preferred: S.keywordField,
    ptypeRoleId: S.keywordField,
    startDate: S.integerField,
    subjectId: S.keywordField,
  },
};

const ulanSubjectDocument: Record<T.PropertyName, T.MappingProperty> = {
  legacyId: S.keywordField,
  mergedStat: S.keywordField,
  parentKey: S.keywordField,
  recordType: S.keywordField,
  sortOrder: S.integerField,
  specialProj: S.keywordField,
  subjectId: S.keywordField,
  // don't worry about nesting these for now
  // later use nesting if need to search by multiple fields within an object
  terms: gettyTermObjectField,
  biographies: biographyObjectField,
  nationalities: nationalityObjectField,
  roles: roleObjectField,
  scopeNotes: gettyScopeNoteObjectField,
};

export const indexSettings: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: ulanSubjectDocument,
  },
};
