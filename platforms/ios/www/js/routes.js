angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('menu.todos', {
    url: '/page_todos',
    cache: false,
    views: {
      'menu': {
        templateUrl: 'templates/todos.html',
        controller: 'todosCtrl'
      }
    }
  })

  .state('menu.newTodo', {
    cache: false,
    url: '/page_add_todo',
    views: {
      'menu': {
      templateUrl: 'templates/newTodo.html',
      controller: 'newTodoCtrl'
    }
  }
  })

  .state('menu.dashboard', {
  url: '/page_dashboard',
  views: {
    'menu': {
      templateUrl: 'templates/dashboard.html',
      controller: 'dashboardCtrl'
    }
    }
  })

  .state('menu.editprofile', {
  url: '/page_editprofile',
  views: {
    'menu': {
      templateUrl: 'templates/editprofile.html',
      controller: 'editprofileCtrl'
    }
  }
})

  .state('menu.transakationsanalyse', {
    url: '/page_transaktionsanalyse',
    views: {
      'menu': {
        templateUrl: 'templates/transakationsanalyse.html',
        controller: 'transaktionsanalyseCtrl'
      }
    }
  })

  .state('menu.detailedPerson', {
    url: '/page_detailed_person/:personName',

    views: {
      'menu': {
        templateUrl: 'templates/detailedPersonAnalysis.html',
        controller: 'detailedPersonController'
      }
    }
  })

  .state('menu.transactionHelp', {
    url: '/page_transactionHelp/:help',

    views: {
      'menu': {
        templateUrl: 'templates/transactionHelp.html'/*,
        controller: 'detailedPersonController'*/
      }
    }
  })

  .state('menu.chatMessages', {
    url: '/page_news',
    cache: false,
    views: {
      'menu': {
        templateUrl: 'templates/chatMessages.html',
        controller: 'chatCtrl'
      }
    }
  })

  .state('menu', {
    url: '/menu',
    cache: false,
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('menu.lPK', {
    url: '/page_lpk',
    views: {
      'menu': {
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
    cache: false,
    templateUrl: 'templates/neuePersonBewerten.html',
    controller: 'neuePersonBewertenCtrl'
  })

  .state('menu.protocols', {
    url: '/page_protocols',
    views: {
      'menu': {
        templateUrl: 'templates/protocols.html',
        controller: 'protocolsCtrl'
      }
    }
  })

  .state('menu.addProtocol', {
    url: '/add_protocol',
    views: {
      'menu': {
      templateUrl: 'templates/addProtocol.html',
      controller: 'addProtocolCtrl'
      }
    }
  })

  .state('detailedDepartment', {
    url: '/page_detailed_department/:departmentName',
    templateUrl: 'templates/detailedDepartment.html',
    controller: 'detailedDepartmentCtrl'
  })



$urlRouterProvider.otherwise('/page_login')



});
