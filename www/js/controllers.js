angular.module('app.controllers', [])

.controller('todosCtrl', ['$scope', '$stateParams', '$firebase', '$firebaseObject',
'$firebaseArray', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebase, $firebaseObject, $firebaseArray, AuthFactory) {

  var uid =  firebase.auth().currentUser.uid;

  var todoTasks;

  $scope.newTodo = {};
  $scope.todos = {};

  getTodoList();

  function getTodoList() {
    todoTasks = AuthFactory.readData('todos/' + uid);
    console.log(todoTasks);
    $scope.todos = todoTasks;
  }

  $scope.deleteTodo = function(item) {
    console.log("bin in delete");
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

.controller('transaktionsanalyseCtrl', ['$scope', '$stateParams', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
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

    console.log("ich selbst:", myself);

    myself.$loaded().then(function() {
      if(myself.length < 0) return;

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

.controller('menuCtrl', ['$scope', '$stateParams', '$state', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, AuthFactory) {
  var user= firebase.auth().currentUser;

  if(firebase.auth().currentUser != undefined)  $scope.KAM_NAME = firebase.auth().currentUser.displayName;
  else $scope.KAM_NAME = "User nicht gesetzt";

  console.log(user);

  if (user != null) {
    user.providerData.forEach(function (profile) {

      console.log(profile);
      console.log("Sign-in provider: "+profile.providerId);
      console.log("  Provider-specific UID: "+profile.uid);
      console.log("  Name: "+ profile.displayName);
      console.log("  Email: "+profile.email);
      console.log("  Photo URL: "+profile.photoURL);

      $scope.PROFILE_PIC = profile.photoURL;


    });
  }

  $scope.logout = function() {

    $state.go('kAMToolsAnmeldung');

    firebase.auth().signOut().then(function() {
      console.log("Erfolgreich ausgeloggt");

    }, function(error) {
      console.log(error);
    });
    }
}])

.controller('lPKCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('kAMToolsAnmeldungCtrl',
          ['$scope','$stateParams', '$state', '$http', '$location', '$firebaseAuth', '$timeout', '$ionicPopup', 'AuthFactory',
 function ($scope, $stateParams, $state, $http,  $location, $firebaseAuth, $timeout, $ionicPopup, AuthFactory) {

   var provider;
   var authData = firebase.auth();

   $scope.loginData = {};

   firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $state.go('menu.todos');
    } else {
      // No user is signed in.
    }
  });

   $scope.login = function(how) {
     console.log(how);

   if(how == "credentials") {
      console.log($scope.loginData.email + "-" + $scope.loginData.password);

     firebase.auth().signInWithEmailAndPassword($scope.loginData.email, $scope.loginData.password).catch(function(error) {
       var alertPopup = $ionicPopup.alert({
           title: 'Fehler',
           template: error
       });
     });
   }
   else {

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
     else if(how =="twitter") {
       provider = new firebase.auth.TwitterAuthProvider();
     }

     AuthFactory.socialLogin(provider).then(function(result) {
       console.log("erfolgreich eingeloggt!");

       AuthFactory.setUserInfos(result.user);
       AuthFactory.setUserName(firebase.auth().currentUser.providerData[0].displayName);
       AuthFactory.setUserID(firebase.auth().currentUser.uid);

       $state.go('menu.todos');
      });

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

.controller('meineDienststellenCtrl', ['$scope', '$stateParams', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, AuthFactory) {
  var uid=firebase.auth().currentUser.uid;

  console.log(uid);

  var meineDienststellen = AuthFactory.readData('dienststellen/' + uid);
  console.log(meineDienststellen);

  $scope.dienststellen = meineDienststellen;


}])

.controller('detailedDepartmentCtrl', ['$scope', '$stateParams', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, AuthFactory) {

}])

.controller('registerCtrl', ['$scope', '$stateParams', '$state', '$ionicPopup', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicPopup, AuthFactory) {

  var auth = firebase.auth();

  $scope.register = {};

  $scope.register = function() {

    auth.createUserWithEmailAndPassword(
      $scope.register.email,
      $scope.register.password).then(function(userData) {

        console.log("User " + userData.uid + " created successfully!");

        console.log("userData nach Erstellung", userData);

        console.log("name in textfeld: ", $scope.register.fullname);
        // Namen ergänzen
        firebase.auth().currentUser.updateProfile({
          displayName: $scope.register.fullname,
        }).then(function() {
          console.log("name gesetzt, alles super");
          $state.go('menu.todos');
        }, function(error) {
          console.log("fehler beim profil updaten:", error);
          // An error happened.
        });
    }).catch(function(error) {
      /*$ionicPopup.alert({
        title: 'Fehler!',
        template: error
      });*/
      console.log("fehler in catch", error);


    });
  }
}])

.controller('dienststelleAnlegenCtrl', ['$scope', '$stateParams', '$firebaseArray', '$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $state) {

  var uid = firebase.auth().currentUser.uid;

  $scope.dst = {};

  $scope.add = function() {

    console.log("bin in add()");

    console.log($scope.dst.name);
    if($scope.dst.name.length > 0) {
      var postData = {
        dienststelle: $scope.dst.name
      };

      //var newPostKey = firebase.database().ref().child('dienststellen/' + uid).push().key;

      var updates = {};
      updates['/dienststellen/' + uid + '/' + $scope.dst.name] = postData;


      firebase.database().ref().update(updates);

      $state.go('menu.meineDienststellen');


    }
    else {
      // Toast
      console.log("feld ist leer..." + $scope.name);
    }
  }

}])

.controller('globaleNachrichtenCtrl', ['$scope', '$stateParams', '$filter', 'AuthFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $filter, AuthFactory) {

  $scope.msg = {};
  var uid=firebase.auth().currentUser.uid;


  function loadMessages() {
    var news = AuthFactory.readData('news/');

    console.log(news);
    $scope.messages = news;
  }

  loadMessages();

  $scope.addMsg = function() {

    console.log("bin in add");
    if($scope.msg.add.length > 0) {
      var postData = {
        from: firebase.auth().currentUser.displayName,
        message: $scope.msg.add,
        datetime: new Date()
      };

      var newPostKey = firebase.database().ref().child('news/' + uid).push().key;

      var updates = {};
      updates['/news/' + newPostKey] = postData;

      firebase.database().ref().update(updates);
      $scope.msg.add = '';

    }
  }
}])

.controller('neueAufgabeEintragenCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

}])
