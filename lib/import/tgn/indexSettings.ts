import * as T from '@elastic/elasticsearch/lib/api/types';

import * as S from '@/lib/elasticsearch/settings';
import {
  gettyScopeNoteObjectField,
  gettyTermObjectField,
} from '../globalIndexSettings';

export const tgnCoordinatesObjectField: T.MappingProperty = {
  properties: {
    elevationFeet: S.integerField,
    elevationMeters: S.integerField,
    location: S.geoPointField,
    boundingBoxLeast: S.geoPointField,
    boundingBoxMost: S.geoPointField,
    subjectId: S.keywordField,
  },
};

export const tgnSubjectDocument: Record<T.PropertyName, T.MappingProperty> = {
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
  coordinates: tgnCoordinatesObjectField,
};

export const indexSettings: T.IndicesIndexSettings = {
  settings: {
    index: S.index,
    analysis: S.analysis,
  },
  mappings: {
    properties: tgnSubjectDocument,
  },
};
