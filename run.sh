#!/bin/sh
cd NodeJS/
./node_modules/.bin/pm2 kill
node_modules/.bin/pm2 start -f src/index.js --watch
cd ../ReactJS/
npm start