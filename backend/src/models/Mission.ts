import mongoose from 'mongoose';

interface Point {
  x: number;
  y: number;
}

interface Mission {
  name: String,
  start: Point;
  end: Point;
  path: Point[];
  timestamp?: Date;
}

const MissionSchema = new mongoose.Schema<Mission>({
  name: String,
  start: { x: Number, y: Number },
  end: { x: Number, y: Number },
  path: [{ x: Number, y: Number, theta: Number }],
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<Mission>('Mission', MissionSchema);
