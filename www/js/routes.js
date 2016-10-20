angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('menu.todos', {
    url: '/page_todos',
    views: {
      'menuContent': {
        templateUrl: 'templates/todos.html',
        controller: 'todosCtrl'
      }
    }
  })

  .state('menu.transakationsanalyse', {
    url: '/page_transaktionsanalyse',
    views: {
      'menuContent': {
        templateUrl: 'templates/transakationsanalyse.html',
        controller: 'transaktionsanalyseCtrl'
      }
    }
  })

  .state('menu.detailedPerson', {
    url: '/page_detailed_person/:personName',

    views: {
      'menuContent': {
        templateUrl: 'templates/detailedPersonAnalysis.html',
        controller: 'detailedPersonController'
      }
    }
  })

  .state('menu.globaleNachrichten', {
    url: '/page_news',
    views: {
      'menuContent': {
        templateUrl: 'templates/globaleNachrichten.html',
        controller: 'globaleNachrichtenCtrl'
      }
    }
  })

  .state('menu', {
    url: '/menuContent',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('menu.lPK', {
    url: '/page_lpk',
    views: {
      'menuContent': {
        templateUrl: 'templates/lpk.html',
        controller: 'lPKCtrl'
      }
    }
  })

  .state('kAMToolsAnmeldung', {
    url: '/page_login',
    templateUrl: 'templates/kAMToolsAnmeldung.html',
    controller: 'kAMToolsAnmeldungCtrl'
  })

  .state('register', {
    url: '/page_register',
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'
  })

  .state('neuePersonBewerten', {
    url: '/page_add_transaction',
    templateUrl: 'templates/neuePersonBewerten.html',
    controller: 'neuePersonBewertenCtrl'
  })

  .state('menu.meineDienststellen', {
    url: '/page_my_departments',
    views: {
      'menuContent': {
        templateUrl: 'templates/meineDienststellen.html',
        controller: 'meineDienststellenCtrl'
      }
    }
  })

  .state('dienststelleAnlegen', {
    url: '/page_add_department',
    templateUrl: 'templates/neueDienststelle.html',
    controller: 'dienststelleAnlegenCtrl'
  })

  .state('detailedDepartment', {
    url: '/page_detailed_department/:departmentName',
    templateUrl: 'templates/detailedDepartment.html',
    controller: 'detailedDepartmentCtrl'
  })

  .state('newTodo', {
    url: '/page_add_todo',
    templateUrl: 'templates/newTodo.html',
    controller: 'newTodoCtrl'
  })

$urlRouterProvider.otherwise('/page_login')



});
