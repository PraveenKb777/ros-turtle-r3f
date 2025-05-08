import ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090',
});

ros.on('connection', () => console.log('Connected to ROS'));
ros.on('error', (err) => console.error('ROS Error:', err));
ros.on('close', () => console.log('Connection to ROS closed'));

export default ros;
