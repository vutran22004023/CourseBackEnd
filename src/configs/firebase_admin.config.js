import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import logger from '../configs/logger.config.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../../firebase-cert.json');

try {
  const data = fs.readFileSync(filePath, 'utf8');
  const serviceAccount = JSON.parse(data);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  logger.error(err);
}

export default admin;
