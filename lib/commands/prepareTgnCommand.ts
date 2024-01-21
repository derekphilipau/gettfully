import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

import { prepareTgnData } from '../import/tgn/importTgn';

prepareTgnData();
