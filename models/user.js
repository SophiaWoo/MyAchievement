var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Define User schema 
var userSchema = new Schema({ 
    userid: String,
    password: String, 
    username: String,
    group: String,  // 规定teacher , ta , administrator 的组别为 0.
    privilege: String  // administrator, teacher, ta, student
});

var User = mongoose.model('User', userSchema);
module.exports = User;
