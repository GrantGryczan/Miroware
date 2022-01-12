#!/bin/sh
cd ~
screen -d -m ./forever.sh ./proxy.js
screen -d -m ./forever.sh ./server.js production
screen -d -m ./forever.sh ./pipe.js
screen -d -m ./forever.sh ./concat.js
screen -d -m ./forever.sh ./starbot.js
screen -d -m ./forever.sh ./colorbot.js
