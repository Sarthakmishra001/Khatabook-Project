const express = require('express');
const path = require('path');

const multer = require('multer');
const storage = multer.memoryStorage()
module.exports = multer({ storage: storage })