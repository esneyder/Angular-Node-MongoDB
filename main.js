var socket = io.connect( 'http://localhost:80' );

var angularTareas = angular.module('angularTareas', []);

angularTareas.controller('ControladorTareas', function ( $scope, $http ){
	
    $scope.tareas = [];

	$http.get('/all')
		.success(function(data) {
            $scope.tareas = data;

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.crearTarea = function($event){  
        $event.preventDefault();
        if( $scope.nuevaTarea != '' && $scope.nuevaTarea != null ){

            var datos = {tarea : $scope.nuevaTarea, hecho: false};

            $http.post('/new', datos)
                .success(function(data) {
                    $scope.tareas = [];
                    $scope.tareas = data;
                })
                .error(function(data) {
                    console.log('Error:' + data);
                });
        }
        $scope.nuevaTarea = '';
    };

    $scope.changeStatus = function( id ){
        $http.get('/changeStatus/'+id);
    };

    $scope.remove = function( id ){
        $http.get('/remove/'+id);
    };

    socket.on('update', function() {
        $http.get('/all')
        .success(function(data) {
            $scope.tareas = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    });

});



