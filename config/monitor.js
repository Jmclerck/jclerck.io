/* eslint-disable no-console */

'use strict';

import proc from 'child_process';
import nodemon from 'nodemon';
import npm from 'npm';

var args = [
  '--app-type node',
  `--environment ${process.env.NODE_ENV}`,
  '--startup-file dist/app.js',
];

var opts = {
  cwd: '.',
  shell: true,
};

const passenger = proc.spawn('passenger start', args, opts);

passenger.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});

passenger.stderr.on('data', data => {
  console.log(`stderr: ${data}`);
});

passenger.on('close', code => {
  console.log(`child process exited with code ${code}`);
});

if (process.env.NODE_ENV === 'production') {
  // In production we only want to kick off the build step once
  npm.load({}, err => {
    if (!err) {
      npm.commands.run([
        'build',
      ]);
    }
  });
} else {
  /*
   *  In development we want to kick off the build step once,
   *  then again when changes occur, and reload passenger
   */
  nodemon({
    watch: [
      'src',
    ],
    exec: 'npm run build; passenger-config restart-app .',
  }).on('start', () => {
    console.log('App has started');
  }).on('quit',  () => {
    console.log('App has quit');
  }).on('restart', files => {
    console.log('App restarted due to: ', files);
  });
}
