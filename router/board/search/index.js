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
//Get post list by board id and searching key
router.post('/', (req, res) => {
    const key = req.body.key;
    let idx = req.body.idx;
    let prepage
    const category = req.body.keywordCategory;
    let sql;
    if(!idx) {//Search from main
        idx = req.body.boardCategory;
        prepage = "main";
    }
    else prepage = `../board/${idx}/1`
    
    //Search in Title + Description
    if(category == "td") sql = `select BOARDID, POSTNUM, TITLE, UID, date_format(UPDTIME, '%Y-%m-%d-%H : %i') as UPDTIME from BOARD where BOARDID = ${idx} and (binary DESCRIPTION like '%${key}%' or TITLE like '%${key}%' order by updtime desc;`;
    //Search in Title or Description or writer(uid)
    else sql = `select BOARDID, POSTNUM, TITLE, UID, date_format(UPDTIME, '%Y-%m-%d-%H : %i') as UPDTIME from BOARD where BOARDID = ${idx} and binary ${category} like '%${key}%' order by updtime desc;`;
    
    conn.query(sql, (err, rows) => {
        if (key.length < 2) {//Too short keyword
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write("<script>alert('최소 2글자 이상 입력하세요.')</script>");
            res.write(`<script>window.location=\"${prepage}\"</script>`);
        }
        else if (err) throw err;
        //Can find list
        else if (rows.length > 0) res.render('board.ejs', { empty: false, list: rows, idx: idx, page: 1, len: rows.length - 1, num: 15, session: req.session });
        else res.render('board.ejs', { empty: true, idx: idx, page: 1, len: 0, num: 15, session: req.session });
    })
})

module.exports = router