import axios from 'axios';
import logger from '../configs/logger.config.js';

class Translate {
  async translateText(text, sourceLang, targetLang) {
    const options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      },
      data: {
        from: sourceLang,
        to: targetLang,
        text,
      },
    };

    try {
      const res = await axios.request(options);
      return res.data.trans;
    } catch (err) {
      logger.error('Error translating text:', err);
    }
  }

  async detectLanguage(text) {
    const options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/detect-language',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      },
      data: { text },
    };

    try {
      const res = await axios.request(options);
      return res.data.source_lang_code;
    } catch (err) {
      logger.error('Error detecting language:', err);
    }
  }
}

export default new Translate();
