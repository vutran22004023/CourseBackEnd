import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import evaluateAlgorithm from '../utils/alg.util.js';
import { TournamentModel } from '../models/index.js';
import logger from '../configs/logger.config.js';
import i18n from 'i18n';
const pythonScriptPath = path.resolve('python', 'generate_problem.py');
const jsonFilePath = path.resolve('output.json');

class AlgorithmController {
  async generateAlgorithms(req, res) {
    try {
      const command = `python "${pythonScriptPath}"`;
      logger.info('Executing command:', command);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error(`exec error: ${error}`);
          return res.status(500).send(i18n.__('error.server'));
        }
        if (stderr) {
          logger.error(`stderr: ${stderr}`);
          return res.status(500).send(i18n.__('error.server'));
        }

        // Read the JSON file after the Python script has executed
        fs.readFile(jsonFilePath, 'utf8', (readError, data) => {
          if (readError) {
            logger.error(`Error reading JSON file: ${readError}`);
            return res.status(500).send(i18n.__('error.server'));
          }

          try {
            const jsonData = JSON.parse(data);

            // Return the JSON data as the response
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(jsonData);
          } catch (parseError) {
            logger.error(`Error parsing JSON data: ${parseError}`);
            res.status(500).send(i18n.__('error.server'));
          }
        });
      });
    } catch (error) {
      logger.error('Lỗi khi gọi script Python:', error);
      res.status(500).json({
        success: false,
        message: i18n.__('error.server'),
      });
    }
  }

  async checkAlgorithms(req, res) {
    const { ten, solution, userId, tournamentId } = req.body;

    try {
      // Đọc lại dữ liệu từ tệp JSON để đảm bảo là dữ liệu mới nhất
      const algorithms = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

      const algorithm = algorithms.find((alg) => alg.ten === ten);
      if (!algorithm) {
        return res.status(404).json({ error: i18n.__('algorithm.not_found') });
      }

      // Thực thi giải pháp của người dùng
      const userResult = await evaluateAlgorithm(solution, { test_data: algorithm.test_data });
      // So sánh với kết quả dự kiến nếu có
      const accuracy = userResult === algorithm.result ? 100 : 0;

      await TournamentModel.create({
        userId: userId,
        tournamentId: tournamentId,
        nameAlgorithm: algorithm.ten,
        solution: solution,
        result: userResult,
        expected_result: algorithm.result,
        message: accuracy === 100 ? i18n.__('algorithm.correct') : i18n.__('algorithm.incorrect'),
      });
      res.json({
        algorithm_name: algorithm.ten,
        accuracy: accuracy,
        description: algorithm.mo_ta,
        result: userResult,
        expected_result: algorithm.result,
        message: accuracy === 100 ? i18n.__('algorithm.correct') : i18n.__('algorithm.incorrect'),
      });
    } catch (error) {
      logger.error('Error executing solution:', error);
      res.status(500).json({ error: i18n.__('error.server') });
    }
  }
}

export default new AlgorithmController();
