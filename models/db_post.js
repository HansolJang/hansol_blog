var mysql = require('mysql');
var db_config = require('./db_config');

var pool = mysql.createPool(db_config);

exports.write = function (datas, callback) {
    pool.getConnection(function (err, conn) {
        if (err) console.error('err', err);
        var sql = "insert into post(post_title, post_content, post_date, user_no) values(?, ?, now(), ?)";
        conn.query(sql, datas, function (err, row) {
            if (err) console.error('err', err);
            console.log('row', row);
            var success = false;
            if (row.affectedRows == 1) {
                success = true;
            }
            conn.release();
            callback(success);
        });
    });
};

exports.list = function (data, callback) {
    var user_id = data[0];
    var page = data[1];
    pool.getConnection(function (err, conn) {
        if (err) console.error('err', err);
        conn.query("select count(*) as cnt from post", [], function (err, rows) {
            //console.log('rows', rows);
            var cnt = rows[0].cnt;                  //총 갯수
            var size = 10;                          //한페이지에 보여줄 컨텐츠 갯수
            var totalPage = Math.ceil(cnt / size);  //총 페이지 갯수, size = 한페이지에 보여줄 컨텐츠 갯수
            var pageSize = 10;
            var begin = (page - 1) * size; //db에서 꺼내올 시작 글번호 (1,2,3...++)
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //pageSize에 따른 첫 페이지 번호
            var endPage = startPage + (pageSize - 1);       //한페이지에 startPage~endPage 까지 링크가 걸려있음
            if (endPage > totalPage) endPage = totalPage;    //마지막의 경우 없는 페이지까지 나오면 안됨
            var max = cnt - ((page - 1) * size);          //페이지에 뿌려줄 시작 글번호 (123,122,121...--)

            conn.query("select post_no, post_title, post_content, DATE_FORMAT(post_date, '%Y.%m.%d') post_date, (select user_id from user b where b.user_no = a.user_no) as user_id from post a order by post_no desc limit ?, ?",
                [begin, size], function (err, rows) {
                    if (err) console.error('err', err);
                    //console.log('rows', rows);
                    var datas = {
                        data: rows,
                        user_id: user_id,
                        title: "blog",
                        page: page,
                        pageSize: pageSize,
                        startPage: startPage,
                        endPage: endPage,
                        totalPage: totalPage,
                        max: max
                    };
                    conn.release();
                    callback(datas);
                });
        });
    });
};

//select post_no, post_title, post_content, post_date,
//    (select user_id from user b where b.user_no = a.user_no) as user_id from post a order by post_no desc

exports.read = function (post_no, callback) {
    pool.getConnection(function (err, conn) {
        if (err) console.err('err', err);
        //내용 가져오기
        conn.query('select post_no, post_title, post_content, DATE_FORMAT(post_date, "%Y.%m.%d") post_date, (select user_id from user b where b.user_no = a.user_no) as user_id from post a where post_no=? order by post_no desc',
            [post_no], function (err, rows) {
                if (err) console.err('err', err);
                console.log('rows', rows);
                conn.release();
                callback(rows[0]);
            });

    });
};


exports.delete = function (data, callback) {
    pool.getConnection(function (err, conn) {
        if (err) console.err('err', err);
        var sql = "delete from post where post_no=?";
        conn.query(sql, data, function (err, row) {
            if (err) console.error('err', err);
            var success = false;
            console.log('row', row);
            if (row.affectedRows == 1) success = true;
            conn.release();
            callback(success);
        });
    });
};


/*
 CREATE TABLE `post` (
 `post_no` INT(11) NOT NULL AUTO_INCREMENT,
 `user_no` INT(11) NOT NULL,
 `post_title` VARCHAR(50) NOT NULL,
 `post_content` VARCHAR(1000) NOT NULL,
 `post_date` DATE NOT NULL,
 `post_delete` INT(11) NOT NULL DEFAULT '0',
 PRIMARY KEY (`post_no`),
 INDEX `user_no` (`user_no`),
 CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
 )
 */