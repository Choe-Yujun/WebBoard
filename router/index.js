const express = require('express');
const router = express.Router();
/*
main : main page func
board : board list func
create : write post func
user : login, logout func
read : read post func
search : search post func
delete_process : delete post func
update : update, modify post func
*/
const main = require('./main/main');
const board = require('./board/index');
const create = require('./board/create/index');
const user = require('./user/index');
const read = require('./board/read/index');
const search = require('./board/search/index');
const delete_process = require('./board/delete/index');
const update = require('./board/update/index');
const upload = require('./board/upload/index');
const comments = require('./board/comments/index');

router.use('/', main);
router.use('/main', main);
router.use('/board', board);
router.use('/create', create);
router.use('/user', user);
router.use('/read', read);
router.use('/search', search);
router.use('/delete', delete_process);
router.use('/update', update);
router.use('/upload', upload);
router.use('/comments', comments);


module.exports = router;
