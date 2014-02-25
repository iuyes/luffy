/**
 * Created by playman on 13-11-18.
 */

function Controll($scope) {

  $scope.apple = {
    name: '苹果', number: 3
  },
      $scope.orange = {
        name: '橘子', number: 2
      }
  $scope.addapple = function () {
    $scope.apple.number = $scope.applenum;
  }
  $scope.addorange = function () {
    $scope.orange.number = $scope.orangenum;
  }
}
