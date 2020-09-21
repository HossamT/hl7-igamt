FROM openjdk:8-jdk-alpine

EXPOSE 9000

RUN  apk update && apk upgrade && apk add netcat-openbsd bash curl shadow ca-certificates && update-ca-certificates

# Create the oarop user that runtime systems should run on by default.
# This user's UID must be set to 1000 to ensure alignment with the oarop
# user on the host system.
RUN sed --in-place -e '/CREATE_MAIL_SPOOL/ s/=yes/=no/' /etc/default/useradd
ARG opuser=hituser
ARG opuid=1000
RUN groupadd --gid $opuid $opuser && \
    useradd -m --comment "HIT Operations" --shell /bin/bash \
    --gid $opuid --uid $opuid $opuser

# Create Necessary Directories
RUN mkdir -p /usr/local/hl7-igamt
RUN mkdir -p /var/log/hl7-igamt

# Copy JAR File
COPY ./bootstrap/target/hl7-igamt.jar /usr/local/hl7-igamt/

# Copy Run Script
COPY run.sh /usr/local/bin/run-server.sh
RUN chmod a+rx /usr/local/bin/run-server.sh

# Copy Public Key
COPY ./unencryped_public_key.txt /usr/local/publicKey.txt

# Start Server
ENTRYPOINT [ "/usr/local/bin/run-server.sh" ] 
