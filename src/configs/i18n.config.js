import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
i18n.configure({
  locales: ['en', 'vi'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  autoReload: true,
  register: global,
  syncFiles: true,
  objectNotation: true,
  updateFiles: false,
});

export default i18n;
