#!/usr/bin/env sh
mkdir keys
ssh-keygen -t rsa -b 4096 -m PEM -f keys/RS256.key
# Don't add passphrase
openssl rsa -in keys/RS256.key -pubout -outform PEM -out keys/RS256.key.pub

sed 's/$/\\/' keys/RS256.key.pub | tr '\n' 'n' > keys/hasura.RS256.key.pub
