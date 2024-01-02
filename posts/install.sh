#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t uniplanet/posts .


# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Docker image built successfully."
    # docker push uniplanet/posts
    # Run the Docker container
    echo "Running Docker container..."
    docker run uniplanet/posts
    
    # docker run -d --name my_container posts
    # docker run -it posts sh # can modify docker inside
    # docker exec -it [container id ] [cmd]
    # docker log [container id] #docker log

    # Check if the container is running
    if [ $? -eq 0 ]; then
        echo "Docker container is running."
    else
        echo "Failed to start Docker container."
    fi
else
    echo "Failed to build Docker image."
fi