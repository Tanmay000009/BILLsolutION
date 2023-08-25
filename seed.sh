#!/bin/bash

# Build the Docker image using the current directory as the build context
docker build -t billion:seed -f Dockerfile.dev .

# Run the Docker container interactively,
# and using the .env file from the host machine as a volume inside the container
docker run -it --env-file .env billion:seed

# After the seeding process is done, remove the Docker image
docker rmi billion:seed