angular.module('app.controllers', [])

.controller('dashboardCtrl', ['$scope', '$stateParams', '$http', '$firebase', '$firebaseObject',
'$firebaseArray',  '$resource', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $firebase, $firebaseObject, $firebaseArray, $resource, FBFactory) {

  var url = "https://api.darksky.net/forecast/75042eae738f6f44352bf662c1d1cd8a/48.249026,16.432706?callback=JSON_CALLBACK&units=si&lang=de";
  var imgURL = "https://api.imgur.com/3/gallery/hot/viral/0.json";
  var randomNumber;
  var tempPic;
  var imgurArray;

  FBFactory.onLoggedIn().then(function(a) {
  
    // get weather
    $http.jsonp(url)
    .success(function(data){
      $scope.forecastHeader = data.currently.summary;
      $scope.forecastText = data.hourly.summary;
      $scope.currentTemperature = data.currently.temperature;
      $scope.image = data.currently.icon;

    });

    getHotImage(0);


  }).catch(function(error) {
    console.log(error);
    if(error=="Login Failed") {
      alert("Bitte neu anmelden");
      $state.go("/login");
    }
  });

  $scope.refreshPost = function() {
    currentImageCounter++;
    getHotImage();
  }

  $scope.getNewPic = function() {
    setRandomPic();
  }

  function setRandomPic() {
    randomNumber = Math.floor((Math.random() * 59) + 1);
    tempPic = imgurArray[randomNumber].cover;

    console.log("http://i.imgur.com/" + tempPic + ".jpg");

    if(tempPic == null || imgurArray[randomNumber].nsfw) {
      setRandomPic();
    }
    else {
      $scope.randomImage = "http://i.imgur.com/" + tempPic + ".jpg";
      $scope.picDescription = imgurArray[randomNumber].title;
    }
  }

  function getHotImage() {
    $http.get(imgURL)
    .success(function(data){
      imgurArray = data.data;

      console.log(data.status);
      if(status == 200) setRandomPic();
      if(status == 401) alert("unauthorized");
    });
  }

}])

.controller('todosCtrl', ['$scope', '$stateParams', '$firebase', '$firebaseObject',
'$firebaseArray', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebase, $firebaseObject, $firebaseArray, FBFactory) {

  var todoTasks;

  $scope.todos = {};

  FBFactory.onLoggedIn().then(function(a) {

    console.log("onLoggedIn todoctrl",a);
    getTodoList();
  });


  function getTodoList() {
    todoTasks = FBFactory.readData('todos/' + FBFactory.getUserID());

    $scope.todos = todoTasks;
  }

  $scope.trim = function(text) {
    return text.replace(/\n/g, '<br>');
  };

  $scope.toggleItem= function(item) {
   if ($scope.isItemShown(item)) {
     $scope.shownItem = null;
   } else {
     $scope.shownItem = item;
   }
 };

   $scope.isItemShown = function(item) {
     return $scope.shownItem === item;
   };

  $scope.deleteTodo = function(item) {
    console.log("bin in delete");
    todoTasks.$remove(item).then(function(ref) {
      // ref.key() === item.$id; // true
    });
  }

  $scope.done = function(item) {
    item.done=true;
    todoTasks.$save(item);
  }

}])

.controller('newTodoCtrl', ['$scope', '$stateParams', '$state', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, FBFactory) {
  $scope.newTodo = {};

  var todoNote;

  $scope.addTodo = function() {


    if($scope.newTodo.notes != null) todoNote = $scope.newTodo.notes;
    else todoNote = "";

    FBFactory.addTodo($scope.newTodo.text, $scope.newTodo.date,todoNote).then(function(result) {
      // done
    }).catch(function(error) {
      var alertPopup = $ionicPopup.alert({
      title: 'Fehler',
      template: error.message
      });
    });

    $state.go('menu.todos');
  };


}])

.controller('transaktionsanalyseCtrl', ['$scope', '$stateParams', '$ionicPopup', '$state', '$ionicModal', '$location', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPopup,$state, $ionicModal, $location, FBFactory) {
  var ratedCustomers;

  FBFactory.onLoggedIn().then(function(a) {
    ratedCustomers = FBFactory.readData('person_analysis/' + FBFactory.getUserID());
    $scope.customers = ratedCustomers;
  });

  $scope.goTo=function(where) {
    $location.url('/menuContent/page_detailed_person/' + where);
  }

  $scope.deletePerson = function (item) {

    var confirmPopup = $ionicPopup.confirm({
       title: 'Vorsicht',
       template: item.personName + ' sicher löschen?'
     });

   confirmPopup.then(function(res) {
     if(res) {
       ratedCustomers.$remove(item).then(function() {
          // successfully deleted
       })
       .catch(function(error) {
           var alertPopup = $ionicPopup.alert({
           title: 'Fehler',
           template: error.message
         });
       })
     }
     else {
      // console.log('You are not sure');
     }
    })
  }

}])

