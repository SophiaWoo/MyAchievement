var express = require('express');
var router = express.Router();
var api = require('./api');


// Routes
router.get('/', api.index);
router.get('/login', api.login);
router.get('/logout', api.logout);
router.post('/login', api.postLogin);
router.get('/partials/:name', api.partials);


// JSON API
router.get('/studentpage', api.studentpage);
router.get('/teacherpage', api.teacherpage);
router.get('/tapage', api.tapage);
router.get('/administratorpage', api.administratorpage);
router.get('/redir', api.redir);

router.post('/submitAddUser', api.submitAddUser);
router.post('/deleteUser', api.deleteUser);
router.post('/submitAddHomework', api.submitAddHomework);
router.post('/deleteHomework', api.deleteHomework);
router.get('/editStatepage/:id', api.editStatepage);
router.post('/submitEditState/:id', api.submitEditState);
router.get('/scorePrivilegeNum/:id', api.scorePrivilegeNum);
router.post('/submitScorePrivilege/:id', api.submitScorePrivilege);
router.get('/reviewotherpage/:id', api.reviewotherpage);
router.post('/submitReview/:id', api.submitReview);
router.get('/reviewpage/:id', api.reviewpage);
router.get('/changePasswordPage', api.changePasswordPage);
router.post('/submitPassword', api.submitPassword);
router.get('/showPage/:id', api.showPage)
router.post('/submitScore/:id', api.submitScore);
router.post('/quickrank/:id', api.quickrank);
router.get('/download/:id', api.download);
router.post('/file/uploading/:id', api.uploading);
router.get('/myscore', api.myscore);
router.get('/myrank', api.myrank);



router.get('*', api.index);

module.exports = router;
