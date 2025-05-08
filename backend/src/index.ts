import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import missionRoutes from './routes/missions';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/missions', missionRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/turtle_mission')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
