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

router.get('/:postnum', (req, res) => {
    const postnum = req.params.postnum;
    const sql = `select * from BOARD where POSTNUM = ${postnum};`;

    conn.query(sql, (err, rows) => {
        if (err) throw err;
        else res.render('create.ejs', {update: true, idx: rows[0].BOARDID, content: rows[0], session: req.session });
    })
})

//update
router.post('/', (req, res) => {
    const postnum = req.body.postnum;
    const name = req.body.name;
    const idx = req.body.idx;

    if (name == req.session.name || req.session.name == 'ADMIN') {
        //my post or administrator
        const sql = `select * from BOARD where POSTNUM = ${postnum};`;
        conn.query(sql, (err, rows) => {
            if (err) throw err;
            else res.render('create.ejs', { update: true, idx: idx, content: rows[0], session: req.session });
        })
    } else {
        //not my post
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write("<script>alert('본인 게시물이 아니어서 권한이 없습니다.')</script>");
        res.write(`<script>window.location=\"../read/${postnum}\"</script>`);
    }
})

module.exports = router;