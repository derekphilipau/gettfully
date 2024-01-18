import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());
import { importUlan } from '../import/ulan/importUlan';

importUlan();