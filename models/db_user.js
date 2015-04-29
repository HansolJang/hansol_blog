var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

exports.getno = function (data, callback) {
    pool.getConnection(function (err, conn) {
        if(err) console.log('err', err);
        else {
            //console.log('conn', conn);
            var sql = "select user_no from user where user_id=? and user_withdraw=0";
            conn.query(sql, data, function (err, rows) {
                if(err) console.log('err',err);
                else {
                    //console.log('row', rows);
                    var user_no = rows[0].user_no;
                    conn.release();
                    callback(user_no);
                }
            });
        }
    });
};

exports.join = function (data, callback) {
    pool.getConnection(function(err, conn) { //pool을 사용해서 일처리
        if(err) {
            console.log('err',err);
            res.json(req.body);
        }
        else {
            console.log('conn',conn);
            //console.log(data);
            var sql = "insert into user(user_id, user_pw) values(?, ? )";
            conn.query(sql, data, function(err, row) {
                if(err) console.log('err',err);
                else {
                    console.log('row', row);
                    var success = false;
                    if(row.affectedRows == 1) { //성공했으면
                        success = true;
                    }
                    conn.release();
                    callback(success);
                }
            }); //회원가입 json 디비에 insert하기 -> 일처리
        }
    });
};


exports.login = function(datas, callback) {
    // res.json({"result" : "success"}); //더미 항상 성공!
    pool.getConnection(function(err, conn) {
        //err처리 해줘야함!
        conn.query('select count (*) as cnt from user where user_id=? and user_pw=? and user_withdraw=0', datas, function(err, rows) {
            // console.log('rows', rows);
            // res.json({"result" : rows});
            if(err) {
                console.log('err', err);
            }
            var success = false;
            if(rows[0].cnt == 1) {
                success = true;
            }
            conn.release();
            callback(success);
        });
    });
};

exports.withdraw = function(data, callback) {
    pool.getConnection(function(err, conn) {
        var sql = "update user set user_withdraw=1 where user_id=? and user_pw=? and user_withdraw=0";

        conn.query(sql, data, function(err, row) {
            if(err) console.log('err',err);
            console.log('row', row);
            var success = false;
            if(row.affectedRows == 1) {
                success = true;
            }
            conn.release();
            callback(success);
        });
    });
};
