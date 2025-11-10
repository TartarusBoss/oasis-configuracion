FROM mysql:8.0

# Copy schema so MySQL initializes database on first run
# Use a path relative to the build context (the repository root). When
# building use: docker build -f backend/dockerfiles/mysql-custom/Dockerfile .
COPY database/schema.sql /docker-entrypoint-initdb.d/01-schema.sql

EXPOSE 3306
CMD ["mysqld"]
