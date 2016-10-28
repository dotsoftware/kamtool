// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','firebase','chart.js', 'jett.ionic.filter.bar','angularMoment'])




.config(function($ionicConfigProvider){
  var config = {
    apiKey: "AIzaSyBvWBaF-GBhNnpRnr3I5ekDzTez5ljy4dU",
    authDomain: "kamtools-4f9c8.firebaseapp.com",
    databaseURL: "https://kamtools-4f9c8.firebaseio.com",
    storageBucket: "kamtools-4f9c8.appspot.com",
    messagingSenderId: "127255670710"
  };
  firebase.initializeApp(config);

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
