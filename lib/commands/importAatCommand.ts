import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

import { importAat } from '../import/aat/importAat';

importAat();
