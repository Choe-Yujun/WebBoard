const express = require('express');
const app = express();
const router = require('./router/index');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.listen(3000, function() {
	console.log("Start, express server on port 3000");
});

app.use(cors({
	origin : true,
	credentials : true
}));

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('view engine', 'ejs');

app.use(session({
	key: "loginData",
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 60*60*24000,
	},
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(router);

