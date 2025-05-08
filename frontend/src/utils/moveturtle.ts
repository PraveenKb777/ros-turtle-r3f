import ROSLIB from 'roslib';
import ros from '../api/ros';

const cmdVel = new ROSLIB.Topic({
  ros,
  name: '/turtle1/cmd_vel',
  messageType: 'geometry_msgs/Twist',
});

export const moveTurtle = (linear: number, angular: number) => {
  const twist = new ROSLIB.Message({
    linear: { x: linear, y: 0, z: 0 },
    angular: { x: 0, y: 0, z: angular }
  });
  cmdVel.publish(twist);
};



const poseListener = new ROSLIB.Topic({
  ros,
  name: '/turtle1/pose',
  messageType: 'turtlesim/Pose',
});

export const subscribeToPose = (callback: (pose: { x: number; y: number; theta: number }) => void) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  poseListener.subscribe((message: any) => {


    callback({
      x: message.x,
      y: message.y,
      theta: message.theta,
    });
  });
};