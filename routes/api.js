var express = require('express');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

var User = require('../models/User');
var Homework = require('../models/Homework');


// 供调用的api:刷新页面（res.render）
// Routes

exports.index = function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.render('index', {user: req.session.user});
  };
};

exports.login = function(req, res, next){
    res.render('login');
};

exports.partials = function (req, res, next) {
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.postLogin = function(req, res, next){
    User.find({userid: req.body.userid, password: req.body.password}, function(err, user){
      if (user.length > 0) {
        req.session.user = user[0];
        res.redirect('/');
      } else {
        res.render('login', {error: '用户名密码错误！' });
      }
    });
};

exports.logout = function(req, res, next){
    delete req.session.user;
    res.redirect('/');
};


// 供调用的api，刷新partials里的东西
// JSON API
exports.studentpage = function(req, res){
  if (!req.session.user) {
    res.redirect('/');
  } else {
    Homework.find({}, function(err, docs){
      var hw = docs;
      for (var i = 0; i < docs.length; i++) {
        for (var j = 0; j < docs[i].hws.length; j++) {
          if (docs[i].hws[j].userid == req.session.user.userid) {
            break;
          }
        }
        var score = docs[i].hws[j].score;
        var rank = docs[i].hws[j].rank;
        var userid = docs[i].hws[j].userid;
        hw[i].hws = [];
        hw[i].hws[0] = score; // 暂时借用hws传递个人score/rank
        hw[i].hws[1] = rank;
        hw[i].hws[2] = userid;
      }
      res.json({
        privilege: req.session.user.privilege,
        homeworks: hw
      });
    });
  }
};
exports.teacherpage = function(req, res){
  if (!req.session.user) {
    res.redirect('/');
  } else {
    Homework.find({}, function(err, docs){
      res.json({
        privilege: req.session.user.privilege,
        homeworks: docs
      });
    });
  }
};
exports.tapage = function(req, res){
  if (!req.session.user) {
    res.redirect('/');
  } else {
    Homework.find({}, function(err, docs){
      res.json({
        privilege: req.session.user.privilege,
        homeworks: docs
      });
    });
  }
};
exports.administratorpage = function(req, res){
  if (!req.session.user) {
    res.redirect('/');
  } else {
    User.find({}, function(err, docs){
      res.json({
        privilege: req.session.user.privilege,
        users: docs
      });
    });
  }
};

exports.redir = function(req, res){
  if (!req.session.user) {
    res.redirect('/');
  } else {
    res.json({
      userid: req.session.user.userid,
      privilege: req.session.user.privilege
    });
  }
};

exports.submitAddUser = function(req, res) {
  var user = new User(req.body);
  user.save(function (err, docs) {
    res.json(true);
  });
};

exports.changePasswordPage = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.json({
      user: req.session.user
    });
  }
};

exports.submitPassword = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var user = req.body;
    User.update({userid: user.userid}, user, function(err, docs) {
       req.session.user = user;
       res.json(true);
    });
  }
};

exports.deleteUser = function (req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var id = req.body.index;
    User.remove({userid: id}, function(err) {
      if (!err) {
        User.find({}, function(err, docs) {
          res.json({
            privilege: req.session.user.privilege,
            users: docs
          });
        });
      }
    });
  }
};

exports.submitAddHomework = function(req, res) {
  var homework = new Homework(req.body);
  homework.state = 'future';
  var group = [];
  var hws = [];
  User.find({}, function(err, docs) {
    for (var i = 0; i < docs.length; i++) {
      var flag = true;
      for (var j = 0; j < group.length; j++) {
        if (docs[i].group == group[j]) {
          flag = false;
          break;
        }
      }
      if (docs[i].group == '0') {
        flag = false;
      }
      if (flag == true) {
        group[group.length] = docs[i].group;
      }
      if (docs[i].group != '0') {
        var review = [];
        hws.push({"userid": docs[i].userid, "usergroup": docs[i].group, "file":"", "score":"", "rank":"", "review": review});
      }
    }
    var scorePrivileges = [];
    for (var j = 0; j < group.length; j++) {
      scorePrivileges.push({"group":group[j], "scoregroup":"0", "taid":"0"});
    }
    homework.scorePrivileges = scorePrivileges;
    homework.hws = hws;
    homework.save(function (err, docs) {
      res.json(true);
    });
  });
};

exports.deleteHomework = function (req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var id = req.body.index;
    Homework.remove({id: id}, function(err) {
      if (!err) {
        Homework.find({}, function(err, docs) {
          res.json({
            privilege: req.session.user.privilege,
            homeworks: docs
          });
        });
      }
    });
  }
};
exports.editStatepage = function(req, res) {
  var id = req.params.id;
  Homework.find({id: id}, function(err, docs) {
      res.json({
        homework: docs[0]
      });
  });
}

