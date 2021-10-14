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

router.get('/', (req, res) => {
	const list = new Array();
	const boardNum = 3;

	//show Board post in summery
	for(let i = 0; i < boardNum; i++) {
		let sql = `select * from BOARD where boardid = ${i+1} and temp = false order by postnum desc limit 5;`;
		conn.query(sql, (err, rows) => {
			if(err) console.log("board error");
			else {
				list.push(rows);
				if(i >= 2) res.render('mainHome.ejs', {session: req.session, list : list});
			}
		})
	}
})

module.exports = router;
