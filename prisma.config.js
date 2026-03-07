import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
try {
    process.loadEnvFile(resolve(__dirname, '.env'));
} catch {}

export default {
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
}
