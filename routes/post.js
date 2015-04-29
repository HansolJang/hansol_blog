var express = require('express');
var router = express.Router();
var db_user = require('../models/db_user');
var db_post = require('../models/db_post');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/write', function (req, res, next) {
    var user_id = req.session.user_id;
    var post_title = req.body.post_title;
    var post_content = req.body.post_content;
    console.log(req.body);

    if(!user_id) {
        res.end('<head><meta charset="utf-8"><script>alert("�α����� ���� ���ּ���!");history.back();</script></head>');
    } else {
        //user_id�� user_no ��ȸ
        db_user.getno([user_id], function(user_no) {
            if(user_no != undefined) {
                //�۾���
                var datas = [post_title, post_content, user_no];
                db_post.write(datas, function(success) {
                    if(success) {
                        res.redirect('/1');
                    } else {
                        res.end('<head><meta charset="utf-8"><script>alert("���ۼ��� �����Ͽ����ϴ�!");history.back();</script></head>');
                    }
                });
            }
        });
    }
});

router.get('/read/:page/:post_no', function (req, res, next) {
    var page = req.params.page;
    var post_no = req.params.post_no;

    var user_id = req.session.user_id;
    console.log('user_id', user_id);
    //if(user_id == undefined) {
    //    user_id = 'cannot check this user';
    //}
    db_post.read(post_no, function (data) {
        //res.json({result : data});
        console.log(data.user_id);
        res.render('post/read', {title: "details", data: data, page: page, user_id : user_id});
    });
});


router.post('/delete', function(req, res, next) {
    var post_no = req.body.post_no;
    var page = req.body.page;
    var user_id = req.session.user_id;

    db_post.delete([post_no], function(success) {
        if(success) {
            res.redirect('/' + page);
        }
    });
});

module.exports = router;