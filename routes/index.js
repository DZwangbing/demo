var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.header('Content-Type', 'text/html;charset=utf-8');
    res.render("index", { title: 'Wechaty' });
})

module.exports = router;