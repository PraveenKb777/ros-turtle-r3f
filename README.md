# TurtleSim Web App with ROS 2

This project is a full-stack web application that integrates a **frontend** and **backend** with **ROS 2 TurtleSim** via WebSocket communication using `rosbridge_server`.

---

##  Project Structure

repo/ \
├── frontend/ # Frontend app (e.g., React, Vite) \
└── backend/ # Backend server (e.g., Node.js, Express) \


## Getting Started

### Step 1: Clone the Repository

git clone [https://github.com/PraveenKb777/ros-turtle-r3f.git](https://github.com/PraveenKb777/ros-turtle-r3f.git) \
`cd ros-turtle-r3f` \
Step 2: Start ROS 2 Nodes
Make sure your ROS 2 environment is sourced properly before running these commands:

# Terminal 1: Start rosbridge WebSocket server
ros2 launch rosbridge_server rosbridge_websocket_launch.xml

# Terminal 2: Start turtlesim node
ros2 run turtlesim turtlesim_node
These are required for the application to communicate with the ROS 2 backend and visualize TurtleSim.

## Final Video

[Watch the final video](https://drive.google.com/file/d/1MZWEZDAzwqev3LWRASAlmyaHR4m9rE8Q/view?usp=sharing)

Step 3: Start the Backend Server

`cd backend` \
`npm install` \
`npm run dev`

Step 4: Start the Frontend App
In a new terminal:

`cd frontend` \
`npm install` \
`npm run dev`
