const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const img_storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/image/');
	},
	filename: (req, file, cb) => {
		cb(null, path.basename(file.originalname));
	}
});
const file_storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/files/');
	},
	filename: (req, file, cb) => {
		cb(null, path.basename(file.originalname));
	}
})
const img_upload = multer({ storage: img_storage });
const file_upload = multer({ storage: file_storage });

//image upload while writing
router.post('/images', img_upload.array('file'), async(req, res) => {
	let response = {};
	response.url = `/image/${path.basename(req.files[0].path)}`;
	res.json(response);
});

//file attach while writing
router.post('/files', file_upload.array('attach'), async(req, res) => {
	console.log(`js req.files : ${req.files}`)
	let response = req.files
	res.json(response);
})

module.exports = router;