'use strict';

/* Controllers */
function IndexCtrl($scope, $http, $location){
  $http.get('/redir').
    success(function(data) {
      if (data) {
        if (data.privilege == 'student') {
          $location.url('/student');
        } else if (data.privilege == 'teacher') {
          $location.url('/teacher');
        } else if (data.privilege == 'ta') {
          $location.url('/ta');
        } else if (data.privilege == 'administrator') {
          $location.url('/administrator');
        }
      }
    });
}

function StudentCtrl($scope, $http, $location) {
    $http.get('/studentpage').
        success(function(data) {
          $scope.privilege = data.privilege;
          $scope.homeworks = data.homeworks;
    });
}

function TeacherCtrl($scope, $http, $location) {
    $http.get('/teacherpage').
        success(function(data) {
          $scope.privilege = data.privilege;
          $scope.homeworks = data.homeworks;
    });

    $scope.deleteHomework = function(index) {
      $http.post('/deleteHomework', {index:index}).
        success(function(data) {
          $scope.privilege = data.privilege;
          $scope.homeworks = data.homeworks;
        });
    }
}

function TaCtrl($scope, $http, $location) {
    $http.get('/tapage').
        success(function(data) {
          $scope.privilege = data.privilege;
          $scope.homeworks = data.homeworks;
    });
}

function AdministratorCtrl($scope, $http, $location) {
    $http.get('/administratorpage').
        success(function(data) {
          $scope.privilege = data.privilege;
          $scope.users = data.users;
    });

    $scope.deleteUser = function(index) {
      $http.post('/deleteUser', {index:index}).
        success(function(data) {
          $scope.privilege = data.privilege;
          $scope.users = data.users;
        });
    }
}

function AddUserCtrl($scope, $http, $location) {
    $http.get('/redir').
        success(function(data) {
          $scope.privilege = data.privilege;
    });
    $scope.submitAddUser = function () {
      $http.post('/submitAddUser', $scope.user).
        success(function(data) {
          $location.path('/');
        });
    };
}

function ChangePasswordCtrl($scope, $http, $location) {
    $http.get('/changePasswordPage').
        success(function(data) {
          $scope.user = data.user;
    });

    $scope.submitPassword = function () {
      $http.post('/submitPassword', $scope.user).
        success(function(data) {
          $location.path('/');
        });
    };
}

function AddHomeworkCtrl($scope, $http, $location) {
    $http.get('/redir').
        success(function(data) {
          $scope.privilege = data.privilege;
    });
    $scope.submitAddHomework = function () {
      $http.post('/submitAddHomework', $scope.homework).
        success(function(data) {
          $location.path('/');
        });
    };
}

function EditStateCtrl($scope, $http, $location, $routeParams) {
  $scope.homeworkid = $routeParams.id;

  $http.get('/editStatepage/'+ $routeParams.id).
    success(function(data) {
      $scope.homework = data.homework;
    });


  $scope.submitEditState = function (state) {
      $http.post('/submitEditState/'+ $routeParams.id, {state:state, homework:$scope.homework}).
        success(function(data) {
          $location.path('/');
        });
    };
}

function ScorePrivilegeCtrl($scope, $http, $location, $routeParams) {
  $http.get('/scorePrivilegeNum/' + $routeParams.id).
        success(function(data) {
          $scope.privilege = data.privilege;
          $scope.scorePrivileges = data.scorePrivileges;
    });

  $scope.submitScorePrivilege = function () {
      $http.post('/submitScorePrivilege/'+ $routeParams.id, $scope.scorePrivileges).
        success(function(data) {
          $location.path('/');
        });
    };
}

function ReviewCtrl($scope, $http, $location, $routeParams) {
  $scope.homeworkid = $routeParams.id;
  $http.get('/reviewpage/' + $routeParams.id).
        success(function(data) {
          $scope.reviews = data.review;
          $scope.state = data.state;
    });
}

function ReviewotherCtrl($scope, $http, $location, $routeParams) {
  $scope.homeworkid = $routeParams.id;

  $http.get('/reviewotherpage/' + $routeParams.id).
        success(function(data) {
          $scope.hws = data.hws;
          $scope.nowUser = data.nowUser;
    });

  $scope.submitReview = function (index) {
    $http.post('/submitReview/'+ $routeParams.id, $scope.hws[index]).
      success(function(data) {
        if (data) {
          alert('review success');
        }
      });
  }
}

function ShowStudentHomeworkCtrl($scope, $http, $location, $routeParams) {
  $http.get('/showPage/' + $routeParams.id).
        success(function(data) {
          $scope.privilege = data.privilege;
          $scope.hws = data.hws;
          $scope.hwid = $routeParams.id;
    });

  $scope.submitScore = function (stuid, score) {
    $http.post('/submitScore/'+ $routeParams.id, {"stuid":stuid, "score":score}).
      success(function(data) {
        if (data) {
          alert('success');
        }
      });
  }

  $scope.quickrank = function () {
    $http.post('/quickrank/'+ $routeParams.id).
      success(function(data) {
        if (data) {
          alert('success');
        }
      });
  }
}

function UploadCtrl($scope, $http, $location, $routeParams) {
    $http.get('/redir').
        success(function(data) {
          $scope.id = $routeParams.id + "-" + data.userid;
    });
}

function DownloadCtrl($scope, $http, $location, $routeParams) {
    $http.get('/submitdownload/'+ $routeParams.id).
        success(function(data) {
          window.location.reload();
          $scope.message = '下载成功';
    });
}