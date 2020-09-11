const express = require('express')
const auth = require('../../config/auth')
const router = express.Router();
const path = require('path')

router.get('/welcome',(req, res) => {
    res.render('welcome')
})

module.exports = router