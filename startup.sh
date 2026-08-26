#!/bin/sh
cd ~
tmux new -d -s proxy ./forever.sh ./proxy.js
tmux new -d -s server1 ./forever.sh ./server.js 0
tmux new -d -s server2 ./forever.sh ./server.js 1
tmux new -d -s server3 ./forever.sh ./server.js 2
tmux new -d -s server4 ./forever.sh ./server.js 3
tmux new -d -s pipe ./forever.sh ./pipe.js
tmux new -d -s concat ./forever.sh ./concat.js
tmux new -d -s starbot ./forever.sh ./starbot.js
tmux new -d -s colorbot ./forever.sh ./colorbot.js
