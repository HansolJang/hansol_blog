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
            var size = 15;                          //한페이지에 보여줄 컨텐츠 갯수
            var totalPage = Math.ceil(cnt / size);  //총 페이지 갯수, size = 한페이지에 보여줄 컨텐츠 갯수
            var pageSize = 10;
            var begin = (page - 1) * size; //db에서 꺼내올 시작 글번호 (1,2,3...++)
            var startPage = Math.floor((page - 1) / pageSize) * pageSize + 1; //pageSize에 따른 첫 페이지 번호
            var endPage = startPage + (pageSize - 1);       //한페이지에 startPage~endPage 까지 링크가 걸려있음
            if (endPage > totalPage) endPage = totalPage;    //마지막의 경우 없는 페이지까지 나오면 안됨
            var max = cnt - ((page - 1) * size);          //페이지에 뿌려줄 시작 글번호 (123,122,121...--)

            conn.query("select post_no, post_title, post_content, DATE_FORMAT(post_date, '%Y-%m-%d') post_date, user_no from post order by post_no desc limit ?, ?",
                [begin, size], function (err, rows) {
                    if (err) console.error('err', err);
                    //console.log('rows', rows);
                    var datas = {
                        data: rows,
                        user_id : user_id,
                        title : "blog",
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

exports.read = function (num, callback) {
    pool.getConnection(function (err, conn) {
        if (err) console.err('err', err);
        //내용 가져오기
        conn.query('select post_no, post_title, post_content, DATE_FORMAT(regdate, "%Y-%m-%d %H:%i:%s") post_date, user_no from board where num=?',
            [num], function (err, rows) {
                if (err) console.err('err', err);
                conn.release();
                callback(rows[0]);
            });

    });
};

exports.updateform = function (num, callback) {
    pool.getConnection(function (err, conn) {
        if (err) console.log('err', err);
        conn.query('select post_no, post_title, post_content, DATE_FORMAT(regdate, "%Y-%m-%d %H:%i:%s") post_date, user_no from post where post_no=?',
            [num], function (err, rows) {
                if (err) console.err('err', err);
                conn.release();
                callback(rows[0]);
            });
    });
};

exports.update = function (datas, callback) {
    pool.getConnection(function (err, conn) {
        if (err) console.err('err', err);
        console.log('datas', datas);
        var sql = "update board set title=?, content=? where num=? and passwd=?";
        conn.query(sql, datas, function (err, row) {
            if (err) console.error('err', err);
            var success = false;
            console.log('row', row);
            if (row.affectedRows == 1) success = true;
            conn.release();
            callback(success);
        });
    });
};

exports.delete = function (datas, callback) {
    pool.getConnection(function (err, conn) {
        if (err) console.err('err', err);
        var sql = "delete from board where num=? and passwd=?";
        conn.query(sql, datas, function (err, row) {
            if (err) console.error('err', err);
            var success = false;
            console.log('row', row);
            if (row.affectedRows == 1) success = true;
            conn.release();
            callback(success);
        });
    });
};
