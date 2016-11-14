const fs = require('fs');
const path = require('path');
const ms = require('ms');
const express = require('express');
const jwt = require('jsonwebtoken');
const body = require('body-parser');
const cookies = require('cookie-parser');

const app = express();
const settings = {
	cookies: {
		httpOnly: true,
		maxAge: ms('1m'),
		path: '/wedding',
	},
	port: 3000,
	secret: 'shhhhh',
	webtoken: {
		expiresIn: '1m',
	},
};

const authorised = cookie => {
	let success = false;

	if (cookie === undefined) {
		success = false;
	} else if (Object.keys(cookie).length === 0) {
		success = false;
	} else {
		try {
			jwt.verify(cookie.token, settings.secret);

			success = jwt.decode(cookie.token).data === process.env.SECRET;
		} catch (err) {
			success = false;
		}
	}

	return success;
};

app.use(cookies());
app.use('/', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.get('/wedding', (req, res) => {
	if (authorised(req.cookies)) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync(path.join('private/the-wedding.html'), 'utf8'));
	} else {
		res.redirect('/login.html');
	}
});

app.post('/token', body.urlencoded({ extended: false }), (req, res) => {
	const token = jwt.sign({
		data: req.body.password,
	}, settings.secret, settings.webtoken);

	res.cookie('token', token, settings.cookies);
	res.redirect('/wedding');
});

app.listen(settings.port, () => console.log(`Server started on port ${settings.port}`));
