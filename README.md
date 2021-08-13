# hasura-introduction

```sh
git clone git@github.com:busha98/hasura-introduction.git
cd hasura-introduction
npm i

# generate keys
sh generate-keys.sh

# init postgres
npm run docker:pg

# start auth-service
npm start auth-service

# start hasura (graphql server)
npm run start:hasura


# start auth-service in dev mode
npm start auth-service --watch

# kill hasura
docker rm -f hasura
```

