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

//Description Asterisk(slash, backslash, etc..) processing
function addslashes(str) {
	str = str.replace(/\\/g, '\\\\');
	str = str.replace(/\'/g, '\\\'');
	str = str.replace(/\"/g, '\\"');
	str = str.replace(/\0/g, '\\0');
	return str;
}

//Auto select about writing board page
router.get('/:idx', (req, res) => {
	const idx = req.params.idx;

	if (req.session.name) {
		//logined
		res.render('create.ejs', { update: false, idx: idx, session: req.session });
	} else {
		//not logined
		res.redirect('/user/login');
	}
});

router.post('/:idx', (req, res) => {
	let title = req.body.title;
	let description = req.body.description;
	const idx = req.body.idx;
	const uid = req.session.name;
	const update = req.body.update;
	description = addslashes(description);

	//new writing
	if (update == 0) {
		const sql = `insert into BOARD (BOARDID, UID, TITLE, DESCRIPTION) values (${idx}, "${uid}", "${title}", "${description}");`;
		
		conn.query(sql, (err) => {
			if (err) {
				if (title.length > 150) { //too long title
					res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
					res.write("<script>alert('제목은 150자를 넘을 수 없습니다.')</script>");
					title = title.substring(0, 150);

					conn.query(`insert into BOARD (BOARDID, UID, TITLE, DESCRIPTION, temp) values (${idx}, "${uid}", "${title}", "${description}", true);`, (err) => {
						if (err) throw err;
						else {
							conn.query(`select * from BOARD where temp = true and title = '${title}' and uid = '${uid}' and description = '${description} order by postnum desc limit 1;`, (err, rows) => {
								if (err) throw err;
								else res.write(`<script>window.location=\"../update/${rows[0].POSTNUM}\"</script>`);
							})
						}
					})

				} else { //other error
					res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
					res.write("<script>alert('잘못된 양식 입니다. 다시 입력해 주세요.')</script>");
					res.write(`<script>window.location=\"../board/${idx}/1\"</script>`);
				}
				//writing complete
			} else {
				conn.query(`select POSTNUM from BOARD where title = '${title}' and uid = '${uid}' and description = '${description}' order by postnum desc limit 1;`, (err, rows) => {
					if (err) throw err
					else {
						const postnum = rows[0].POSTNUM;
						res.redirect(`/read/${postnum}`);
					}
				});
			}
		});
		//post updating
	} else {
		console.log("update")
		const postnum = req.body.postnum;
		const sql = `update BOARD set TITLE = "${title}", DESCRIPTION = "${description}", MODTIME = now(), TEMP = false where POSTNUM = ${postnum};`;
		
		conn.query(sql, (err) => {
			if (err) {
				if (title.length > 150) {
					res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
					res.write("<script>alert('제목은 150자를 넘을 수 없습니다.')</script>");
					title = title.substring(0, 150);

					conn.query(`update BOARD set TITLE = "${title}", DESCRIPTION = "${description}", TEMP = true where POSTNUM = ${postnum};`, (err) => {
						if (err) throw err;
						else {
							conn.query(`select * from BOARD where temp = true and title = '${title}' and uid = '${uid}' and description = '${description} order by postnum desc limit 1;`, (err, rows) => {
								if (err) throw err;
								else res.write(`<script>window.location=\"../update/${rows[0].POSTNUM}\"</script>`);
							})
						}
					})
				} else {
					console.log(err)
					res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
					res.write("<script>alert('잘못된 양식 입니다. 다시 입력해 주세요.')</script>");
					res.write(`<script>window.location=\"../board/${idx}/1\"</script>`);
				}
				//updating complete
			} else res.redirect(`/read/${postnum}`);
		});
	}
});

module.exports = router;