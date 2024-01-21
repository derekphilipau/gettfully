import * as T from '@elastic/elasticsearch/lib/api/types';

export const index: T.IndicesIndexSettings = {
  number_of_shards: 1,
  number_of_replicas: 1,
};

export const unaggregatedStandardAnalyzer: T.AnalysisAnalyzer = {
  type: 'custom',
  tokenizer: 'standard',
  char_filter: ['hyphenApostropheMappingFilter'],
  filter: ['lowercase', 'asciifolding', 'enSnowball'],
};

export const aggregatedKeywordAnalyzer: T.AnalysisAnalyzer = {
  type: 'custom',
  tokenizer: 'keyword',
  char_filter: ['hyphenApostropheMappingFilter'],
  filter: ['lowercase', 'asciifolding'],
};

export const suggestAnalyzer: T.AnalysisAnalyzer = {
  type: 'custom',
  tokenizer: 'standard',
  char_filter: ['hyphenApostropheMappingFilter'],
  filter: ['lowercase', 'asciifolding'],
};

export const analysis: T.IndicesIndexSettingsAnalysis = {
  analyzer: {
    unaggregatedStandardAnalyzer,
    aggregatedKeywordAnalyzer,
    suggestAnalyzer,
  },
  char_filter: {
    hyphenApostropheMappingFilter: {
      type: 'mapping',
      mappings: ['-=>\\u0020', "'=>", '’=>'],
    },
  },
  filter: {
    enSnowball: {
      type: 'snowball',
      language: 'English',
    },
  },
};

export const keywordField: T.MappingProperty = { type: 'keyword' };
export const textField: T.MappingProperty = { type: 'text' };
export const objectField: T.MappingProperty = { type: 'object' };
export const disabledObjectField: T.MappingProperty = {
  type: 'object',
  enabled: false,
};
export const booleanField: T.MappingProperty = { type: 'boolean' };
export const shortField: T.MappingProperty = { type: 'short' };
export const integerField: T.MappingProperty = { type: 'integer' };
export const dateField: T.MappingProperty = { type: 'date' };
export const nestedField: T.MappingProperty = { type: 'nested' };

export const geoPointField: T.MappingProperty = { type: 'geo_point' };

export const unaggregatedStandardAnalyzerTextField: T.MappingProperty = {
  type: 'text',
  analyzer: 'unaggregatedStandardAnalyzer',
};

export const searchableAggregatedKeywordAnalyzerField: T.MappingProperty = {
  type: 'keyword',
  fields: {
    search: {
      type: 'text',
      analyzer: 'aggregatedKeywordAnalyzer',
    },
  },
};

export const suggestUnaggregatedStandardAnalyzerField: T.MappingProperty = {
  type: 'keyword',
  fields: {
    search: {
      type: 'text',
      analyzer: 'unaggregatedStandardAnalyzer',
    },
    suggest: {
      type: 'search_as_you_type',
      analyzer: 'suggestAnalyzer',
    },
  },
};
