const path = require(`path`);
const ms = require(`ms`);
const jwt = require(`jsonwebtoken`);
const bunyan = require(`bunyan`);

const body = require(`koa-bodyparser`);
const send = require(`koa-send`);
const serve = require(`koa-static`);
const koa = require(`koa`);

const app = new koa();
const logger = bunyan.createLogger({ name: `server` });

app.use(body());
app.use(serve(path.join(`public`)));
app.use(serve(path.join(`node_modules`)));

const settings = {
	cookies: {
		httpOnly: true,
		maxAge: ms(`5m`),
		path: `/wedding`,
	},
	port: 3000,
	secret: `shhhhh`,
	webtoken: {
		expiresIn: `5m`,
	},
};

const authorised = token => {
	let success = false;

	try {
		jwt.verify(token, settings.secret);

		success = jwt.decode(token).data === process.env.SECRET;
	} catch (err) {
		logger.error(err.message);
	}

	return success;
};

app.use(async (ctx, next) => {
	if (ctx.request.path.includes(`wedding`)) {
		const cookie = ctx.cookies.get(`token`);

		if (authorised(cookie)) {
			await send(ctx, `/private/the-wedding.html`);
		} else {
			ctx.redirect(`/login.html`);
		}
	} else {
		await next();
	}
});

app.use(async (ctx, next) => {
	if (ctx.request.path.includes(`/token`)) {
		const token = jwt.sign({
			data: ctx.request.body.password,
		}, settings.secret, settings.webtoken);

		ctx.cookies.set(`token`, token, settings.cookies);
		ctx.redirect(`/wedding?lang=${ctx.request.body.language}`);
	} else {
		await next();
	}
});

app.listen(settings.port, () => logger.info(`Server started on port ${settings.port}`));