.controller('detailedPersonController', ['$scope', '$stateParams', '$filter', '$firebaseObject', '$firebaseArray', 'transaktionsService', 'FBFactory', function($scope, $stateParams, $filter, $firebaseObject, $firebaseArray, transaktionsService, FBFactory) {

  FBFactory.onLoggedIn().then(function(a) {
    var analysisRef = firebase.database().ref().child("person_analysis/" + FBFactory.getUserID() + '/' + $stateParams.personName);
    var ratedPerson = $firebaseArray(analysisRef);

    ratedPerson.$loaded().then(function() {

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

    })

    var myselfRef = firebase.database().ref().child("person_analysis/" + FBFactory.getUserID() + "/ICH");
    var myself = $firebaseArray(myselfRef);

    myself.$loaded().then(function() {
      if(myself.length < 0) return;

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


        //$scope.spiderColors = ['#0062F1', '#ff1e1e'];
        $scope.data_spidernet = spiderData;
      }
      else {
        $scope.myselfNotSet = true;
      }
    })

    $scope.person = $stateParams.personName;

  });



    //var personStats = transaktionsService.getPerson($stateParams.personName);

}])



.controller('menuCtrl', ['$scope', '$stateParams', '$state', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, FBFactory) {

  //var ref = new Firebase(FirebaseUrl);
  var auth = firebase.auth();

  auth.onAuthStateChanged(function(authData) {
    //$scope.userStatus = authData.password.email;

    //console.log(authData);
    if(authData == null) return;

    FBFactory.setUser(authData);

    $scope.KAM_NAME = authData.displayName;
    $scope.PROFILE_PIC = authData.photoURL;
    FBFactory.setUserName(authData.displayName);

  });


  $scope.logout = function() {

    $state.go('kAMToolsAnmeldung');

    firebase.auth().signOut().then(function() {
      console.log("Erfolgreich ausgeloggt");

    }, function(error) {
      console.log(error);
    });
    }
}])

.controller('lPKCtrl', ['$scope', '$stateParams', '$ionicFilterBar', 'FBFactory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicFilterBar, FBFactory) {
   var lpkData;


   FBFactory.onLoggedIn().then(function(state) {
     lpkData = FBFactory.readData('lpk/');
     $scope.lpk = lpkData;
   });


   $scope.toggleItem= function(item) {
    if ($scope.isItemShown(item)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = item;
    }
  };
  $scope.isItemShown = function(item) {
    return $scope.shownItem === item;
  };

  $scope.showFilterBar = function () {
    filterBarInstance = $ionicFilterBar.show({
      items: $scope.lpk,
      filterProperties: ['beschreibung'],
      update: function (filteredItems, filterText) {
        $scope.lpk = filteredItems;
        if (filterText) {
          console.log(filterText);
        }
      }
    });
  };

}])

.controller('kAMToolsAnmeldungCtrl',
          ['$scope','$stateParams', '$state', '$http', '$location', '$firebaseAuth', '$timeout', '$ionicPopup', 'FBFactory',
 function ($scope, $stateParams, $state, $http,  $location, $firebaseAuth, $timeout, $ionicPopup, FBFactory) {

   var provider;
   var authData = firebase.auth();

   $scope.loginData = {};

   firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $state.go('menu.dashboard');
    } else {
      // No user is signed in.
    }
  });

   $scope.login = function(how) {
     console.log(how);

   if(how == "credentials") {

     firebase.auth().signInWithEmailAndPassword($scope.loginData.email, $scope.loginData.password).catch(function(error) {
       var alertPopup = $ionicPopup.alert({
           title: 'Fehler',
           template: error
       });
     });
   }

   /*else {

     if(how == "google") {
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

     FBFactory.socialLogin(provider).then(function(result) {
       console.log("erfolgreich eingeloggt!");

       FBFactory.setUserInfos(result.user);
       FBFactory.setUserName(firebase.auth().currentUser.providerData[0].displayName);
       FBFactory.setUserID(firebase.auth().currentUser.uid);

       $state.go('menu.todos');
      });

    }*/

  }

}])

