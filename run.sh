#!/bin/sh

echo "********************************************************"
echo "                    Starting HL7 IGAMT                  "
echo "********************************************************"

echo "Host auth is : ${AUTH_HOST}"

java -Xmx900m \
     -Xss256k \
     -Djava.security.egd=file:/dev/./urandom  \
     -Dspring.profiles.active=${PROFILE} \
     -Ddb.name=${MONGO_INITDB_DATABASE}  \
     -Ddb.host=${MONGO_HOST}  \
     -Ddb.port=${MONGO_PORT} \
     -Dkey.public=/usr/local/publicKey.txt \
     -Dauth.url=${AUTH_HOST} \
     -jar /usr/local/hl7-igamt/hl7-igamt.jar
