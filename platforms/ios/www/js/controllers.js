angular.module('app.controllers', [])

.controller('todosCtrl', ['$scope', '$stateParams', '$firebase', '$firebaseObject',
'$firebaseArray', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebase, $firebaseObject, $firebaseArray, AuthFactory) {

  var dbRef = firebase.database().ref('todos');
  var path = dbRef.root.toString();
  var uid =  firebase.auth().currentUser.uid;

  var todoTasks;

  $scope.newTodo = {};
  $scope.todos = {};

  getTodoList();

  function getTodoList() {
    todoTasks = AuthFactory.readData('todos/' + uid);
    $scope.todos = todoTasks;
  }

  $scope.deleteTodo = function(item) {
    todoTasks.$remove(item).then(function(ref) {
      // ref.key() === item.$id; // true
    });
  }

  $scope.addTodo = function(){

    var postData = {
      //uid: firebase.auth().currentUser.uid,
      todo: $scope.newTodo.text,
      todoDate: $scope.newTodo.date
    };

    var newPostKey = firebase.database().ref().child('todos/' + uid).push().key;

    var updates = {};
    updates['/todos/' + uid + '/' + newPostKey] = postData;

    firebase.database().ref().update(updates);

  };

}])

.controller('transakationsanalyseCtrl', ['$scope', '$stateParams', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, AuthFactory) {
  var uid =  firebase.auth().currentUser.uid;

  var ratedCustomers = AuthFactory.readData('person_analysis/' + uid);
  $scope.customers = ratedCustomers;
}])

.controller('vorhabenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('detailedPersonController', ['$scope', '$stateParams', '$filter', '$firebaseObject', '$firebaseArray', 'transaktionsService', 'AuthFactory', function($scope, $stateParams, $filter, $firebaseObject, $firebaseArray, transaktionsService, AuthFactory) {
    $scope.person = $stateParams.personName;
    var uid =  firebase.auth().currentUser.uid;

    //var personStats = transaktionsService.getPerson($stateParams.personName);
    var analysisRef = firebase.database().ref().child("person_analysis/" + uid + '/' + $stateParams.personName);
    var ratedPerson = $firebaseArray(analysisRef);

    ratedPerson.$loaded().then(function() {
      console.log(ratedPerson);
      console.log(ratedPerson[0].$value);

      $scope.labels = [
        "KE", "VE", "EI", "SK", "RK"
      ];

      $scope.data = [
        ratedPerson[1].$value, //.KE
        ratedPerson[4].$value, //.VE,
        ratedPerson[0].$value, //.EI,
        ratedPerson[3].$value, //.SK,
        ratedPerson[2].$value //.RK
      ];

      /*$scope.data = [
        15,
        20,
        10,
        15,
        20
      ];*/

    })

    console.log(ratedPerson);

    var myselfRef = firebase.database().ref().child("person_analysis/" + uid + "/ICH");
    var myself = $firebaseArray(myselfRef);

    myself.$loaded().then(function() {
      console.log(myself);

      $scope.data_self = [
        myself[1].$value, //.KE
        myself[4].$value, //.VE,
        myself[0].$value, //.EI,
        myself[3].$value, //.SK,
        myself[2].$value //.RK
      ];

      if(myself != null) {
        $scope.myselfExists = true;
        // $scope.data_self = [myself.KE, myself.VE, myself.EI, myself.SK, myself.RK];

        var spiderData = [];
        spiderData.push($scope.data);
        spiderData.push($scope.data_self);

        console.log("spiderData:");
        console.log(spiderData);
        //$scope.spiderColors = ['#0062F1', '#ff1e1e'];
        $scope.data_spidernet = spiderData;
      }
      else {
        $scope.myselfNotSet = true;
      }
    })




}])

.controller('mainController', function($scope, transaktionsService) {
  $scope.bewertungen = transaktionsService.getAllPersons().length;

  console.log("info: hole ICH-Profil");

  var myself = transaktionsService.getPerson("ICH");

  console.log("info: ich-profil ist: " + myself);

  if(myself != null && myself != -1) {

    $scope.myselfExists = true;
    $scope.labels_self = ["KE", "VE", "EI", "SK", "RK"];
    $scope.data_self = [myself.KE, myself.VE, myself.EI, myself.SK, myself.RK];

  }
  else {
    $scope.myselfNotSet = true;
    console.log("info: ich ist nicht gesetzt");
  }
})

.controller('menuCtrl', ['$scope', '$stateParams', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, AuthFactory) {

  $scope.KAM_NAME = firebase.auth().currentUser.providerData[0].displayName;
  console.log(firebase.auth().currentUser.providerData[0].displayName);

}])

