require('dotenv').config();

const Prismic = require('@prismicio/client');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const express = require('express');
const methodOverride = require('method-override');
const logger = require('morgan');
const PrismicDOM = require('prismic-dom');

const app = express();
const path = require('path');

const port = 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIK_API_URL, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEM,
    req,
  });
};

const handleLinkResolver = doc => {
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`;
  }

  if (doc.type === 'about') {
    return `/about`;
  }

  if (doc.type === 'collections') {
    return `/collections`;
  }

  return '/';
};

app.use((req, res, next) => {
  // res.locals.ctx = {
  //   endpoint: process.env.PRISMIK_API_URL,
  //   linkResolver: handleLinkResolver,
  // };

  res.locals.Link = handleLinkResolver;

  res.locals.Numbers = index =>
    index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : '';

  res.locals.PrismicDOM = PrismicDOM;

  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const handleRequest = async api => {
  const meta = await api.getSingle('meta');
  const navigation = await api.getSingle('navigation');
  const preloader = await api.getSingle('preloader');

  return {
    meta,
    navigation,
    preloader,
  };
};

app.get('/', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const home = await api.getSingle('home');

  const { results: collections } = await api.query(
    Prismic.Predicates.at('document.type', 'collection'),
    { fetchLinks: 'product.image' },
  );

  res.render('pages/home', { ...defaults, collections, home });
});

app.get('/about', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const about = await api.getSingle('about');

  res.render('pages/about', { ...defaults, about });
});

app.get('/collections', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const home = await api.getSingle('home');

  const { results: collections } = await api.query(
    Prismic.Predicates.at('document.type', 'collection'),
    { fetchLinks: 'product.image' },
  );

  res.render('pages/collections', {
    ...defaults,
    collections,
    home,
  });
});

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);
  const product = await api.getByUID('product', req.params.uid);

  res.render('pages/detail', { ...defaults, product });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${3000}`);
});
