
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import moduleAlias from 'module-alias';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

moduleAlias.addAliases({
  '@': join(__dirname, './')
});

export default moduleAlias;