import { Client } from '@elastic/elasticsearch';

import { getEnvVar } from '@/lib/utils';

export function getClient(): Client {
  const useCloud = getEnvVar('ELASTICSEARCH_USE_CLOUD');
  const id = getEnvVar('ELASTICSEARCH_CLOUD_ID');
  const username = getEnvVar('ELASTICSEARCH_CLOUD_USERNAME');
  const password = getEnvVar('ELASTICSEARCH_CLOUD_PASSWORD');
  const localNode = getEnvVar('ELASTICSEARCH_LOCAL_NODE');

  const clientConfig =
    useCloud === 'true'
      ? {
          cloud: { id },
          auth: { username, password },
        }
      : {
          node: localNode,
        };

  const client = new Client(clientConfig);
  if (client === undefined) throw new Error('Cannot connect to Elasticsearch.');
  return client;
}
