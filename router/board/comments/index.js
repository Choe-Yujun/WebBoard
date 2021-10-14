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

router.post('/', async(req, res) => {
    const postnum = req.body.postnum;
    const name = req.body.name;
    let description = addslashes(req.body.comment);

    if(req.body.parent) {
        const parent = req.body.parent

        const handleQuery = sql =>{
            return new Promise((resolve, reject) => {
                conn.query(sql, (err, rows) => {
                    if(err) return reject(err);
                    resolve(rows);
                })
            })
        }

        let sql = `insert into comments (postnum, name, description, parent) values (${postnum}, "${name}", "${description}", ${parent});`;
        const insert = await handleQuery(sql).catch(err => {throw err});

        sql = `select cid from comments where postnum = ${postnum} and name = "${name}" and description = "${description}" and parent = ${parent};`;
        const cid = await handleQuery(sql).catch(err => {throw err})[0];

        sql = `select children from comments where cid = ${parent};`;
        const childrenRow = await handleQuery(sql).catch(err => {throw err});
        const children = `${childrenRow[0]} ${cid}`;

        sql = `update comments set children = ${children} where cid = ${parent};`;
        const update = await handleQuery(sql).catch(err => {throw err});

        res.redirect(`/read/${postnum}`);
        /*conn.query(sql, (err, rows) => {
            if(err) throw err;
            else {
                const sql = `select cid from comments where postnum = ${postnum} and name = "${name}" and description = "${description}" and parent = ${parent};`;
                conn.query(sql, (err, rows) => {
                    if(err) throw err;
                    else {
                        const cid = rows[0];
                        const sql = `select children from comments where cid = ${parent};`;
                        conn.query(sql, (err, row) => {
                            if(err) throw err;
                            else {
                                const children = `${row[0]} ${cid}`;
                                const sql = `update comments set children = ${children} where cid = ${parent};`;
                                conn.query(sql, (err) => {
                                    if(err) throw err;
                                    else res.redirect(`/read/${postnum}`);
                                })
                            }
                        })
                    }
                })
            }
        })*/
    } else {
        const sql = `insert into comments (postnum, name, description) values (${postnum}, "${name}", "${description}");`;
        conn.query(sql, (err, rows) => {
            if(err) {
                if(description.length > 300) {
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.write("<script>alert('댓글은 300자를 넘을 수 없습니다.')<script>");
                    res.write(`<script>window.location=\"../read/${postnum}\"</script>`);
                    //description = description.substring(0, 300);
                } else throw err;
            } else {
                res.redirect(`/read/${postnum}`);
            }
        });
    }
});

router.post('/delete', (req, res) => {
    const cid = req.body.cid;
    const postnum = req.body.postnum;
    const sql = `update comments set isDeleted = true where cid = ${cid};`;

    conn.query(sql, (err) => {
        if(err) throw err;
        else res.redirect(`/read/${postnum}`);
    })
})

router.post('/update', (req, res) => {
    const cid = req.body.cid;
    const postnum = req.body.postnum;
    let description = addslashes(req.body.comment);
    const sql = `update comments set description = "${description}", modtime = now() where cid = ${cid};`;

    conn.query(sql, (err) => {
        if(err) throw err;
        else res.redirect(`/read/${postnum}`);
    })
})

module.exports = router;