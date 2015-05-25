'use strict';

angular.module('myApp.student', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider.when('/student', {
    templateUrl: '/student/student.html',
    controller: 'StudentCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
})

.controller('StudentCtrl', function($scope, currentAuth, FIREBASE_URL, $firebaseArray, $firebaseObject, $timeout) {

  $scope.userID = currentAuth.uid;
	var ref = new Firebase(FIREBASE_URL);
  $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
  $scope.smileys = $firebaseObject(ref.child('smileys'));
  $scope.currentLog = ref.child('currentlog');
  $scope.userSmiley = $firebaseObject(ref.child('userSmileys'));


  $scope.selectSmileyCool = function() {
    if ($scope.userSmiley[$scope.userID]) {
      switch ($scope.userSmiley[$scope.userID]) {
        case "cool":
          $scope.smileys.sumCool--;
          $scope.userSmiley[$scope.userID] = null;
          break;
        case "sad":
          $scope.smileys.sumSad--;
          $scope.userSmiley[$scope.userID] = "cool";
          $scope.smileys.sumCool++;
          break;
        case "lost":
          $scope.smileys.sumLost--;
          $scope.userSmiley[$scope.userID] = "cool";
          $scope.smileys.sumCool++;
          break;
        case "asleep":
          $scope.smileys.sumAsleep--;
          $scope.userSmiley[$scope.userID] = "cool";
          $scope.smileys.sumCool++;
          break;
      };
    } else {
      $scope.userSmiley[$scope.userID] = "cool";
      $scope.smileys.sumCool++;
    };
    $scope.smileys.$save();
    $scope.userSmiley.$save();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "smileyClick", user: $scope.userID, smiley: "cool", totalNum: $scope.smileys.sumCool});
  };


  $scope.selectSmileySad = function() {
    if ($scope.userSmiley[$scope.userID]) {
      switch ($scope.userSmiley[$scope.userID]) {
        case "cool":
          $scope.smileys.sumCool--;
          $scope.userSmiley[$scope.userID] = "sad";
          $scope.smileys.sumSad++;
          break;
        case "sad":
          $scope.smileys.sumSad--;
          $scope.userSmiley[$scope.userID] = null;
          break;
        case "lost":
          $scope.smileys.sumLost--;
          $scope.userSmiley[$scope.userID] = "sad";
          $scope.smileys.sumSad++;
          break;
        case "asleep":
          $scope.smileys.sumAsleep--;
          $scope.userSmiley[$scope.userID] = "sad";
          $scope.smileys.sumSad++;
          break;
      };
    } else {
      $scope.userSmiley[$scope.userID] = "sad";
      $scope.smileys.sumSad++;
    };
    $scope.smileys.$save();
    $scope.userSmiley.$save();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "smileyClick", user: $scope.userID, smiley: "sad", totalNum: $scope.smileys.sumSad});
  };


  $scope.selectSmileyLost = function() {
    if ($scope.userSmiley[$scope.userID]) {
      switch ($scope.userSmiley[$scope.userID]) {
        case "cool":
          $scope.smileys.sumCool--;
          $scope.userSmiley[$scope.userID] = "lost";
          $scope.smileys.sumLost++;
          break;
        case "sad":
          $scope.smileys.sumSad--;
          $scope.userSmiley[$scope.userID] = "lost";
          $scope.smileys.sumLost++;
          break;
        case "lost":
          $scope.smileys.sumLost--;
          $scope.userSmiley[$scope.userID] = null;
          break;
        case "asleep":
          $scope.smileys.sumAsleep--;
          $scope.userSmiley[$scope.userID] = "lost";
          $scope.smileys.sumLost++;
          break;
      };
    } else {
      $scope.userSmiley[$scope.userID] = "lost";
      $scope.smileys.sumLost++;
    };
    $scope.smileys.$save();
    $scope.userSmiley.$save();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "smileyClick", user: $scope.userID, smiley: "lost", totalNum: $scope.smileys.sumLost});
  };

  $scope.selectSmileyAsleep = function() {
    if ($scope.userSmiley[$scope.userID]) {
      switch ($scope.userSmiley[$scope.userID]) {
        case "cool":
          $scope.smileys.sumCool--;
          $scope.userSmiley[$scope.userID] = "asleep";
          $scope.smileys.sumAsleep++;
          break;
        case "sad":
          $scope.smileys.sumSad--;
          $scope.userSmiley[$scope.userID] = "asleep";
          $scope.smileys.sumAsleep++;
          break;
        case "lost":
          $scope.smileys.sumLost--;
          $scope.userSmiley[$scope.userID] = "asleep";
          $scope.smileys.sumAsleep++;
          break;
        case "asleep":
          $scope.smileys.sumAsleep--;
          $scope.userSmiley[$scope.userID] = null;
          break;
      };
    } else {
      $scope.userSmiley[$scope.userID] = "asleep";
      $scope.smileys.sumAsleep++;
    };
    $scope.smileys.$save();
    $scope.userSmiley.$save();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "smileyClick", user: $scope.userID, smiley: "asleep", totalNum: $scope.smileys.sumAsleep});
  };


  $scope.sortByVotes = function() {
    $scope.questions = $firebaseArray(ref.child('questions').orderByChild("votes").limitToLast(40));
    $scope.yourQuestions = false;
  };

  $scope.sortByLatest = function() {
    $scope.questions = $firebaseArray(ref.child('questions').limitToLast(40));
    $scope.yourQuestions = false;
  };

  $scope.userQuestions = function() {
    $scope.questions = $firebaseArray(ref.child('questions').orderByChild('user').equalTo($scope.userID));
    $scope.yourQuestions = true;
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
	  var userID = $scope.userID;
      var newQuestion = {
        //user: $scope.userID, date: timestr, votes: 0, content: $scope.question, userVotes: {test: "test"}
        user: $scope.userID, date: timestr, votes: 1, content: $scope.question, 
		userVotes: {test: "test"}
      }; 
      newQuestion.userVotes[$scope.userID] = true;	// include questioner as a voter 
								// so if everyone downvotes this question then it will disappear!

      $scope.questions.$add(newQuestion);
      // $scope.questions.$add(newQuestion).then(function(ref) {
      //   var questionKey = ref.key();
      //   var keyAndQuestion = {};
      //   keyAndQuestion[questionKey] = newQuestion;
      //   var ref = new Firebase(FIREBASE_URL);
      //   var userRef = ref.child('users').child($scope.userID);
      //   userRef.update(keyAndQuestion);
      // });
      $scope.question = "";
	  newQuestion["action"] = "newQuestion";
	  newQuestion["user"] = $scope.userID;
      $scope.currentLog.push(newQuestion); 
    };
  };

  $scope.questionUpVote = function(questionIndex) 
  {
    //if (!($scope.questions[questionIndex].user == $scope.userID)) // cannot upvote your question
	{
	  var voteType = "upvote";
      if (!$scope.questions[questionIndex].userVotes[$scope.userID])  // currently not voted on
	  {
        $scope.questions[questionIndex].votes++; 
        $scope.questions[questionIndex].userVotes[$scope.userID] = true;
        $scope.questions.$save(questionIndex);
      } 
	  else  // I upvoted it, so now downvote it
	  {
		voteType = "downvote";
        $scope.questions[questionIndex].votes--;
        $scope.questions.$save(questionIndex);
        var ref = new Firebase(FIREBASE_URL);
        var removeUpvoteRef = ref.child('questions').child($scope.questions[questionIndex].$id).child('userVotes').child($scope.userID);
        removeUpvoteRef.remove();
      };
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: voteType, user: $scope.userID, question: $scope.questions[questionIndex].content, votes: $scope.questions[questionIndex].votes});
		// remove question if zero people interested
		var numVotes = $scope.questions[questionIndex].votes;
		var isFlagged = $scope.questions[questionIndex].flagged;
        if (numVotes == 0 && !isFlagged)
        {
        	var removeQuestionRef = ref.child('questions').child($scope.questions[questionIndex].$id);
        	removeQuestionRef.remove();
        }
    };
  };

  $scope.questionRemove = function(questionIndex) {
    var questionID = $scope.questions[questionIndex].$id;
    var ref = new Firebase(FIREBASE_URL);
    var removeQuestionRef = ref.child('questions').child(questionID);
    var isFlagged = ref.child('questions').child(questionID).flagged;
    removeQuestionRef.remove();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "removeQuestion", user: $scope.userID, question: $scope.questions[questionIndex].content, removedBy: "student"});
  };

});
