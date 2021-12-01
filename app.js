const app = angular.module('InventoryApp', []);

app.controller('Controller', ['$http', function($http) {
    console.log('load');
    this.username = null;
    this.password = null;
    this.name = null;
    this.quantity = null;
    this.price = null;

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
            console.log('successful user made', response.data);
        }, function() {
            console.log('error');
        });
    }

    this.addItem = function() {
        $http(
            {
                method: 'POST',
                url: 'https://inventorial-back.herokuapp.com/api/items',
                data: {
                    name: this.name,
                    price: this.price,
                    quantity: this.quantity,
                }
            }
        )
        .then(function(response) {
            console.log('successful item made', response.data);
        }, function() {
            console.log('error');
        });
    }

    }]
);
