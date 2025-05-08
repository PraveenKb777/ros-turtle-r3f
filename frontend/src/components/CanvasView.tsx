import { Grid, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import TurtlePath from './TurtlePath';

export default function CanvasView() {
  return (
    <Canvas >
        <PerspectiveCamera position={[0, 30, 0]} rotation={[1, 0, 0]} makeDefault />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <TurtlePath />
      <OrbitControls />
      <Grid args={[10, 10]}
        cellSize={1}
        cellThickness={1}
        cellColor="#eaeaea"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#9d4b4b"
        infiniteGrid />
    </Canvas>
  );
}
