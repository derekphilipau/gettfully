import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

import { importTgn } from '../import/tgn/importTgn';

importTgn();
