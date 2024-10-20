import { TournamentService } from '../services/index.js';

class TournamentController {
  async getAll(req, res) {
    try {
      const { limit, page, sort, filter } = req.query;
      const limitValue = parseInt(limit) || 30;
      const pageValue = parseInt(page) || 0;
      const sortArray = sort ? sort.split(':') : null;
      const filterArray = filter ? filter.split(':') : null;
      const result = await TournamentService.getAll(limitValue, pageValue, sortArray, filterArray);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({
        message: err,
      });
    }
  }

  async getDetail(req, res) {
    try {
      const tournamentId = req.params.id;
      const response = await TournamentService.getDetail(tournamentId);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: err,
      });
    }
  }

  async getRanking(req, res) {
    try {
      const tournamentId = req.params.id;
      const response = await TournamentService.getRanking(tournamentId);
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json({
        message: err,
      });
    }
  }
}

export default new TournamentController();
