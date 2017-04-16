var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Define Homework schema 
var homeworkSchema = new Schema({ 
    id: String,
    title: String,
    link: String,
    state: String,
    starttime: String,
    endtime: String,
    scorePrivileges: [],  // 包含{group, scoregroup, taid}的数组
    hws: [] // 包含{score, userid, usergroup, file, 数组review[{score,comment,scoreid, scoregroup},{},{}...] }的数组
});

var Homework = mongoose.model('Homework', homeworkSchema);
module.exports = Homework;