exports.submitEditState = function (req, res) {
  var id = req.params.id;
  var state = req.body.state;
  var stime = req.body.homework.starttime;
  var etime = req.body.homework.endtime;
  Homework.find({id: id}, function(err, docs) {
    var hw = docs[0];
    hw.state = state;
    hw.starttime = stime;
    hw.endtime = etime;
    Homework.update({id:id}, hw, function(err, docs) {
      res.json(true);
    });
  });
};

exports.scorePrivilegeNum = function (req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var id = req.params.id;
    Homework.find({id: id}, function(err, docs) {
      var privilege = "";
      if (req.session.user)
        privilege = req.session.user.privilege;
      res.json({
        privilege: privilege,
        scorePrivileges: docs[0].scorePrivileges
      });
    });
  }
};

exports.submitScorePrivilege = function (req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var id = req.params.id;
    Homework.find({id: id}, function(err, docs) {
      var temp = req.body;
      var hw = docs[0];
      hw.scorePrivileges = temp;  // hw ===> homework 
      User.find({}, function(err, stuta) {
        // clear view
        for (var w = 0; w < hw.hws.length; w++) {
          hw.hws[w].review = [];
        }
        
        for (var i = 0; i < stuta.length; i++) {
          // student
          var group = [];
          if (stuta[i].privilege == 'student') {
            for (var k = 0; k < hw.scorePrivileges.length; k++) {
              if (stuta[i].group == hw.scorePrivileges[k].scoregroup) {
                group[group.length] = hw.scorePrivileges[k].group;
              }
            }
            for (var j = 0; j < hw.hws.length; j++) {
              for (var g = 0; g < group.length; g++) {
                if (hw.hws[j].usergroup == group[g]) {
                  hw.hws[j].review.push({"score":"", "comment":"", "scoreid":stuta[i].userid, "scoregroup":stuta[i].group});
                }
              }
            }
          }
          // ta
          group = [];
          if (stuta[i].privilege == 'ta') {
            for (var k = 0; k < hw.scorePrivileges.length; k++) {
              if (stuta[i].userid == hw.scorePrivileges[k].taid) {
                group[group.length] = hw.scorePrivileges[k].group;
              }
            }
            for (var j = 0; j < hw.hws.length; j++) {
              for (var g = 0; g < group.length; g++) {
                if (hw.hws[j].usergroup == group[g]) {
                  hw.hws[j].review.push({"score":"", "comment":"", "scoreid":stuta[i].userid, "scoregroup":stuta[i].group});
                }
              }
            }
          }
        }
        Homework.update({id:id}, hw, function(err, docs) {
            res.json({
              privilege: req.session.user.privilege
            });
        });
      });
    });
  }
};

exports.reviewotherpage = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var id = req.params.id;
    var nowUser = req.session.user;
    var hws = [];
    Homework.find({id: id}, function(err, docs) {
      // student
      var group = [];
      if (nowUser.privilege=='student') {
        for (var i = 0; i < docs[0].scorePrivileges.length; i++) {
          if (nowUser.group == docs[0].scorePrivileges[i].scoregroup) {
            group[group.length] = docs[0].scorePrivileges[i].group;
          }
        }
        if (group) {
          for (var j = 0; j < docs[0].hws.length; j++) {
            for(var g = 0; g < group.length; g++) {
              if (group[g] == docs[0].hws[j].usergroup) {
                hws.push(docs[0].hws[j]);
              }
            }
          }
        }
      }
      // ta
      group = [];
      if (nowUser.privilege=='ta') {
        for (var i = 0; i < docs[0].scorePrivileges.length; i++) {
          if (nowUser.userid == docs[0].scorePrivileges[i].taid) {
            group[group.length] = docs[0].scorePrivileges[i].group;
          }
        }
        if (group) {
          for (var j = 0; j < docs[0].hws.length; j++) {
            for(var g = 0; g < group.length; g++) {
              if (group[g] == docs[0].hws[j].usergroup) {
                hws.push(docs[0].hws[j]);
              }
            }
          }
        } 
      }
      res.json({
        nowUser: nowUser,
        hws: hws
      });
    });
  }
};

exports.submitReview = function(req, res) {
  var hwid = req.params.id;
  var hw = req.body;
  Homework.find({id: hwid}, function(err, docs) {
    for(var i = 0; i < docs[0].hws.length; i++) {
      if (docs[0].hws[i].userid == hw.userid) {
        
            docs[0].hws[i].review = hw.review;
            break;
      }
    }
    Homework.update({id:hwid}, docs[0], function(err, docs) {
        res.json(true);
      });
  });
};

exports.reviewpage = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var id = req.params.id;
    var nowUser = req.session.user;
    var review = [];
    Homework.find({id: id}, function(err, docs) {
      for (var j = 0; j < docs[0].hws.length; j++) {
        if (nowUser.userid == docs[0].hws[j].userid) {
          review = docs[0].hws[j].review;
          break;
        }
      }
      res.json({
        review: review,
        state: docs[0].state
      });
    });
  }
};

