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

  $scope.goToReplyView = function(currentQuestionKey, currentQuestionContent) {
    $scope.questionView = false;
    $scope.currentQuestionContent = currentQuestionContent;
    $scope.currentQuestionKey = currentQuestionKey;
    $scope.replies = $firebaseArray(ref.child('questions').child(currentQuestionKey).child('replies'));
    $scope.userItemsOnly = false;
    $scope.filterBy = null;
    $scope.sortBy = null;
  };

  $scope.goToQuestionView = function() {
    $scope.questionView = true;
    $scope.currentQuestion = null;
    $scope.userItemsOnly = false;
    $scope.filterBy = {saved: false}
    $scope.sortBy = null;
  }

  $scope.sortByVotes = function() {
    if ($scope.questionView) {
      $scope.filterBy = {saved: false};
    } else {
      $scope.filterBy = null;
    };
    $scope.userItemsOnly = false;
    $scope.sortBy = 'votes';
  };

  $scope.sortByLatest = function() {
    if ($scope.questionView) {
      $scope.filterBy = {saved: false};
    } else {
      $scope.filterBy = null;
    };
    $scope.userItemsOnly = false;
    $scope.sortBy = null;
  };

  $scope.filterByUser = function() {
    $scope.userItemsOnly = true;
    var userID = $scope.userID;
    $scope.filterBy = {user: userID};
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
    if (!(questionUser == $scope.userID)) // studnet cannot upvote question they wrote
    {
      var ref = new Firebase(FIREBASE_URL);
      var selectedQuestionUserVotesRef = ref.child('questions').child(questionKey).child('userVotes').child($scope.userID);
      if (!questionUserVoted) // student hasn't upvoted this yet
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
      var selectedReplyUserVotesRef = ref.child('questions').child($scope.currentQuestionKey).child('replies').child(replyKey).child('userVotes').child($scope.userID);
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
      var selectedReplyRef = ref.child('questions').child($scope.currentQuestionKey).child('replies').child(replyKey);
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
    var removeReplyRef = ref.child('questions').child($scope.currentQuestionKey).child('replies').child(replyKey);
    removeReplyRef.remove();
    var currentDateBeforeString = new Date();
    var currentDate = currentDateBeforeString.toString();
    $scope.currentLog.push({date: currentDate, action: "remove reply", user: $scope.userID, reply: replyContent, replier: replyUser, removedBy: $scope.teacherOrStudent});
  };

});
