export interface Point {
  x: number;
  y: number;
}

export interface Mission {
  name: string
  start: Point;
  end: Point;
  path: { x: number; y: number; theta: number }[];
  timestamp?: string;
}