exports.showPage = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var id = req.params.id;
    var hws = [];
    Homework.find({id: id}, function(err, docs) {
      res.json({
          privilege: req.session.user.privilege,
          hws: docs[0].hws
        });
    });
  }
};

exports.submitScore = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var hwid = req.params.id;
    var stuid = req.body.stuid;
    var score = req.body.score;
    Homework.find({id: hwid}, function(err, docs) {
      for(var i = 0; i < docs[0].hws.length; i++) {
        if (docs[0].hws[i].userid == stuid) {
              docs[0].hws[i].score = score;
              break;
        }
      }
      Homework.update({id:hwid}, docs[0], function(err) {
          res.json({
              privilege: req.session.user.privilege,
          });
        });
    });
  }
};

exports.quickrank = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var hwid = req.params.id;
    Homework.find({id: hwid}, function(err, docs) {
      var rel = []; // score userid
      for(var i = 0; i < docs[0].hws.length; i++) {
        rel[rel.length] = {"userid":docs[0].hws[i].userid, "score":docs[0].hws[i].score};
      }
      for (i = 0; i < rel.length-1; i++) {
        for (var j = i+1; j < rel.length; j++) {
          if (rel[i].score < rel[j].score) {
            var temp = rel[i];
            rel[i] = rel[j];
            rel[j] = temp;
          }
        }
      }
      for (i = 0; i < rel.length; i++) {
        for (j = 0; j < docs[0].hws.length; j++) {
          if (docs[0].hws[j].userid == rel[i].userid) {
            var ranki = i+1;
            docs[0].hws[j].rank = ""+ranki;
          }
        }
      }
      Homework.update({id:hwid}, docs[0], function(err) {
          res.json({
              privilege: req.session.user.privilege
          });
        });
    });
  }
};

// 递归删除文件夹 ----- 供调用
deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.uploading = function(req, res, next) {  // id:  'hwid-userid'
    var dirpath = './public/files/' + req.params.id;
    fs.exists(dirpath, function(exists) {
        if (exists) {
            deleteFolderRecursive(dirpath);
        }
        fs.mkdir(dirpath, function (err) {
            if(err) {
               throw err;
            } else {
                  //生成multiparty对象，并配置上传目标路径
                  var form = new multiparty.Form({uploadDir: dirpath});
                  //上传完成后处理
                  form.parse(req, function(err, fields, files) {
                    var filesTmp = JSON.stringify(files,null,2);
                    if(err){
                      console.log('parse error: ' + err);
                    } else {
                      // console.log('parse files: ' + filesTmp);
                      var inputFile = files.inputFile[0];
                      var uploadedPath = inputFile.path;
                      var dstPath = dirpath + '/' + inputFile.originalFilename;
                      //重命名为真实文件名
                      fs.rename(uploadedPath, dstPath, function(err) {
                        if(err){
                          console.log('rename error: ' + err);
                        } else {
                          console.log('rename ok');
                        }
                      });
                    }
                    res.redirect('/');
                 });   
            }
        });
    });
};

exports.download = function(req, res) {
  var path = './public/files/' + req.params.id;
  fs.exists(path, function(exists) {
      if (exists) {
        fs.readdir(path, function (err, files) {
            if(files.length > 0) {
              res.download(path + '/' + files[0]);
            } else {
              res.json('对不起，用户尚未提交该作业  ~~>_<~~  ');
            }
        });
      } else {
        res.json('对不起，用户尚未提交该作业  ~~>_<~~  ');
      }
  });
};

exports.myscore = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var userid = req.session.user.userid;
    var categories = [];
    var score = [];
    Homework.find({}, function(err, docs) {
      for (var i = 1; i <= docs.length; i++) {
        for (var j = 0; j < docs[i-1].hws.length; j++) {
          if (userid == docs[i-1].hws[j].userid) {
            categories[i-1] = 'HW'+i;
            score[i-1] = parseInt(docs[i-1].hws[j].score);
            break;
          }
        }
      }
      res.json({
        categories: categories,
        score: score
      });
    });
  }
};

exports.myrank = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    var userid = req.session.user.userid;
    var categories = [];
    var rank = [];
    Homework.find({}, function(err, docs) {
      for (var i = 1; i <= docs.length; i++) {
        for (var j = 0; j < docs[i-1].hws.length; j++) {
          if (userid == docs[i-1].hws[j].userid) {
            categories[i-1] = 'HW'+i;
            rank[i-1] = parseInt(docs[i-1].hws[j].rank);
            break;
          }
        }
      }
      res.json({
        categories: categories,
        rank: rank
      });
    });
  }
};
