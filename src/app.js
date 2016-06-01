'use strict';

import parser from 'body-parser';
import express from 'express';
import http from 'http';

const API_KEY = 'AIzaSyCgoE5ehkC-r8TdeYkbQLHyaj--qhlH4_0';

let app = express();

app.use(parser.json());

app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/push', (req, res) => {
  res.send(req.body.endpoint);
});

http.createServer(app).listen(3000);
