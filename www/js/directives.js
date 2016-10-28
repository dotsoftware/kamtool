angular.module('app.directives', [])

.directive('err-src', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
})
  
.directive('blankDirective', [function(){

}]);
