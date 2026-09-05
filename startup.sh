#!/bin/sh
cd ~
tmux new -d -s proxy ./forever.sh ./proxy.js
tmux new -d -s server0 ./forever.sh ./server.js 0
tmux new -d -s server1 ./forever.sh ./server.js 1
tmux new -d -s server2 ./forever.sh ./server.js 2
tmux new -d -s server3 ./forever.sh ./server.js 3
tmux new -d -s pipe0 ./forever.sh ./pipe.js 0
tmux new -d -s pipe1 ./forever.sh ./pipe.js 1
tmux new -d -s pipe2 ./forever.sh ./pipe.js 2
tmux new -d -s pipe3 ./forever.sh ./pipe.js 3
tmux new -d -s concat ./forever.sh ./concat.js
tmux new -d -s starbot ./forever.sh ./starbot.js
tmux new -d -s colorbot ./forever.sh ./colorbot.js
