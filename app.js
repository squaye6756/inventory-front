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
    this.itemList = null;

    this.createUser = () => {
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
        .then((response) => {
            console.log('successful user made', response.data);
        }, () => {
            console.log('error');
        });
    }

    this.login = () => {
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
        .then((response) => {
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
        }, () => {
            console.log('error');
        });
    }

    this.getItemList = () => {
        $http(
            {
                method: 'GET',
                url: 'https://inventorial-back.herokuapp.com/api/items'
            }
        )
        .then((response) => {
            this.itemList = response.data;
            console.log(this.itemList);
        }, error => {
            console.log('error in getItemList', error);
        });
    }

    this.addItem = () => {
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
        .then((response) => {
            console.log('successful item made', response.data);
            this.getItemList();
        }, () => {
            console.log('error');
        });
    }

    // this.deleteItem = function() {
    //
    // }

    this.getItemList();

    }]
);
