const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8088;

// Configure Handlebars to use `.html` instead of `.hbs`
app.engine('html', engine({ extname: '.html', defaultLayout: false }));
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, JSON)
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', async (req, res) => {
    res.render('index', { title: 'LeftLane Community' });
});
app.get('/about', async (req, res) => {
    res.render('index', { title: 'About' });
});
app.get('/contact', async (req, res) => {
    res.render('index', { title: 'Contact Us' });
});
// Vercel support: Export Express app
module.exports = app;