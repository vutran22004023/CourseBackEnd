import express from 'express';
import TournamentController from '../controllers/tournament.controller.js';
import { AuthMiddleware } from '../middlewares/index.js';

const router = express.Router();

router.get('/all', TournamentController.getAll);
router.get('/detail/:id', TournamentController.getDetail);
router.get('/:id/ranking', TournamentController.getRanking);
// router.put('/update-user/:id', AuthMiddleware.authTournament, TournamentController.updateTournament);
// router.delete('/delete-user/:id', AuthMiddleware.authAdmin, TournamentController.deleteTournament);
// router.post('/delete-many-user', AuthMiddleware.authAdmin, TournamentController.deleteManyTournament);
// router.post('/create-user', AuthMiddleware.authAdmin, TournamentController.createTournament);

export default router;
