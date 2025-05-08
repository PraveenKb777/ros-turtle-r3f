import { useEffect, useState } from 'react';
import './App.css';
import CanvasView from './components/CanvasView';
import { getAllmission, resetState, setEnd, setPathBulk, setStart, setStation } from './redux/buttonsSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { saveMission } from './api/missions';

function App() {
  const dispatch = useAppDispatch()
  const { isMapping, start, path, end, allMission } = useAppSelector(e => e.buttonReducer)
  const [pathName, setPathName] = useState("")

  useEffect(() => {
    dispatch(getAllmission())
  }, [dispatch])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downsamplePath = (path: any) => {
    const simplified = [path[0]];
    for (let i = 1; i < path.length; i++) {
      const prev = simplified[simplified.length - 1];
      const curr = path[i];
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      if (dx * dx + dy * dy > 0.01) {
        simplified.push(curr);
      }
    }
    return simplified;
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <CanvasView />
      </div>
      <div className='buttons_cont' style={{ position: "absolute", top: 0, left: 0, display: "flex", flexDirection: "column", padding: 5 }}>
        <button onClick={() => {
          dispatch(setStation())
        }}>
          Make station
        </button>
        <button onClick={(() => {
          dispatch(setStation())
        })}>
          {isMapping ? "Stop Mapping..." : "Start mapping"}
        </button>
        <button>
          Run mission
        </button>
        <input value={pathName} onChange={(e) => setPathName(e.target.value)} />
        <button onClick={async () => {
          await saveMission({
            name: pathName,
            start: start!,
            end: end!,
            path: downsamplePath(path)
          });
          dispatch(getAllmission())
          dispatch(resetState())
        }}>
          Save path
        </button>
        {
          allMission.map(mission => (
            <button
              key={mission.name}
              onClick={() => {
                dispatch(resetState());
                dispatch(setPathBulk(mission.path));
                dispatch(setStart(mission.start));
                dispatch(setEnd(mission.end));
              }}
            >
              {mission.name}
            </button>
          ))
        }
      </div>
    </div>
  );
}

export default App;
