const app = angular.module('InventoryApp', []);
inventorialStorage = window.sessionStorage;

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
    this.nameEdit = null;
    this.quantityEdit = null;
    this.priceEdit = null;
    this.nameSearch = null;
    this.quantitySearch = null;
    this.priceSearch = null;
    this.useSearch = false;
    this.searchItemList = null;

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
            // console.log('successful user made', response.data);
            this.loggedInUser = response.data;
            this.username = null;
            this.password = null;
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
                // console.log(response.data);
                this.loggedInUser = response.data;
                // console.log('successful login', response.data);
                // console.log(this.loggedInUser);
                inventorialStorage.setItem('user', JSON.stringify(this.loggedInUser));
            } else {
                console.log('unsuccessful login', response.data.error);
            }
            this.usernameId = null;
            this.passwordId = null;
        }, () => {
            console.log('error');
        });
    }

    this.loginWithSavedUser = () => {
        const savedUser = JSON.parse(inventorialStorage.getItem('user'));
        // console.log(savedUser);
        this.loggedInUser = savedUser;
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
            // console.log(this.itemList);
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
                    quantity: this.quantity
                }
            }
        )
        .then((response) => {
            // console.log('successful item made', response.data);
            this.getItemList();
            this.name = null;
            this.quantity = null;
            this.price = null;
        }, () => {
            console.log('error');
        });
    }

    this.deleteItem = (id) => {
        $http(
            {
                method: 'DELETE',
                url: `https://inventorial-back.herokuapp.com/api/items/${id}`
            }
        )
        .then((response) => {
            this.getItemList();
        });
    }

    this.incrementQuantity = (item) => {
        $http(
            {
                method: 'PUT',
                url: `https://inventorial-back.herokuapp.com/api/items/${item.id}`,
                data: {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity + 1
                }
            }
        )
        .then((response) => {
            this.getItemList();
        });
    }

    this.decrementQuantity = (item) => {
        $http(
            {
                method: 'PUT',
                url: `https://inventorial-back.herokuapp.com/api/items/${item.id}`,
                data: {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity - 1
                }
            }
        )
        .then((response) => {
            this.getItemList();
        });
    }

    this.handlePut = (item) => {
        $http(
            {
                method: 'PUT',
                url: `https://inventorial-back.herokuapp.com/api/items/${item.id}`,
                data: {
                    name: this.nameEdit || item.name,
                    price: this.priceEdit || item.price,
                    quantity: this.quantityEdit || item.quantity
                }
            }
        )
        .then((response) => {
            this.getItemList();
            this.nameEdit = null;
            this.quantityEdit = null;
            this.priceEdit = null;
        });
    }

    this.logout = () => {
        this.loggedInUser = null;
        inventorialStorage.removeItem('user');
    }

    this.toggleDisplayAdd = (event) => {
        const addDiv = document.getElementById('add-item-div');
        addDiv.style.display = addDiv.style.display === 'block' ? 'none' : 'block';
        const displayAddBtn = event.currentTarget;
        displayAddBtn.innerHTML = displayAddBtn.innerHTML === 'Cancel' ? 'Add Item' : 'Cancel';
    }

    this.toggleDisplayItems = (event) => {
        const itemIndex = document.getElementById('all-items');
        itemIndex.style.display = itemIndex.style.display === 'none' ? 'block' : 'none';
        const displayItemBtn = event.currentTarget;
        displayItemBtn.innerHTML = displayItemBtn.innerHTML === 'Show All Items' ? 'Hide All Items' : 'Show All Items';
    }

    this.toggleDisplaySearch = (event) => {
        const searchDiv = document.getElementById('search-div');
        searchDiv.style.display = searchDiv.style.display === 'block' ? 'none' : 'block';
        const displaySearchBtn = event.currentTarget;
        displaySearchBtn.innerHTML = displaySearchBtn.innerHTML === 'Cancel' ? 'Search Items' : 'Cancel';
    }

    this.search = () => {
        // console.log(this.itemList);
        // for (const item of this.itemList) {
        //     if (!(item.name.includes(this.nameSearch))) {
        //         console.log('failed name search');
        //     }
        //     if (!(item.price <= this.priceSearch)) {
        //         console.log('failed price search');
        //         console.log('price searched', this.priceSearch);
        //         console.log('price of item', item.price);
        //     }
        //     if (!(item.quantity >= this.quantitySearch)) {
        //         console.log('failed quantity search');
        //         console.log('quantity searched', this.quantitySearch);
        //         console.log('quantity of item', item.quantity);
        //     }
        // }
        this.searchItemList = this.itemList.filter((item) => {
            return (
                (item.name.includes(this.nameSearch) || !this.nameSearch)
                && (item.price <= this.priceSearch || !this.priceSearch)
                && (item.quantity >= this.quantitySearch || !this.quantitySearch)
            );
        });
        this.nameSearch = null;
        this.quantitySearch = null;
        this.priceSearch = null;
        this.useSearch = true;
        // console.log('result', this.searchItemList);
    }

    this.endSearch = () => {
        this.useSearch = false;
    }

    this.loginWithSavedUser();
    this.getItemList();

    }]
);
