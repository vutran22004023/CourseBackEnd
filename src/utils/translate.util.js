import axios from 'axios';
import logger from '../configs/logger.config.js';

class Translate {
  async translateText(text, sourceLang, targetLang) {
    try {
      const res = await axios.post('https://libretranslate.com/translate', {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      });
      return res.data.translatedText;
    } catch (err) {
      logger.error('Error translating text:', err);
    }
  }

  async detectLanguage(text) {
    try {
      const res = await axios.post('https://libretranslate.com/detect', {
        q: text,
      });
      return res.data[0].language;
    } catch (err) {
      logger.error('Error detecting language:', err);
    }
  }
}

export default new Translate();
