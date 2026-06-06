import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import path from 'path';

export const reader = createReader(process.cwd(), keystaticConfig);
