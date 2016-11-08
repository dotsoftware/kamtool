
angular.module('app.services', ['ngResource'])

//.factory('Weather', 'forecastioWeather')

.factory('FBFactory', ['$rootScope', '$firebaseArray', '$timeout', function($firebaseAuth, $firebaseArray, $rootScope, $timeout){

  var userID;
  var auth = firebase.auth();
  var userInfo;
  var userName;

  return {

    onLoggedIn: function() {

      var promise = new Promise(function(resolve, reject) {

        firebase.auth().onAuthStateChanged(function(authData) {

          if (authData.displayName.length >0) {
            userID = authData.uid;
            userName = authData.displayName;
            userInfo = authData;

            resolve("Login successful");
          }
          else {
            reject(Error("Login Failed"));
          }
        });

      });

      return promise;

    },

    addTodo: function(what, when, notes) {
      var postData = {
        //uid: firebase.auth().currentUser.uid,
        todo: what,
        todoDate: when,
        todoNote: notes,
        done: false
      };


      var newPostKey = firebase.database().ref().child('todos/' + userID).push().key;

      var updates = {};
      updates['/todos/' + userID + '/' + newPostKey] = postData;

      return firebase.database().ref().update(updates);
    },

    addChatMsg: function(what) {
      var postData = {
        from: userInfo.displayName,
        message: what,
        datetime: new Date(),
        photoURL: (userInfo.photoURL == null ? "https://cdn4.iconfinder.com/data/icons/avatars-gray/500/avatar-12-256.png" : userInfo.photoURL)
      };

      var newPostKey = firebase.database().ref().child('news/' + userID).push().key;

      var updates = {};
      updates['/news/' + newPostKey] = postData;

      return firebase.database().ref().update(updates); //Promise
    },

    setUser: function(authData) {
      userInfo = authData.currentUser;
    },

    readData: function(table) {
      var userPostsRef = firebase.database().ref().child(table);
      return $firebaseArray(userPostsRef);
    },

    getUserID: function() {
        return firebase.auth().currentUser.uid;

    },

    setUserID: function(id) {
      userID = id;
    },

    getAuth: function() {
      return auth;
    },

    getUserName: function() {
      return userName;
    },

    setUserName: function(user) {
      userName = user;
    },

    setUserInfos: function(userInfos) {
      userInfo = userInfos;
    },
    getUserInfos: function() {
      return userInfo;
    }
  }
}])

