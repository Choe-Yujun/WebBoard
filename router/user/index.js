const express = require('express');
const router = express.Router();
const mysql = require('mysql');

/*table user
uid, email, name(foriegn key), pw
use name to connect table BOARD
table BOARD
BOARDID, POSTNUM, UID, TITLE, DESCRIPTION, UPDTIME, PW
name = UID*/
const conn = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'gkdldhs',
	database: 'jsman'
})
conn.connect();

function alert(res, str, url) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(`<script>alert('${str}')</script>`);
    res.write(`<script>window.location=\"${url}\"</script>`);
}

//Login page open, session check
router.get('/login', (req, res) => {
    //'prepage' is pre page url
    const prepage = req.headers.referer.substring(req.headers.host.length + 7)
    if(prepage !== "/user/login")
        req.session.prepage = prepage;
    else req.session.prepage = '/main';
    res.render('login.ejs', { session: req.session });
})

//SignUp page open, session check
router.get('/signup', (req, res) => {
    let session = req.session;
    res.render('signUp.ejs', { session: session });
})

//SignUp info check, SignUp
router.post('/signup', (req, res) => {
    const name = req.body.userName;
    const email = req.body.email;
    const pw = req.body.password;

    //Too short or long name
    if (name.length > 6 || name.length < 2) {
        const str = "이름은 2자 이상, 6자 이하로 설정하세요.";
        const url = "../user/signup";
        alert(res, str, url);
    } else if (pw.length > 21 || pw.length < 8) {//Too short or long password
        const str = "비밀번호는 8자 이상, 20자 이하로 설정하세요.";
        const url = "../user/signup";
        alert(res, str, url);
    } else {
        const sql = `insert into user(email, name, pw) values ("${email}", "${name}", "${pw}");`;
        conn.query(sql, (err) => {
            if (err) {
                const str = "잘못된 양식 입니다. 다시 입력해 주세요.";
                const url = "../user/signup";
                alert(res, str, url);
            } else {//Joined
                req.session.name = name
                const str = "회원가입이 완료되었습니다:) 다시 로그인 해주세요.";
                const url = "../user/login";
                alert(res, str, url);
            }
        })
    }
})

//Login by session using name
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const pw = req.body.pw;

    //Check email and pw
    const sql = `select * from user where email = "${email}" and pw = "${pw}";`;
    conn.query(sql, (err, rows) => {
        if (err) throw err;
        else if (rows.length > 0) {
            //Add user name into session, redirect to prepage
            req.session.name = rows[0].name;
            res.redirect(req.session.prepage);
        } else { //Wrong ID or Password
            const str = "아이디 또는 비밀번호가 잘못 입력 되었습니다.";
            const url = "../user/login";
            alert(res, str, url);
        }
    })
})

//Logout
router.get('/logout', (req, res) => {
    //'prepage' is pre page url
    const prepage = req.headers.referer
    //Delete session
    req.session.destroy();
    res.clearCookie('loginData');

    res.redirect(prepage);
})


module.exports = router;