#!/bin/bash

zip -q -r apps.zip server
scp -v -r ./apps.zip APPS@$DROPLET_IP:/home/apps
yes | ssh -v APPS@$DROPLET_IP "unzip -o apps.zip"
yes | ssh -v APPS@$DROPLET_IP "pm2 stop ./server/server.js"
yes | ssh -v APPS@$DROPLET_IP "pm2 start ./server/server.js"