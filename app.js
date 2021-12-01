const app = angular.module('InventoryApp', []);

app.controller('Controller', ['$http', function($http) {
    // console.log('load');
    this.username = null;
    this.password = null;
    this.usernameId = null;
    this.passwordId = null;
    this.name = null;
    this.quantity = null;
    this.price = null;
    this.loggedInUser = null;

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

    this.login = function() {
        $http(
            {
                method:'PUT',
                url: 'https://inventorial-back.herokuapp.com/api/users/login',
                data: {
                    username: this.usernameId,
                    password: this.passwordId
                }
            }
        )
        .then(function(response) {
            if (response.data.username) {
                console.log(response.data);
                this.loggedInUser = response.data;
                console.log('successful login', response.data);
                console.log(this.loggedInUser);
            } else {
                this.usernameId = null;
                this.passwordId = null;
                console.log('unsuccessful login', response.data.error);
            }
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
