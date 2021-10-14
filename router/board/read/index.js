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

//Get read page
router.get('/:postnum', async (req, res) => {
	const postnum = req.params.postnum;

	if (req.session.name) {//logined
		const handleQuery = sql => {
			return new Promise((resolve, reject) => {
				conn.query(sql, (err, rows) => {
					if(err) return reject(err);
					resolve(rows);
				})
			})
		}

		let sql = `select * from BOARD where POSTNUM = ${postnum};`;
		const postRows = await handleQuery(sql).catch(err => {throw err});

		sql = `select count(*) from BOARD where boardid = ${postRows[0].BOARDID} and postnum > ${postnum};`;
		const row = await handleQuery(sql).catch(err => {throw err});
		const page = parseInt(row[0]['count(*)']/15) + 1;
		
		sql = `select cid, name, description, isDeleted, date_format(updtime, '%Y-%m-%d %H : %i') as updtime from comments where postnum = ${postnum};`;
		const commentRows = await handleQuery(sql).catch(err => {throw err});

		res.render('read.ejs', { content: postRows[0], session: req.session, page: page, comments: commentRows});
	} else {//not logined
		res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
		res.write("<script>alert('로그인 후 이용해 주세요')</script>");
		res.write("<script>window.location=\"../user/login\"</script>");
	}
})

module.exports = router;