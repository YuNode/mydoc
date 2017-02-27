const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

const index = require('./routes/index');
const users = require('./routes/users');

//restful apis
const docs = require('./api/v1/docs');
const doc = require('./api/v1/doc');
const chapter = require('./api/v1/chapter');
const user = require('./api/v1/user');
const bookmarks = require('./api/v1/bookmarks');




// middlewareshn
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'hbs',
  map: { hbs: 'handlebars' }
}));

// logger
app.use(async (ctx, next) =>
{
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

router.use('/api/v1/docs', docs.routes(), users.allowedMethods());
router.use('/api/v1/docs/:name', doc.routes(), users.allowedMethods());
router.use('/api/v1/docs/:name/:chapter', chapter.routes(), users.allowedMethods());
router.use('/api/v1/user', user.routes(), users.allowedMethods());
router.use('/api/v1/bookmarks', bookmarks.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function (err, ctx)
{
  console.log(err)
  logger.error('server error', err, ctx);
});


module.exports = app;