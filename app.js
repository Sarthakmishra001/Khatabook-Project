const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');
require('dotenv').config();

const app = express();
const indexRouter = require('./routes/indexRouter');
const hisaabRouter = require('./routes/hisaabRouter');
const db = require('./config/mongooseconnection');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/hisaab', hisaabRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  if (res.headersSent) return next(err);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
