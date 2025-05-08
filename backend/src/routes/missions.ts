import express from 'express';
import Mission from '../models/Mission';

const router = express.Router();

router.get('/', async (req, res) => {
  const missions = await Mission.find().sort({ timestamp: -1 });
  res.json(missions);
});

router.post('/', async (req, res) => {
  const { start, end, path, name } = req.body;
  const mission = new Mission({ start, end, path, name });
  await mission.save();
  res.status(201).json(mission);
});

export default router;
