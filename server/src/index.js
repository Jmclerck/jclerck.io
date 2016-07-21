'use strict';

import http from 'http';
import express from 'express';
import parser from 'body-parser';

// const API_KEY = 'AIzaSyCgoE5ehkC-r8TdeYkbQLHyaj--qhlH4_0';

const app = express();

app.use(parser.json());

app.all('/*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.get('/', (req, res) => res.send('Hello, World'));

app.post('/push', (req, res) => {
	res.send(req.body.endpoint);
});

http.createServer(app).listen(3000);