.service('transaktionsService',['$filter', function($filter) {
  const SETTINGS_PERSONS_KEY = "settings_personen";

  var fragen = [
    { schlagwort: "akzeptierend", cat: "VE" },
    { schlagwort: "Alternative", cat: "EI" },
    { schlagwort: "anpassen", cat: "RK"} ,
    { schlagwort: "artig", cat: "VE" },
    { schlagwort: "aufgeregt", cat: "RK" },
    { schlagwort: "aufmunternd", cat: "SK" },
    { schlagwort: "aufrichtig", cat: "EI"} ,
    { schlagwort: "ausgezeichnet", cat: "VE" },
    { schlagwort: "beobachtend", cat: "KE" },
    { schlagwort: "besorgt", cat: "VE" },
    { schlagwort: "bestimmend", cat: "KE"} ,
    { schlagwort: "betrübt", cat: "RK" },
    { schlagwort: "definitv", cat: "KE" },
    { schlagwort: "einschätzend", cat: "KE" },
    { schlagwort: "einstimmend", cat: "RK"} ,
    { schlagwort: "energisch", cat: "SK" },
    { schlagwort: "entschuldige", cat: "RK" },
    { schlagwort: "Ergebnis", cat: "EI" },
    { schlagwort: "feste Regeln", cat: "KE"} ,
    { schlagwort: "festlich", cat: "SK" },
    { schlagwort: "flirten", cat: "SK" },
    { schlagwort: "fragend", cat: "EI" },
    { schlagwort: "frei", cat: "SK"} ,
    { schlagwort: "freundlich", cat: "VE" },
    { schlagwort: "fürsorglich", cat: "VE" },
    { schlagwort: "gefügig", cat: "RK" },
    { schlagwort: "gleichmäßig", cat: "EI" },
    { schlagwort: "grießgrämig", cat: "RK"} ,
    { schlagwort: "großzügig", cat: "VE" },
    { schlagwort: "gut", cat: "VE" },
    { schlagwort: "hab keine Angst", cat: "VE" },
    { schlagwort: "heimlich", cat: "SK"} ,
    { schlagwort: "hemmungslos", cat: "SK" },
    { schlagwort: "herrlich", cat: "VE" },
    { schlagwort: "hilfsbereit", cat: "VE" },
    { schlagwort: "hoch", cat: "SK"} ,
    { schlagwort: "hör zu", cat: "SK" },
    { schlagwort: "immer", cat: "KE" },
    { schlagwort: "Information", cat: "EI" },
    { schlagwort: "insensibel", cat: "EI"} ,
    { schlagwort: "instruierend", cat: "KE" },
    { schlagwort: "interessiert", cat: "EI" },
    { schlagwort: "kann nicht", cat: "RK" },
    { schlagwort: "kategorisch", cat: "KE"} ,
    { schlagwort: "kichernd", cat: "SK" },
    { schlagwort: "korrekt", cat: "EI" },
    { schlagwort: "kritisch", cat: "KE" },
    { schlagwort: "lächelnd", cat: "VE"} ,
    { schlagwort: "lass mich", cat: "VE" },
    { schlagwort: "lebhaft", cat: "EI" },
    { schlagwort: "ledig", cat: "SK"} ,
    { schlagwort: "leicht irritiert", cat: "KE" },
    { schlagwort: "liebevoll", cat: "VE" },
    { schlagwort: "meine eigene", cat: "SK" },
    { schlagwort: "Menge", cat: "EI"} ,
    { schlagwort: "mögen", cat: "VE" },
    { schlagwort: "muss", cat: "KE" },
    { schlagwort: "müsste", cat: "KE" },
    { schlagwort: "nett", cat: "RK"} ,
    { schlagwort: "neugierig", cat: "SK" },
    { schlagwort: "nie", cat: "KE" },
    { schlagwort: "objektiv", cat: "EI" },
    { schlagwort: "offen", cat: "EI"} ,
    { schlagwort: "offene Arme", cat: "VE" },
    { schlagwort: "ordentlich", cat: "KE" },
    { schlagwort: "plaudern", cat: "SK"} ,
    { schlagwort: "populär", cat: "SK" },
    { schlagwort: "praktisch", cat: "EI" },
    { schlagwort: "reiß dich zusammen", cat: "KE" },
    { schlagwort: "richtig", cat: "KE"} ,
    { schlagwort: "rücksichtsvoll", cat: "EI" },
    { schlagwort: "ruhig", cat: "EI" },
    { schlagwort: "schätzend", cat: "EI" },
    { schlagwort: "schüchtern", cat: "RK"} ,
    { schlagwort: "schweigsam", cat: "RK" },
    { schlagwort: "sei so nett", cat: "RK" },
    { schlagwort: "sei vorsichtig", cat: "VE" },
    { schlagwort: "seriös", cat: "KE"} ,
    { schlagwort: "sollte", cat: "KE" },
    { schlagwort: "spannend", cat: "SK" },
    { schlagwort: "Spaß", cat: "SK"} ,
    { schlagwort:  "Spaßvogel", cat: "SK" },
    { schlagwort: "spontan", cat: "SK" },
    { schlagwort: "streichelnd", cat: "VE" },
    { schlagwort: "strikt", cat: "KE"} ,
    { schlagwort: "superb", cat: "SK" },
    { schlagwort: "sympathisch", cat: "VE" },
    { schlagwort: "Theorie", cat: "EI" },
    { schlagwort: "traurig", cat: "RK"} ,
    { schlagwort: "tröstend", cat: "VE" },
    { schlagwort: "tüchtig", cat: "RK" },
    { schlagwort: "tue nicht", cat: "KE" },
    { schlagwort: "verschlossen", cat: "KE"} ,
    { schlagwort: "versöhnend", cat: "RK" },
    { schlagwort: "verständnisvoll", cat: "VE" },
    { schlagwort: "versuchen", cat: "RK"} ,
    { schlagwort: "Vertrauter", cat: "EI" },
    { schlagwort: "verurteilend", cat: "KE" },
    { schlagwort: "verzeih", cat: "RK" },
    { schlagwort: "verzeihend", cat: "RK"} ,
    { schlagwort: "vielen Dank", cat: "RK" },
    { schlagwort: "Vorbild", cat: "KE" },
    { schlagwort: "vorsichtig", cat: "RK" },
    { schlagwort: "warum", cat: "EI"} ,
    { schlagwort: "was", cat: "EI" },
    { schlagwort: "wechselhaft", cat: "SK" },
    { schlagwort: "weich", cat: "VE" },
    { schlagwort: "wie", cat: "EI"} ,
    { schlagwort: "will", cat: "SK" },
    { schlagwort: "will nicht", cat: "SK" },
    { schlagwort: "wünsche", cat: "RK"} ,
    { schlagwort: "zur Seite stehend", cat: "RK" },
    { schlagwort: "zustimmend", cat: "RK" },
    { schlagwort: "zuverlässig", cat: "EI" }
  ];

  this.round = function(value) {
    return Math.round(value * 100) / 100;
  }
  this.getSchlagwortListe = function() {
    return fragen;
  }

  this.getAllPersons = function() {

    var temp = JSON.parse(localStorage.getItem(SETTINGS_PERSONS_KEY));

    if (temp == null) return [];
    else return temp;


  }

  this.getPerson = function(value) {
    var temp = JSON.parse(localStorage.getItem(SETTINGS_PERSONS_KEY));

    var found = $filter('filter')(temp, {personName: value}, true);



     if (found != null && found[0] !== undefined) {
        console.log("info: GEBE ZURÜCK:" + found[0]);
         return found[0];

     } else {
         return -1;
     }
  }
  this.deletePerson = function(pIndex) {
    var temp = JSON.parse(localStorage.getItem(SETTINGS_PERSONS_KEY));

    temp.splice(pIndex,1);
    localStorage.setItem(SETTINGS_PERSONS_KEY, JSON.stringify(temp));

    return true;
  }

  this.savePerson = function(array) {
      var temp = [];

      if(this.getPerson(array.personName) != -1) {
        console.log("info: diese person gibt es offenbar schon");
        return -1; //existing
      }
      else {

        console.log("info: person gibt es noch nicht, trage ein " + array.toString());


        temp = JSON.parse(localStorage.getItem(SETTINGS_PERSONS_KEY));

        if(temp == null) temp = [];
        temp.push(array);

        localStorage.setItem(SETTINGS_PERSONS_KEY, JSON.stringify(temp));

        console.log("info: person wurde gespeichert: " + temp.toString());

        return true;
      }
  }

}])
