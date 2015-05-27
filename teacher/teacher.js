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
  $scope.questions = $firebaseArray(ref.child('questions').limitToLast(80));
  $scope.currentLog = ref.child('currentlog');
  $scope.filterBy = {saved: false};
  $scope.sortBy = 'null';
  $scope.questionView = true;
  $scope.teacherOrStudent = 'teacher';

  $scope.goToReplyView = function(currentQuestionKey, currentQuestionContent) {
    $scope.questionView = false;
    $scope.currentQuestionContent = currentQuestionContent;
    $scope.currentQuestionKey = currentQuestionKey;
    $scope.replies = $firebaseArray(ref.child('replies').child(currentQuestionKey));
    $scope.filterBy = null;
    $scope.sortBy = null;
  };

  $scope.goToQuestionView = function() {
    $scope.questionView = true;
    $scope.currentQuestion = null;
    $scope.filterBy = {saved: false};
    $scope.sortBy = null;
  }

  $scope.sortByVotes = function() {
    if ($scope.questionView) {
      $scope.filterBy = {saved: false};
    } else {
      $scope.filterBy = null;
    };
    $scope.sortBy = 'votes';
  };

  $scope.sortByLatest = function() {
    if ($scope.questionView) {
      $scope.filterBy = {saved: false};
    } else {
      $scope.filterBy = null;
    };
    $scope.sortBy = null;
  };

  $scope.filterBySaved = function() {
    $scope.filterBy = {saved: true};
    $scope.sortBy = 'votes';
  };

  $scope.addQuestion = function() {
    if ($scope.question != "") {
      var timestr = getTimeDate();
      var newQuestion = {
        user: $scope.userID, date: timestr, votes: 1, content: $scope.question, action: "new question", askedBy: $scope.teacherOrStudent, saved: false, userVotes: {test: "test"}
      };
	    newQuestion.userVotes[$scope.userID] = true;
      $scope.questions.$add(newQuestion);
      $scope.question = "";
      $scope.currentLog.push(newQuestion); 
    };
  };

  $scope.addReply = function() {
    if ($scope.reply != "") {
      var timestr = getTimeDate();
      var newReply = {
        user: $scope.userID, date: timestr, votes: 1, content: $scope.reply, action: "new reply", askedBy: $scope.teacherOrStudent, userVotes: {test: "test"}
      };
      newReply.userVotes[$scope.userID] = true;
      $scope.replies.$add(newReply);
      $scope.reply = "";
      $scope.currentLog.push(newReply); 
    };
  };

  function getTimeDate() {
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var timedate = hours + ':' + minutes + ' ' + ampm;
    return timedate;
  };

  $scope.questionVote = function(questionKey, questionContent, questionUser, questionUserVoted, questionVotes) 
  {
    if (!(questionUser == $scope.userID)) // teacher cannot upvote question they wrote. allow this!
	  {
      var ref = new Firebase(FIREBASE_URL);
      var selectedQuestionUserVotesRef = ref.child('questions').child(questionKey).child('userVotes').child($scope.userID);
      if (!questionUserVoted) // teacher hasn't upvoted this yet
	    {
        var voteType = "question upvote";
        questionVotes++;
        selectedQuestionUserVotesRef.set(true);
      } 
	      else // otherwise a downvote
	    { 
		    voteType = "question downvote";
        questionVotes--;
        selectedQuestionUserVotesRef.remove();
      };
      var selectedQuestionRef = ref.child('questions').child(questionKey);
      selectedQuestionRef.update({votes: questionVotes});
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: voteType, user: $scope.userID, question: questionContent, questioner: questionUser, votes: questionVotes, votedBy: $scope.teacherOrStudent} );
    };
  };

  $scope.replyVote = function(replyKey, replyContent, replyUser, replyUserVoted, replyVotes) 
  {
    if (!(replyUser == $scope.userID)) // teacher cannot upvote question they wrote. allow this!
    {
      var ref = new Firebase(FIREBASE_URL);
      var selectedReplyUserVotesRef = ref.child('replies').child($scope.currentQuestionKey).child(replyKey).child('userVotes').child($scope.userID);
      if (!replyUserVoted) // teacher hasn't upvoted this yet
      {
        var voteType = "reply upvote";
        replyVotes++;
        selectedReplyUserVotesRef.set(true);
      } 
        else // otherwise a downvote
      { 
        voteType = "reply downvote";
        replyVotes--;
        selectedReplyUserVotesRef.remove();
      };
      var selectedReplyRef = ref.child('replies').child($scope.currentQuestionKey).child(replyKey);
      selectedReplyRef.update({votes: replyVotes});
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: voteType, user: $scope.userID, reply: replyContent, replier: replyUser, votes: replyVotes, votedBy: $scope.teacherOrStudent} );
    };
  };


  $scope.questionRemove = function(questionKey, questionContent, questionUser) 
  {
    var ref = new Firebase(FIREBASE_URL);
    var removeQuestionRef = ref.child('questions').child(questionKey);
    removeQuestionRef.remove();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "remove question", user: $scope.userID, question: questionContent, questioner: questionUser, removedBy: $scope.teacherOrStudent});
  };

  $scope.replyRemove = function(replyKey, replyContent, replyUser) 
  {
    var ref = new Firebase(FIREBASE_URL);
    var removeReplyRef = ref.child('replies').child($scope.currentQuestionKey).child(replyKey);
    removeReplyRef.remove();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "remove reply", user: $scope.userID, reply: replyContent, replier: replyUser, removedBy: $scope.teacherOrStudent});
  };

  $scope.savedQuestion = function(questionKey, questionContent, questionUser) 
  {
    var ref = new Firebase(FIREBASE_URL);
    var selectedQuestionRef = ref.child('questions').child(questionKey);
    selectedQuestionRef.update({saved: true});
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "save question", user: $scope.userID, question: questionContent, questioner: questionUser, savedBy: $scope.teacherOrStudent});
  };

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
    var refReplies = new Firebase(FIREBASE_URL + 'replies');
    refReplies.remove();
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
});
