/* eslint-disable no-console */

'use strict';

import spawn from 'child_process';
import nodemon from 'nodemon';

let ls = spawn.exec(`passenger start --app-type node --environment ${process.env.ENV} --startup-file dist/app.js`);

ls.stdout.on('data', (data) => {
  console.log(data);
});

ls.stderr.on('data', (data) => {
  console.log(data);
});

ls.on('close', (code) => {
  console.log(`Child exited with code ${code}`);
});

if (process.env.ENV !== 'production') {
  nodemon({
    watch: [
      'src',
    ],
    exec: 'npm run build; passenger-config restart-app /root/passenger',
  });

  nodemon.on('start', function () {
    console.log('App has started');
  }).on('quit', function () {
    console.log('App has quit');
  }).on('restart', function (files) {
    console.log('App restarted due to: ', files);
  });
}
