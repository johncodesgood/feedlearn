'use strict';

angular.module('myApp.teacher', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider.when('/teacher', {
    templateUrl: '/teacher/teacher.html',
    controller: 'TeacherCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
})

.controller('TeacherCtrl', function($scope, currentAuth, FIREBASE_URL, $firebaseArray, $firebaseObject, $timeout) {
  
  $scope.userID = currentAuth.uid;
	var ref = new Firebase(FIREBASE_URL);
  $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
  $scope.smileys = $firebaseObject(ref.child('smileys'));
  $scope.currentLog = ref.child('currentlog');

  $scope.resetSmileys = function() {
    $scope.smileys.sumCool = 0;
    $scope.smileys.sumSad = 0;
    $scope.smileys.sumLost = 0;
    $scope.smileys.sumAsleep = 0;
    $scope.smileys.$save();
    var removeUserSmileysRef = ref.child('userSmileys');  // make all kids smiles go away
    removeUserSmileysRef.set({test: "test"});
  };

  $scope.clearAllData = function() {
    $scope.smileys.sumCool = 0;
    $scope.smileys.sumSad = 0;
    $scope.smileys.sumLost = 0;
    $scope.smileys.sumAsleep = 0;
    $scope.smileys.$save();
    var refQuestions = new Firebase(FIREBASE_URL + 'questions');
    refQuestions.remove();
    var removeUserSmileysRef = ref.child('userSmileys');
    removeUserSmileysRef.set({test: "test"});
    var refCurrentLog = new Firebase(FIREBASE_URL + 'currentlog');
    refCurrentLog.once('value', function(logSnapshot) {
      var logData = logSnapshot.val();
      var refSavedLogs = new Firebase(FIREBASE_URL + 'savedlogs');
      var newSavedLog = refSavedLogs.push(logData);
      refCurrentLog.remove();
    });
  };

  $scope.sortByVotes = function() {
    $scope.questions = $firebaseArray(ref.child('questions').orderByChild("votes").limitToLast(40));
    $scope.removeQuestions = false;
  };

  $scope.sortByLatest = function() {
    $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
    $scope.removeQuestions = false;
  };

  $scope.deleteQuestions = function() {
    $scope.questions = $firebaseArray(ref.child('questions').orderByChild("votes"));
    $scope.removeQuestions = true;
  };

  $scope.addQuestion = function() {
    if ($scope.question != "") {
      var currentDate = new Date();
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var timestr = hours + ':' + minutes + ' ' + ampm;
      var newQuestion = {
        user: $scope.userID, date: timestr, votes: 1, content: $scope.question, userVotes: {test: "test"}
      };
	  newQuestion.userVotes[$scope.userID] = true;
      $scope.questions.$add(newQuestion);
      $scope.question = "";
      $scope.currentLog.push(newQuestion); 
    };
  };

  $scope.questionUpVote = function(questionIndex) 
  {
	//debugger;
    //if (!($scope.questions[questionIndex].user == $scope.userID)) // teacher cannot upvote question they wrote. allow this!
	{
	  var voteType = "upvote";
      if (!$scope.questions[questionIndex].userVotes[$scope.userID]) // teacher hasn't upvoted this yet
	  {
        $scope.questions[questionIndex].votes++; 
        $scope.questions[questionIndex].userVotes[$scope.userID] = true;
        $scope.questions.$save(questionIndex);
      } 
	  else // otherwise a downvote
	  {
		voteType = "downvote";
        $scope.questions[questionIndex].votes--;
        $scope.questions[questionIndex].userVotes[$scope.userID] = false;
        $scope.questions.$save(questionIndex);
        var ref = new Firebase(FIREBASE_URL);
        var removeUpvoteRef = ref.child('questions').child($scope.questions[questionIndex].$id).child('userVotes').child($scope.userID);
        removeUpvoteRef.remove();
		// remove question if zero people interested
		var numVotes = $scope.questions[questionIndex].votes;
        if (numVotes == 0)
        {
        	var removeQuestionRef = ref.child('questions').child($scope.questions[questionIndex].$id);
        	removeQuestionRef.remove();
        }
      };
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: voteType, user: $scope.userID, question: $scope.questions[questionIndex].content, votes: $scope.questions[questionIndex].votes} );
    };
  };

  $scope.questionRemove = function(questionIndex) {
    var questionID = $scope.questions[questionIndex].$id;
    var ref = new Firebase(FIREBASE_URL);
    var removeQuestionRef = ref.child('questions').child(questionID);
    removeQuestionRef.remove();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, question: $scope.questions[questionIndex].content, removedBy: "teacher"});
  };

  $scope.flagQuestion = function(questionIndex) {
    var questionID = $scope.questions[questionIndex].$id;
    var ref = new Firebase(FIREBASE_URL);
    var flagQuestionRef = ref.child('questions').child(questionID);
    //removeQuestionRef.remove();
	$scope.questions[questionIndex].flagged = true;
    $scope.questions.$save(questionIndex);
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "flag", user: $scope.userID, question: $scope.questions[questionIndex].content, questioner: $scope.questions[questionIndex].user, flaggedBy: "teacher"});
  };
});
