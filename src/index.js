'use strict';

import parser from 'body-parser';
import express from 'express';
import fs from 'fs';
import http2 from 'http2';

const API_KEY = 'AIzaSyCgoE5ehkC-r8TdeYkbQLHyaj--qhlH4_0';

let app = express();

app.use(parser.json());

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/push', (req, res) => {
  res.send(req.body.endpoint);
});

http2.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/registration.jclerck.co.uk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/registration.jclerck.co.uk/cert.pem'),
}, app).listen(443);
