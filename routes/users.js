var express = require('express');
var router = express.Router();
var db_user = require('../models/db_user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/join', function (req, res, next) {
  res.render('user/join', {title : "join"});
});

router.post('/join', function (req, res, next) {
  console.log(req.body);
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  var datas = [user_id, user_pw];

  db_user.join(datas, function(success) {
    if(success) {
      res.redirect('/1');
    } else {
      // res.json({"result" : "fail"});
      res.end('<head><meta charset="utf-8"><script>alert("�α��� ������ ������ �߻��Ͽ� �ǵ��ư��ϴ�!");history.back();</script></head>');
    }
  });
});

router.post('/login', function(req, res, next) {
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  var datas = [user_id, user_pw];

  db_user.login(datas, function(success) {
    if(success) {
      req.session.user_id = user_id;  //������ ����ִ� ���ǿ� ������� ���̵� ����!
      console.log('req.session.user_id', req.session.user_id);
      res.redirect('/1');
    } else {
      res.end('<head><meta charset="utf-8"><script>alert("�α��� ������ ������ �߻��Ͽ� �ǵ��ư��ϴ�!");history.back();</script></head>');
    }
  });
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    if(err) console.log('err', err);
    res.redirect('/1');
  });
});

router.post('/withdraw', function(req, res, next) {
  var user_id = req.session.user_id;
  var user_pw = req.body.withdraw_pw;
  var datas = [user_id, user_pw];

  db_user.withdraw(datas, function (success) {
    if(success) {
      req.session.destroy(function(err) {
        if(err) console.log('err', err);
        res.redirect('/1');
      });
    } else {
      res.end('<head><meta charset="utf-8"><script>alert("Ż�� �����Ͽ����ϴ�");history.back();</script></head>');
    }
  });
});


module.exports = router;