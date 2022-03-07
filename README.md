# Elevator App

Dockerized React App modeling a basic Elevator.

To build, run `docker build -t elevator .` from the repository root. To run the container, run `docker run -it --rm -v "$(pwd):/app" -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true elevator` from the repository root.

Access the app at [http://localhost:3001](http://localhost:3001). The elevator takes 10 seconds at each floor stop, and 5 seconds to travel between floors. Click on the Floor buttons to summon the elevator to that floor, and click on the Car buttons to move to that floor. Open your browser's console to see a textual output of the elevator's movements, or just look at the Elevator Location in the Control Panel tab.