.controller('lPKCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('kAMToolsAnmeldungCtrl',
          ['$scope','$stateParams', '$state', '$http', '$location', '$firebaseAuth', 'AuthFactory',
 function ($scope, $stateParams, $state, $http,  $location, $firebaseAuth, AuthFactory) {

   var accessToken;
   var provider;

   $scope.email ='';
   $scope.password ='';

   /*if(firebase.auth().currentUser.uid.length > 0) {
     $state.go('menu.todos');
   }*/

   $scope.login = function(how) {
     console.log(how);

     console.log(firebase.auth().currentUser.uid.length);

     if(how == "google") {
       console.log("mit google");
       provider = new firebase.auth.GoogleAuthProvider();
     }
     else if(how == "facebook") {
       provider = new firebase.auth.FacebookAuthProvider();
     }
     else if(how == "github") {
       provider = new firebase.auth.GithubAuthProvider();
     }
     else { // Credential Login

     }//

     console.log($scope.email + "->" + $scope.password);

     if(firebase.auth().currentUser.uid.length <= 0) {

        AuthFactory.socialLogin(provider).then(function(result) {
          console.log("erfolgreich eingeloggt!");

          AuthFactory.setUserInfos(result.user);
          AuthFactory.setUserName(firebase.auth().currentUser.providerData[0].displayName);
          AuthFactory.setUserID(firebase.auth().currentUser.uid);

          $state.go('menu.todos');
        });

      }
      else  {
        console.log("kein login erforderlich, token ist: " + firebase.auth().currentUser.uid);
        $state.go('menu.todos');
      }
    }


}])

.controller('neuePersonBewertenCtrl', ['$scope', '$stateParams', '$state', '$ionicPopup', 'transaktionsService', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicPopup, transaktionsService, AuthFactory) {
  var KE = 0;
  var VE = 0;
  var EI = 0;
  var SK = 0;
  var RK = 0;
  var counter = 0;
  var schlagwortListe = transaktionsService.getSchlagwortListe();

  $scope.fragen = schlagwortListe;
  $scope.selected = {};
  $scope.person = {};
  $scope.binIchSelbst = {};
  $scope.checkedItems = 0;

  $scope.checkSelf = function() {
    if($scope.binIchSelbst.checked) {
      $scope.person.name ="ICH";
      $scope.enableddisabled="disabled='disabled'";
    }
    else {
      $scope.person.name="";
      $scope.enableddisabled ="";
    }
  }

  $scope.updateItemCount = function(value) {
    if($scope.selected[$scope.fragen[value].schlagwort]) $scope.checkedItems++;
    else $scope.checkedItems--;
  }

  $scope.showResult = function() {
    var wert;
    var personName = $scope.person.name;
    var uid =  firebase.auth().currentUser.uid;


    console.log("info: personenname" + personName + "scope: "  + $scope.person);

    counter = 0;
    KE = 0;
    VE = 0;
    EI = 0;
    SK = 0;
    RK = 0;

    if(personName.length == 0) {
      var alertPopup = $ionicPopup.alert({
          title: 'Achtung',
          template: 'Bitte Namen eingeben'
      });

      return;
    }

    for(var i=0; i< schlagwortListe.length; i++) {

      if($scope.selected[$scope.fragen[i].schlagwort]) {
        wert = schlagwortListe[i].schlagwort;

        if(schlagwortListe[i].cat == "KE") KE++;
        else if(schlagwortListe[i].cat == "VE") VE++;
        else if(schlagwortListe[i].cat == "EI") EI++;
        else if(schlagwortListe[i].cat == "SK") SK++;
        else if(schlagwortListe[i].cat == "RK") RK++;

        counter++;

      }
    }

    if(counter < 30 || counter > 50) {
      var alertPopup = $ionicPopup.alert({
          title: 'Achtung',
          template: 'Zwischen 30 und 50 Werte auswählen (derzeit ' + counter + ')'
      });

    }
    else {

      var personArray = {
        personName: personName,
        KE: transaktionsService.round((KE/counter)*100),
        VE: transaktionsService.round((VE/counter)*100),
        EI: transaktionsService.round((EI/counter)*100),
        SK: transaktionsService.round((SK/counter)*100),
        RK: transaktionsService.round((RK/counter)*100)

      }

      console.log("info: speichere person " + personArray);

      // !!!! var saveSuccess = transaktionsService.savePerson(personArray);
      // hier in Datenbank schreiben


      var newPostKey = firebase.database().ref().child('person_analysis/' + uid).push().key;

      var updates = {};
      updates['/person_analysis/' + uid + '/' + personName] = personArray;

      firebase.database().ref().update(updates);

      $state.go('menu.transakationsanalyse');

      /*if(saveSuccess == true) {
        var alertPopup = $ionicPopup.alert({
          title: 'Fertig!',
          template: personName + " wurde gespeichert"
        });
        alertPopup.then(function() {
          $location.path("/detailed/:" + personName);
        });
      }
      else if(saveSuccess == -1) {
        var alertPopup = $ionicPopup.alert({
          title: 'Name existiert bereits!',
          template: "Bitte anderen Namen wählen"
        });
      }
      else {
        var alertPopup = $ionicPopup.alert({
          title: 'Unbekannter Fehler!',
          template: "????"
        });
      }
      */

    }
  }

}])

.controller('meineDienststellenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('dienststelleAnlegenCtrl', ['$scope', '$stateParams', '$firebaseArray', '$cordovaToast', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $cordovaToast) {

  var uid = firebase.auth().currentUser.uid;

  $scope.add = function() {

    console.log("bin in add()");

    if($scope.name.length > 0) {
      var postData = {
        dienststelle: $scope.name
      };

      //var newPostKey = firebase.database().ref().child('dienststellen/' + uid).push().key;

      var updates = {};
      updates['/dienststellen/' + uid + '/' + $scope.name] = postData;

      firebase.database().ref().update(updates);

      $state.go('meineDienststellen');


    }
    else {
      // Toast
      $cordovaToast.showLongBottom('Bitte Bezeichnung eingeben').then(function(success) {
          // success
        }, function (error) {
          // error
        });
    }
  }

}])



.controller('neueAufgabeEintragenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

}])
