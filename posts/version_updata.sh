#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t uniplanet/posts .


# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Docker image built successfully."
    
    # Run the Docker container
    echo "Updating Docker container..."
    docker push uniplanet/posts
    
    # Check if the container is running
    if [ $? -eq 0 ]; then
        kubectl rollout restart deployment posts-depl
    else
        echo "Failed to start Docker container."
    fi
else
    echo "Failed to build Docker image."
fi