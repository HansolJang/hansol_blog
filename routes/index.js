var express = require('express');
var router = express.Router();
var db_post = require('../models/db_post');
var db_user = require('../models/db_user');

/* GET home page. */
router.get('/:page', function (req, res, next) {
    var page = req.params.page;
    var user_id = req.session.user_id;
    page = parseInt(page, 10);
    var data = [user_id, page];

    db_post.list(data, function(datas) {
        console.log('datas',datas);
    });
    //db_user.getno([user_id], function(user_no) {
    //    if(user_no != undefined) {
    //        var data = [user_no, user_id, page];
    //        db_post.list(data, function(datas) {
    //            console.log('datas',datas);
    //        });
    //    }
    //});

    //res.render('main', { user_id: req.session.user_id, page : page,title : "blog" });
});

module.exports = router;
