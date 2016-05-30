'use strict';

var nodemon = require('nodemon');

if (process.env.ENV === 'development') {
  nodemon({
    watch: [
      'src',
    ],
    exec: 'babel-node; passenger-config restart-app /dist',
  });

  nodemon.on('start', function () {
    console.log('App has started');
  }).on('quit', function () {
    console.log('App has quit');
  }).on('restart', function (files) {
    console.log('App restarted due to: ', files);
  });
}
