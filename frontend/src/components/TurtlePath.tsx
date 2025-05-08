import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import ROSLIB from 'roslib';
import * as THREE from 'three';
import ros from '../api/ros';
import { setPose, setPath as setTurPath } from '../redux/buttonsSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { moveTurtle, subscribeToPose } from '../utils/moveturtle';

const teleportTurtle = new ROSLIB.Service({
    ros,
    name: '/turtle1/teleport_absolute',
    serviceType: 'turtlesim/TeleportAbsolute',
});


const teleportTo = (x: number, y: number, theta = 0) => {
    teleportTurtle.callService(
        new ROSLIB.ServiceRequest({ x, y, theta }),
        () => console.log(`Teleported to (${x}, ${y})`)
    );
};
const resetTurtle = new ROSLIB.Service({
    ros,
    name: '/reset',
    serviceType: 'std_srvs/Empty',
});

export default function TurtlePath() {
    const ref = useRef<THREE.Mesh>(null);

    const [hasMoved, setHasMoved] = useState(false);

    const { isMapping, end, pose, path: turPath, start } = useAppSelector(e => e.buttonReducer)
    const dispatch = useAppDispatch()
    const [path, setPath] = useState<THREE.Vector3[]>(() =>
        turPath.map(p => new THREE.Vector3(p.x - 5.5, 0.5, -p.y + 5.5))
    );
    useEffect(() => {
        if (turPath.length > 0) {
            const convertedPath = turPath.map(p => new THREE.Vector3(p.x - 5.5, 0.5, -p.y + 5.5));
            setPath(convertedPath);
        }
    }, [turPath]);
    console.log(start, end);

    useEffect(() => {
        resetTurtle.callService(new ROSLIB.ServiceRequest({}), () => {
            console.log('TurtleSim reset');
            setPath([]);
            setHasMoved(false);
        });
    }, []);

    useEffect(() => {
        subscribeToPose((newPose) => {
            const currPose = { x: parseFloat(newPose.x.toFixed(1)), y: parseFloat(newPose.y.toFixed(1)), theta: parseFloat(newPose.theta.toFixed(1)) }
            console.log(">>pose", pose, currPose)
            if (pose !== currPose) { dispatch(setPose(newPose)); }
        });
    }, [dispatch]);

    const moveAlongPath = async (convertedPath: THREE.Vector3[]) => {
        for (let i = 0; i < convertedPath.length; i++) {
            const pos = convertedPath[i];

            const targetX = pos.x + 5.5;
            const targetY = -pos.z + 5.5;

            let theta = 0;
            if (i > 0) {
                const prev = convertedPath[i - 1];
                const dx = targetX - (prev.x + 5.5);
                const dy = targetY - (-prev.z + 5.5);
                theta = Math.atan2(dy, dx);
            }

            teleportTo(targetX, targetY, theta);
            await new Promise(r => setTimeout(r, 300));
        }
    };


    useFrame(() => {
        if (ref.current) {
            const offsetX = pose.x - 5.5;
            const offsetY = pose.y - 5.5;
            const pos = new THREE.Vector3(offsetX, 0.5, -offsetY);
            ref.current.position.copy(pos);
            ref.current.rotation.y = -pose.theta;

            if (hasMoved && isMapping) {
                dispatch(setTurPath(pose))
                setPath((prev) => {
                    const last = prev[prev.length - 1];
                    if (!last || !last.equals(pos)) {
                        return [...prev, pos];
                    }
                    return prev;
                });
            }
        }
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    moveTurtle(2, 0);
                    setHasMoved(true);
                    break;
                case 'ArrowDown':
                    moveTurtle(-2, 0);
                    setHasMoved(true);
                    break;
                case 'ArrowLeft':
                    moveTurtle(0, 2);
                    setHasMoved(true);
                    break;
                case 'ArrowRight':
                    moveTurtle(0, -2);
                    setHasMoved(true);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <mesh ref={ref}  >
                <boxGeometry />
                <meshStandardMaterial color="red" />
            </mesh>
            {start ? (
                <mesh
                    scale={[0.5, 0.5, 0.5]}
                    position={new THREE.Vector3(start.x, 0.5, -start.y)}
                    onClick={() => {
                        teleportTo(start.x, start.y);
                        const converted = turPath.map(p => new THREE.Vector3(p.x - 5.5, 0.5, -p.y + 5.5));
                        moveAlongPath(converted);
                    }}
                >
                    <sphereGeometry />
                    <meshStandardMaterial color="green" />
                </mesh>
            ) : null}

            {end ? (
                <mesh
                    scale={[0.5, 0.5, 0.5]}
                    position={new THREE.Vector3(end.x, 0.5, -end.y)}
                    onClick={() => {
                        teleportTo(end.x, end.y);

                        const reversedPath = [...turPath].reverse().map(p => new THREE.Vector3(p.x - 5.5, 0.5, -p.y + 5.5));

                        moveAlongPath(reversedPath);
                    }}
                >
                    <sphereGeometry />
                    <meshStandardMaterial color="blue" />
                </mesh>
            ) : null}



            {path.length > 1 && (isMapping || (start && end)) ? (
                <Line
                    points={path}
                    color="white"
                    lineWidth={2}
                    dashed={false}
                />
            ) : null}
        </>
    );
}
