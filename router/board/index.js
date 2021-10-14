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



//Get board list page
router.get('/:idx/:page', (req, res) => {
	const idx = req.params.idx;
	const page = req.params.page;

	//Get by board id
	const sql = `select BOARDID, POSTNUM, TITLE, UID, date_format(UPDTIME, '%Y-%m-%d-%H : %i') as UPDTIME from BOARD where BOARDID = ${idx} and TEMP = 0 order by UPDTIME desc;`;
	conn.query(sql, (err, rows) => {
		if (err) throw err;
		//page: current page, len : data length, num : number of columns in a page
		else if (rows.length > 0) res.render('board.ejs', { empty: false, list: rows, idx: idx, page: page, len: rows.length - 1, num: 15, session: req.session });
		else res.render('board.ejs', { empty: true, idx: idx, page: 1, len: 0, num: 15, session: req.session });
	})
})

module.exports = router;
