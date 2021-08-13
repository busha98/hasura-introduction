#! /bin/bash

JWT_SECRET=$(cat ./keys/hasura.RS256.key.pub)
#JWT_SECRET=${JWT_SECRET%.}
ADMIN_SECRET=admin_secret
UNAUTHORIZED_ROLE=guest
USER_NAME=postgres
PASSWORD=password
HOST_NAME=host.docker.internal
DB_PORT=5555
DB_NAME=dev
NAME=hasura
PATH_TO_METADATA=$PWD/apps/hasura/metadata
PATH_TO_MIGRATIONS=$PWD/apps/hasura/migrations
PATH_TO_SEEDS=$PWD/apps/hasura/seeds
PATH_TO_CONFIG=$PWD/apps/hasura/config.yaml

docker run -p 8080:8080 \
  --name $NAME \
  -v $PATH_TO_METADATA:/hasura-metadata \
  -v $PATH_TO_MIGRATIONS:/hasura-migrations \
  -v $PATH_TO_SEEDS:/seeds \
  -v $PATH_TO_CONFIG:/config.yaml \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://$USER_NAME:$PASSWORD@$HOST_NAME:$DB_PORT/$DB_NAME \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  -e HASURA_GRAPHQL_ADMIN_SECRET=$ADMIN_SECRET \
  -e HASURA_GRAPHQL_JWT_SECRET="{\"type\": \"RS256\", \"key\": \"$JWT_SECRET\"}" \
  -e HASURA_GRAPHQL_UNAUTHORIZED_ROLE=$UNAUTHORIZED_ROLE \
  hasura/graphql-engine:v2.0.0-alpha.7.cli-migrations-v3
  # hasura/graphql-engine:v1.2.0.cli-migrations-v2

# https://hasura.io/docs/latest/graphql/core/migrations/advanced/auto-apply-migrations.html
# TODO:! add claims_namespace or claims_namespace_path
