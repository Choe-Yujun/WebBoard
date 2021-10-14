const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const conn = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'gkdldhs',
	database: 'jsman'
})
conn.connect();

router.post('/', (req, res) => {
    const idx = req.body.idx;
    const postnum = req.body.postnum;
    const name = req.body.name;

    if (name == req.session.name || req.session.name == 'ADMIN') {//my post or administrator
        conn.query(`delete from BOARD where POSTNUM = ${postnum};`, (err) => {
            if (err) throw err;
            conn.query(`select BOARDID, POSTNUM, TITLE, UID, date_format(UPDTIME, '%Y-%m-%d-%H-%i') as UPDTIME from BOARD where BOARDID = ${idx} order by UPDTIME desc;`, (err, rows) => {
                if (err) throw err;
                else if (rows.length > 0) res.redirect(req.session.prepage);
                //empty page list
                else res.redirect(`/board/${idx}/1`);
            })
        })
    } else {//not my post
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write("<script>alert('본인 게시물이 아니어서 권한이 없습니다.')</script>");
        res.write(`<script>window.location=\"../read/${postnum}\"</script>`);
    }
})

module.exports = router;