.controller('neuePersonBewertenCtrl', ['$scope', '$stateParams', '$state', '$ionicPopup', 'transaktionsService', 'FBFactory',
function ($scope, $stateParams, $state, $ionicPopup, transaktionsService, FBFactory) {
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

.controller('protocolsCtrl', ['$scope', '$stateParams', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, FBFactory) {

  FBFactory.onLoggedIn().then(function() {

    var protocols = FBFactory.readData('protocols/' + FBFactory.getUserID());

    $scope.protocols = protocols;
    console.log(protocols);

  });


}])

.controller('addProtocolCtrl', ['$scope', '$stateParams', '$state', 'FBFactory',

  function($scope, $stateParams, $state, FBFactory) {
    $scope.protocol = {};

    $scope.add = function() {
      if($scope.protocol.header.length < 0 || $scope.protocol.content.length < 0 || $scope.protocol.date.length <0 ) {
        alert("Nicht alle Felder ausgefüllt");
      }
      else {
        FBFactory.addProtocol($scope.protocol.header, $scope.protocol.date, $scope.protocol.content,$scope.protocol.department).then(function(res) {

          // all fine

          $state.go('menu.protocols');

        }).catch(function(error) {
          alert(error);
        })
      }
    }
  }
])

.controller('registerCtrl', ['$scope', '$stateParams', '$state', '$ionicPopup', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicPopup, FBFactory) {

  var auth = firebase.auth();

  $scope.register = {};
  $scope.error = false;


  $scope.register = function() {

    if($scope.register.password != $scope.register.validatepass) {
      $scope.error = true;
      $scope.errorMessage = "Passwörter stimmen nicht überein";

      return;
    }

    auth.createUserWithEmailAndPassword(
      $scope.register.email,
      $scope.register.password).then(function(userData) {

        console.log("User " + userData.uid + " created successfully!");

        console.log("userData nach Erstellung", userData);

        console.log("name in textfeld: ", $scope.register.fullname);
        // Namen ergänzen
        firebase.auth().currentUser.updateProfile({
          displayName: $scope.register.fullname,
          photoURL: 'https://cdn4.iconfinder.com/data/icons/avatars-gray/500/avatar-12-256.png'
        }).then(function() {
          console.log("name gesetzt, alles super");
          $state.go('/');
        }, function(error) {
          console.log("fehler beim profil updaten:", error);
          // An error happened.
        });
    }).catch(function(error) {
      $scope.error = true;
      $scope.errorMessage = error;


      var alert = $ionicPopup.alert({
         title: 'Fehler',
         template: error
       });


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

.controller('chatCtrl', ['$scope', '$stateParams', '$filter', '$firebaseArray', '$ionicScrollDelegate', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $filter, $firebaseArray, $ionicScrollDelegate, FBFactory) {

  $scope.msg = {};


  FBFactory.onLoggedIn().then(function() {
    $scope.myUsername = FBFactory.getUserName();
    loadMessages();
  });

  function loadMessages() {
    var news = FBFactory.readData('news/');

    var ref = firebase.database().ref().child('news/');
    $scope.messages = $firebaseArray(ref);

    ref.on('child_added', function(message) {
      var message = message.val();
      news.push(message);
      $ionicScrollDelegate.scrollBottom();
    });

    $ionicScrollDelegate.scrollBottom();
  }

  $scope.addMsg = function() {

    if($scope.msg.add.length > 0) {
      FBFactory.addChatMsg($scope.msg.add).catch(function(error) {
        console.log("fehler!", error);
      });

      $scope.msg.add = '';
      $ionicScrollDelegate.scrollBottom();

    }
  }
}])

.controller('editprofileCtrl', ['$scope', '$stateParams', '$firebaseArray', '$ionicPopup', 'FBFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $firebaseArray, $ionicPopup, FBFactory) {
  // Points to the root reference

  $scope.profile = {};
  $scope.avatars = [];

  var tempUrls = [];

  FBFactory.onLoggedIn().then(function(result) {
    var avatarLinks = FBFactory.readData('avatars/public/').$loaded(function(data) {

      for (var i = 0; i < data.length; i++) {
        curRef = firebase.storage().ref().child('avatar').child(data[i].$id + '.png').getDownloadURL().then(function(url) {
          //tempUrls.push({ "url": url });

          console.log(data.length);

          $scope.avatars.push({"url" : url});

        });

      }
      $scope.$apply();
    });

  });

  $scope.setAvatar=function(imageURL) {

    var confirmPopup = $ionicPopup.confirm({
       title: 'Profilbild',
       template: 'Soll dies dein Profilbild sein?'
     });

   confirmPopup.then(function(res) {
     if(res) {
       firebase.auth().currentUser.updateProfile({
         photoURL: imageURL,
       }).then(function() {
         console.log("name gesetzt, alles super");
         $state.go('menu.todos');
       }, function(error) {
         console.log("fehler beim profil updaten:", error);
         // An error happened.
       });
     }
   });

  }

  $scope.changePassword = function() {

    if($scope.profile.newpassword != $scope.profile.newpassword2) {
      $ionicPopup.alert({
        title: "Achtung",
        template: "Passwörter stimmen nicht überein"
      });
      return;
    }

    console.log($scope.profile.newpassword);

    firebase.auth().currentUser.updatePassword($scope.profile.newpassword).then(function() {
      $ionicPopup.alert({
        title: "Erfolg",
        template: "Passwort geändert - bitte neu einloggen"
      });

    }).catch(function(error) {
      $ionicPopup.alert({
        title: "Fehler",
        template: error
      });
    });
    }

}])
