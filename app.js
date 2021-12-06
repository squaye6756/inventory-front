const app = angular.module('InventoryApp', []);
inventorialStorage = window.sessionStorage;

app.controller('Controller', ['$http', function($http) {
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
    this.minQuanSearch = null;
    this.maxQuanSearch = null;
    this.minPriceSearch = null;
    this.maxPriceSearch = null;
    this.useSearch = false;
    this.searchItemList = null;
    this.haveAcct = true;
    this.authFailure = false;

    this.createUser = () => {
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
            this.authFailure = false;
            if (response.data.username) {
                this.loggedInUser = response.data;
                inventorialStorage.setItem('user', JSON.stringify(this.loggedInUser));
            } else {
                this.authFailure = true;
                document.getElementById('auth-fail').innerHTML = response.data.error;
            }
            this.usernameId = null;
            this.passwordId = null;
        }, () => {
            console.log('error');
        });
    }

    this.toggleAuthForm = (event) => {
        this.haveAcct = !this.haveAcct;
        const authFormBtn = event.currentTarget;
        authFormBtn.innerHTML = authFormBtn.innerHTML === 'Need An Account?' ? 'Already Have An Account?' : 'Need An Account?';
    }

    this.loginWithSavedUser = () => {
        const savedUser = JSON.parse(inventorialStorage.getItem('user'));
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

    const clearSearchForm = () => {
        this.nameSearch = null;
        this.minQuanSearch = null;
        this.minPriceSearch = null;
        this.maxQuanSearch = null;
        this.maxPriceSearch = null;
    }

    this.toggleDisplaySearch = (event) => {
        const searchDiv = document.getElementById('search-div');
        searchDiv.style.display = searchDiv.style.display === 'block' ? 'none' : 'block';
        const displaySearchBtn = event.currentTarget;
        displaySearchBtn.innerHTML = displaySearchBtn.innerHTML === 'Cancel' ? 'Search Items' : 'Cancel';
        clearSearchForm();
    }

    this.search = () => {
        if (this.nameSearch
        || (this.maxPriceSearch || this.maxPriceSearch === 0)
        || (this.minPriceSearch || this.minPriceSearch === 0)
        || (this.maxQuanSearch || this.maxQuanSearch === 0)
        || (this.minQuanSearch || this.minQuanSearch === 0)) {
            this.searchItemList = this.itemList.filter((item) => {
                return (
                    (item.name.includes(this.nameSearch) || !this.nameSearch)
                    && (item.price <= this.maxPriceSearch || !this.maxPriceSearch && this.maxPriceSearch !== 0)
                    && (item.price >= this.minPriceSearch || !this.minPriceSearch && this.minPriceSearch !== 0)
                    && (item.quantity <= this.maxQuanSearch || !this.maxQuanSearch && this.maxQuanSearch !== 0)
                    && (item.quantity >= this.minQuanSearch || !this.minQuanSearch && this.minQuanSearch !== 0)
                );
            });
            clearSearchForm();
            this.useSearch = true;
        }
    }

    this.endSearch = () => {
        clearSearchForm();
        this.useSearch = false;
    }

    this.loginWithSavedUser();
    this.getItemList();

    }]
);
