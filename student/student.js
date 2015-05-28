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
  $scope.questions = $firebaseArray(ref.child('questions').limitToLast(80));
  $scope.currentLog = ref.child('currentlog');
  $scope.userSmiley = $firebaseObject(ref.child('userSmileys'));
  $scope.filterBy = {saved: false}
  $scope.sortBy = null;
  $scope.questionView = true;
  $scope.teacherOrStudent = 'student';
  $scope.radioModelReply = 'LatestReply';
  $scope.radioModelQuestion = 'LatestQuestion';
  $("#questionScroll").scrollTop($("#questionScroll")[0].scrollHeight);
  $("#replyScroll").scrollTop($("#replyScroll")[0].scrollHeight);

  $scope.selectSmileyCool = function() {
    if ($scope.userSmiley[$scope.userID]) {
      switch ($scope.userSmiley[$scope.userID]) {
        case "cool":
          $scope.smileys.sumCool--;
          $scope.userSmiley[$scope.userID] = null;
          $timeout.cancel($scope.smileyTimeoutCool);
          break;
        case "sad":
          $scope.smileys.sumSad--;
          $scope.userSmiley[$scope.userID] = "cool";
          $scope.smileys.sumCool++;
          $timeout.cancel($scope.smileyTimeoutSad);
          $scope.smileyTimeoutCool = $timeout($scope.smileyTimerCool, $scope.smileyTimeoutValue);
          break;
        case "lost":
          $scope.smileys.sumLost--;
          $scope.userSmiley[$scope.userID] = "cool";
          $scope.smileys.sumCool++;
          $timeout.cancel($scope.smileyTimeoutLost);
          $scope.smileyTimeoutCool = $timeout($scope.smileyTimerCool, $scope.smileyTimeoutValue);
          break;
        case "asleep":
          $scope.smileys.sumAsleep--;
          $scope.userSmiley[$scope.userID] = "cool";
          $scope.smileys.sumCool++;
          $timeout.cancel($scope.smileyTimeoutAsleep);
          $scope.smileyTimeoutCool = $timeout($scope.smileyTimerCool, $scope.smileyTimeoutValue);
          break;
      };
    } else {
      $scope.smileyTimeoutCool = $timeout($scope.smileyTimerCool, $scope.smileyTimeoutValue);
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
          $timeout.cancel($scope.smileyTimeoutCool);
          $scope.smileyTimeoutSad = $timeout($scope.smileyTimerSad, $scope.smileyTimeoutValue);
          break;
        case "sad":
          $scope.smileys.sumSad--;
          $scope.userSmiley[$scope.userID] = null;
          $timeout.cancel($scope.smileyTimeoutSad);
          break;
        case "lost":
          $scope.smileys.sumLost--;
          $scope.userSmiley[$scope.userID] = "sad";
          $scope.smileys.sumSad++;
          $timeout.cancel($scope.smileyTimeoutLost);
          $scope.smileyTimeoutSad = $timeout($scope.smileyTimerSad, $scope.smileyTimeoutValue);
          break;
        case "asleep":
          $scope.smileys.sumAsleep--;
          $scope.userSmiley[$scope.userID] = "sad";
          $scope.smileys.sumSad++;
          $timeout.cancel($scope.smileyTimeoutAsleep);
          $scope.smileyTimeoutSad = $timeout($scope.smileyTimerSad, $scope.smileyTimeoutValue);
          break;
      };
    } else {
      $scope.smileyTimeoutSad = $timeout($scope.smileyTimerSad, $scope.smileyTimeoutValue);
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
          $timeout.cancel($scope.smileyTimeoutCool);
          $scope.smileyTimeoutLost = $timeout($scope.smileyTimerLost, $scope.smileyTimeoutValue);
          break;
        case "sad":
          $scope.smileys.sumSad--;
          $scope.userSmiley[$scope.userID] = "lost";
          $scope.smileys.sumLost++;
          $timeout.cancel($scope.smileyTimeoutSad);
          $scope.smileyTimeoutLost = $timeout($scope.smileyTimerLost, $scope.smileyTimeoutValue);
          break;
        case "lost":
          $scope.smileys.sumLost--;
          $scope.userSmiley[$scope.userID] = null;
          $timeout.cancel($scope.smileyTimeoutLost);
          break;
        case "asleep":
          $scope.smileys.sumAsleep--;
          $scope.userSmiley[$scope.userID] = "lost";
          $scope.smileys.sumLost++;
          $timeout.cancel($scope.smileyTimeoutAsleep);
          $scope.smileyTimeoutLost = $timeout($scope.smileyTimerLost, $scope.smileyTimeoutValue);
          break;
      };
    } else {
      $scope.smileyTimeoutLost = $timeout($scope.smileyTimerLost, $scope.smileyTimeoutValue);
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
          $timeout.cancel($scope.smileyTimeoutCool);
          $scope.smileyTimeoutAsleep = $timeout($scope.smileyTimerAsleep, $scope.smileyTimeoutValue);
          break;
        case "sad":
          $scope.smileys.sumSad--;
          $scope.userSmiley[$scope.userID] = "asleep";
          $scope.smileys.sumAsleep++;
          $timeout.cancel($scope.smileyTimeoutSad);
          $scope.smileyTimeoutAsleep = $timeout($scope.smileyTimerAsleep, $scope.smileyTimeoutValue);
          break;
        case "lost":
          $scope.smileys.sumLost--;
          $scope.userSmiley[$scope.userID] = "asleep";
          $scope.smileys.sumAsleep++;
          $timeout.cancel($scope.smileyTimeoutLost);
          $scope.smileyTimeoutAsleep = $timeout($scope.smileyTimerAsleep, $scope.smileyTimeoutValue);
          break;
        case "asleep":
          $scope.smileys.sumAsleep--;
          $scope.userSmiley[$scope.userID] = null;
          $timeout.cancel($scope.smileyTimeoutAsleep);
          break;
      };
    } else {
      $scope.smileyTimeoutAsleep = $timeout($scope.smileyTimerAsleep, $scope.smileyTimeoutValue);
      $scope.userSmiley[$scope.userID] = "asleep";
      $scope.smileys.sumAsleep++;
    };
    $scope.smileys.$save();
    $scope.userSmiley.$save();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "smileyClick", user: $scope.userID, smiley: "asleep", totalNum: $scope.smileys.sumAsleep});
  };

  $scope.smileyTimerCool = function() {
    console.log('smiley cool');
    if ($scope.userSmiley[$scope.userID] == 'cool') {
      $scope.userSmiley[$scope.userID] = null;
      $scope.smileys.sumCool--;
      $scope.smileys.$save();
      $scope.userSmiley.$save();
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: "smileyTimeout", user: $scope.userID, smiley: "cool", totalNum: $scope.smileys.sumCool});
    };
  };

  $scope.smileyTimerSad = function() {
    if ($scope.userSmiley[$scope.userID] == 'sad') {
      $scope.userSmiley[$scope.userID] = null;
      $scope.smileys.sumSad--;
      $scope.smileys.$save();
      $scope.userSmiley.$save();
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: "smileyTimeout", user: $scope.userID, smiley: "sad", totalNum: $scope.smileys.sumSad});
    };
  };

  $scope.smileyTimerLost = function() {
    if ($scope.userSmiley[$scope.userID] == 'lost') {
      $scope.userSmiley[$scope.userID] = null;
      $scope.smileys.sumLost--;
      $scope.smileys.$save();
      $scope.userSmiley.$save();
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: "smileyTimeout", user: $scope.userID, smiley: "lost", totalNum: $scope.smileys.sumLost});
    };
  };

  $scope.smileyTimerAsleep = function() {
    if ($scope.userSmiley[$scope.userID] == 'asleep') {
      $scope.userSmiley[$scope.userID] = null;
      $scope.smileys.sumAsleep--;
      $scope.smileys.$save();
      $scope.userSmiley.$save();
      var currentDateBeforeString = new Date();
      var currentDate = currentDateBeforeString.toString();
      $scope.currentLog.push({date: currentDate, action: "smileyTimeout", user: $scope.userID, smiley: "asleep", totalNum: $scope.smileys.sumAsleep});
    };
  };

  $scope.goToReplyView = function(currentQuestionKey, currentQuestionContent) {
    $scope.questionView = false;
    $scope.currentQuestionContent = currentQuestionContent;
    $scope.currentQuestionKey = currentQuestionKey;
    $scope.replies = $firebaseArray(ref.child('replies').child(currentQuestionKey));
    $scope.userItemsOnly = false;
    $scope.filterBy = null;
    $scope.sortBy = null;
    $scope.radioModelReply = 'LatestReply';
    $scope.radioModelQuestion = 'LatestQuestion';
    $("#questionScroll").scrollTop($("#questionScroll")[0].scrollHeight);
    $("#replyScroll").scrollTop($("#replyScroll")[0].scrollHeight);
  };

  $scope.goToQuestionView = function() {
    $scope.questionView = true;
    $scope.currentQuestion = null;
    $scope.userItemsOnly = false;
    $scope.filterBy = {saved: false}
    $scope.sortBy = null;
    $scope.radioModelReply = 'LatestReply';
    $scope.radioModelQuestion = 'LatestQuestion';
    $("#questionScroll").scrollTop($("#questionScroll")[0].scrollHeight);
    $("#replyScroll").scrollTop($("#replyScroll")[0].scrollHeight);
  }

  $scope.sortByVotesQuestion = function() {
    $scope.filterBy = {saved: false};
    $scope.userItemsOnly = false;
    $scope.sortBy = 'votes';
  };

  $scope.sortByVotesReply = function() {
    $scope.filterBy = null;
    $scope.userItemsOnly = false;
    $scope.sortBy = 'votes';
  };


  $scope.sortByLatestQuestion = function() {
    $scope.filterBy = {saved: false};
    $scope.userItemsOnly = false;
    $scope.sortBy = null;
  };

  $scope.sortByLatestReply = function() {
    $scope.filterBy = null;
    $scope.userItemsOnly = false;
    $scope.sortBy = null;
  };

  $scope.filterByUserQuestion = function() {
    $scope.userItemsOnly = true;
    var userID = $scope.userID;
    $scope.filterBy = {user: userID};
    $scope.sortBy = null;
  };

  $scope.filterByUserReply = function() {
    $scope.userItemsOnly = true;
    var userID = $scope.userID;
    $scope.filterBy = {user: userID};
    $scope.sortBy = null;
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
      // $scope.questions.$save(); 
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
    if (!(questionUser == $scope.userID)) // student cannot upvote question they wrote
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

});
