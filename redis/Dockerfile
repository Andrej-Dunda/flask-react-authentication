# Use the official Redis image from the Docker Hub
FROM redis:latest

# Copy the configuration file from the local filesystem to the Redis container
COPY redis.conf /usr/local/etc/redis/redis.conf
COPY sentinel.conf /usr/local/etc/redis/sentinel.conf

# Command to run when the container starts
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]