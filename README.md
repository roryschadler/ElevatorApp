# Elevator App

Dockerized React App modeling a basic Elevator.

To build, run `docker build -t elevator .` from the repository root. To run the container, run `docker run -it --rm -v "$(pwd):/app" -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true elevator` from the repository root.

Access the app at [http://localhost:3000](http://localhost:3000).
