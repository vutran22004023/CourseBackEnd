import Tournament from '../../models/tournament.model.js';
import i18n from 'i18n';

class TournamentService {
  async getAll(limit, page, sort, filter) {
    const total = await Tournament.countDocuments();
    const query = {};
    const options = {
      limit: limit,
      skip: page * limit,
    };
    if (filter) {
      query[filter[0]] = { $regex: filter[1], $options: 'i' };
    }
    if (sort) {
      options.sort = { [sort[1]]: sort[0] };
    }
    const allTournaments = await Tournament.find(query, null, options).select('-ranking -description').lean();
    return {
      status: 200,
      message: i18n.__('tournament.view_all'),
      data: allTournaments,
      total: total,
      pageCurrent: Number(page),
      totalPage: Math.ceil(total / limit),
    };
  }

  async getDetail(id) {
    const tournament = await Tournament.findOne({ _id: id }).select('-ranking').lean();
    if (!tournament) {
      return {
        status: 'ERR',
        message: i18n.__('tournament.not_found'),
      };
    }
    return {
      status: 200,
      message: '',
      data: {
        tournament,
      },
    };
  }

  async getRanking(id) {
    const tournament = await Tournament.findOne({ _id: id }).lean();
    if (tournament.end > Date.now() || tournament.ranking.length === 0) {
      return {
        status: 'ERR',
        message: i18n.__('ranking.not_found'),
      };
    }
    return {
      status: 200,
      message: '',
      data: {
        ranking: tournament.ranking,
      },
    };
  }
}

export default new TournamentService();
