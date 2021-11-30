const app = angular.module('InventoryApp', []);

app.controller('Controller', ['$http', function($http) {
    console.log('load');
    this.username = null;
    this.password = null;
    // console.log('username', this.username);
    // console.log('password', this.password);

    this.createUser = function() {
        // console.log('func called');
        $http(
            {
                method:'POST',
                url: 'https://inventorial-back.herokuapp.com/api/users',
                data: {
                    username: this.username,
                    password: this.password
                }
            }
        )
        .then(function(response) {
            console.log(response);
        }, function() {
            console.log('error');
        });
    }

    }]
);
