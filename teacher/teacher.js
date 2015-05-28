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
  $scope.radioModelReply = 'LatestReply';
  $scope.radioModelQuestion = 'LatestQuestion';
  $("#questionScroll").scrollTop($("#questionScroll")[0].scrollHeight);
  $("#replyScroll").scrollTop($("#replyScroll")[0].scrollHeight);


  $scope.goToReplyView = function(currentQuestionKey, currentQuestionContent) {
    $scope.questionView = false;
    $scope.currentQuestionContent = currentQuestionContent;
    $scope.currentQuestionKey = currentQuestionKey;
    $scope.replies = $firebaseArray(ref.child('replies').child(currentQuestionKey));
    $scope.filterBy = null;
    $scope.sortBy = null;
    $scope.saved = false;
    $scope.radioModelReply = 'LatestReply';
    $scope.radioModelQuestion = 'LatestQuestion';
    $("#questionScroll").scrollTop($("#questionScroll")[0].scrollHeight);
    $("#replyScroll").scrollTop($("#replyScroll")[0].scrollHeight);
  };

  $scope.goToQuestionView = function() {
    $scope.questionView = true;
    $scope.currentQuestion = null;
    $scope.filterBy = {saved: false};
    $scope.sortBy = null;
    $scope.saved = false;
    $scope.radioModelReply = 'LatestReply';
    $scope.radioModelQuestion = 'LatestQuestion';
    $("#questionScroll").scrollTop($("#questionScroll")[0].scrollHeight);
    $("#replyScroll").scrollTop($("#replyScroll")[0].scrollHeight);
  }

  $scope.sortByVotesQuestion = function() {
    $scope.saved = false;
    $scope.filterBy = {saved: false};
    $scope.sortBy = 'votes';
  };

  $scope.sortByVotesReply = function() {
    $scope.saved = false;
    $scope.filterBy = null;
    $scope.sortBy = 'votes';
  };

  $scope.sortByLatestQuestion = function() {
    $scope.saved = false;
    $scope.filterBy = {saved: false};
    $scope.sortBy = null;
  };

  $scope.sortByLatestReply = function() {
    $scope.saved = false;
    $scope.filterBy = null;
    $scope.sortBy = null;
  };

  $scope.filterBySaved = function() {
    $scope.filterBy = {saved: true};
    $scope.sortBy = null;
    $scope.saved = true;
  };

  $scope.addQuestion = function() {
    if ($scope.question != "") {
      var timestr = getTimeDate();
      var newQuestion = {
        user: $scope.userID, date: timestr, votes: 1, content: $scope.question, action: "new question", askedBy: $scope.teacherOrStudent, saved: false, numReplies: 0, userVotes: {test: "test"}
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
      if ($scope.questions.$indexFor($scope.currentQuestionKey) >= 0) {  // Check that question still exists
        var questionIndexForReply = $scope.questions.$indexFor($scope.currentQuestionKey);
        $scope.questions[questionIndexForReply].numReplies++;
        $scope.questions.$save(questionIndexForReply);
      }
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
      if ($scope.questions.$indexFor(questionKey) >= 0) {  // Check that question still exists
        var questionIndexForVote = $scope.questions.$indexFor(questionKey);
        if (!$scope.questions[questionIndexForVote].userVotes[$scope.userID]) {
          $scope.questions[questionIndexForVote].votes++;
          $scope.questions.$save(questionIndexForVote);
          var voteType = "question upvote";
        } else {
          $scope.questions[questionIndexForVote].votes--;
          $scope.questions.$save(questionIndexForVote);
          var voteType = "question downvote";
        };
      };
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: voteType, user: $scope.userID, question: questionContent, questioner: questionUser, votes: questionVotes, votedBy: $scope.teacherOrStudent} );
    };
  };

  $scope.replyVote = function(replyKey, replyContent, replyUser, replyUserVoted, replyVotes) 
  {
    if (!(replyUser == $scope.userID)) // teacher cannot upvote question they wrote. allow this!
    {
      if ($scope.replies.$indexFor(replyKey) >= 0) {  // Check that reply still exists
        var replyIndexForVote = $scope.replies.$indexFor(replyKey);
        if (!$scope.replies[replyIndexForVote].userVotes[$scope.userID]) {
          $scope.replies[replyIndexForVote].votes++;
          $scope.replies.$save(replyIndexForVote);
          var voteType = "reply upvote";
        } else {
          $scope.replies[replyIndexForVote].votes--;
          $scope.replies.$save(replyIndexForVote);
          var voteType = "reply downvote";
        };
      };
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: voteType, user: $scope.userID, reply: replyContent, replier: replyUser, votes: replyVotes, votedBy: $scope.teacherOrStudent} );
    };
  };


  $scope.questionRemove = function(questionKey, questionContent, questionUser) 
  {
    if ($scope.questions.$indexFor(questionKey) >= 0) {  // Check that question still exists
      var questionIndexForRemove = $scope.questions.$indexFor(questionKey);
      $scope.questions.$remove(questionIndexForRemove);
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: "remove question", user: $scope.userID, question: questionContent, questioner: questionUser, removedBy: $scope.teacherOrStudent});
    };
  };

  $scope.replyRemove = function(replyKey, replyContent, replyUser) 
  {
    if ($scope.replies.$indexFor(replyKey) >= 0) {  // Check that question still exists
      var replyIndexForRemove = $scope.replies.$indexFor(replyKey);
      $scope.replies.$remove(replyIndexForRemove);
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: "remove reply", user: $scope.userID, reply: replyContent, replier: replyUser, removedBy: $scope.teacherOrStudent});
    };
    if ($scope.questions.$indexFor($scope.currentQuestionKey) >= 0) {  // Check that question still exists
      var questionIndexForReply = $scope.questions.$indexFor($scope.currentQuestionKey);
      $scope.questions[questionIndexForReply].numReplies--;
      $scope.questions.$save(questionIndexForReply);
    };
  };

  $scope.savedQuestion = function(questionKey, questionContent, questionUser) 
  {
    if ($scope.questions.$indexFor(questionKey) >= 0) {  // Check that question still exists
      var questionIndexForSave = $scope.questions.$indexFor(questionKey);
      $scope.questions[questionIndexForSave].saved = true;
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: "save question", user: $scope.userID, question: questionContent, questioner: questionUser, savedBy: $scope.teacherOrStudent});
    };
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
