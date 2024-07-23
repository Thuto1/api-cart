
// const cart_code = '...';
// const url = `https://pizza-api.projectcodex.net/api/pizzas`;

// axios.get(url).then((result) => {
//     const pizzas = result.data.pizzas;
    
//     // this.pizzas is declared on you AlpineJS Widget.
//     this.pizzas = pizzas;
// })

// axios.post(url, { data : 'here' }).then((result) => {
//     const pizzas = result.data.pizzas;
    
//     // this.pizzas is declared on you AlpineJS Widget.
//     this.pizzas = pizzas;
// })



// Alpine.data('pizzaCartWithAPIWidget', function() {
//   return {
//     init() {
//         // call the api to load data into the screen here
//     }
//   }
// })

document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCart', function() {
    return { 
      title : 'Pizza Cart API',
      pizzas : [],
      username : '',
      cartId :'',
      cartPizzas : [],
      cartTotal : '',
      paymentAmount : '',
      message : '',
      showThankYouMessage : false,
      previousCarts : [],


      login () {
        if (this.username.length > 2) {
          localStorage['username'] = this.username;
          this.createCart ();
          // here is the showing message function
          this.showThankYouMessage = true;
          setTimeout(() => {
              this.showThankYouMessage = false;
          }, 3000);

          // 


          // now we are showing previous cart function 

          this.showPreviousCarts();

          // 

        } else {
          alert ('Username is too short');
        }
      },


      // here is the saveCart and also the previousCart funtion


      saveCart() {
        let previousCarts = JSON.parse(localStorage.getItem('previousCarts') || '[]');
        previousCarts.push({ id: this.cartId, username: this.username });
        localStorage.setItem('previousCarts', JSON.stringify(previousCarts));
      },

      showPreviousCarts() {
          this.previousCarts = JSON.parse(localStorage.getItem('previousCarts') || '[]');
      },


      // 




      logout () {
        if (confirm ('Do you want to leave our site?')) {
          this.username = '';
          this.cartId = '';
          localStorage['cartId'] = '';
          localStorage['username'] = '';
          localStorage.removeItem ('username');
        }
      },

      createCart () {
        if (!this.username) {
          this.cartId = 'No username to create a cart for'
          return Promise.resolve();
        }

        const cartId= localStorage['cartId'];
        if (cartId) {
          this.cartId = cartId;
          return Promise.resolve();
        } else {
          const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`

          return axios.get(createCartURL)
                        .then(result => {
                          this.cartId = result.data.cart_code;
                          localStorage['cartId'] = this.cartId;
                        });
        }

       
      },


      getCart() {
        const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
        return axios.get(getCartURL);
      },
      addPizza (pizzaId) {
          return axios.post (`https://pizza-api.projectcodex.net/api/pizza-cart/add`, {
            "cart_code" : this.cartId,
            "pizza_id" : pizzaId
          })
      },
      removePizza (pizzaId) {
        return axios.post (`https://pizza-api.projectcodex.net/api/pizza-cart/remove`, {
          "cart_code" : this.cartId,
          "pizza_id" : pizzaId
        })
      },

      pay(amount) {
        return axios.post (`https://pizza-api.projectcodex.net/api/pizza-cart/pay`,
      
            {
              "cart_code" : this.cartId,
              amount
            })
      },


      showCartData () {
        this.getCart().then(result => {
          const cartData = result.data;
          this.cartPizzas = cartData.pizzas;
          this.cartTotal = cartData.total.toFixed(2);
          // alert(this.cartTotal);
        });
      },
      
      init() {

        const storedUsername = localStorage['username'];
        if (storedUsername) {
          this.username = storedUsername;
        }

        axios
          .get('https://pizza-api.projectcodex.net/api/pizzas')
          .then(result => {
            //console.log(result.data);
            this.pizzas = result.data.pizzas
          });

        if (!this.cartId) {
          this 
              .createCart ()
              .then(() => {
                this.showCartData();
              })
        }

        
      },
      addPizzaToCart(pizzaId) {
        this
            .addPizza(pizzaId)
            .then(() =>{
              this.showCartData();
            })
      },
      removePizzaFromCart (pizzaId) {
        this
            .removePizza(pizzaId)
            .then(() =>{
              this.showCartData();
            })
      },

      payToCart () {

        this
          .pay(this.paymentAmount)
          .then(result => {
            if (result.data.status == 'failure') {
              this.message = result.data.message;
              setTimeout (() => this.message = '', 3000);
            } else {
              this.message = 'Payment went well';
              setTimeout (() => {
                this.message = '';
                this.cartPizzas = [];
                this.cartTotal = 0.00
                // this.cartId = '';
                // this.username = '';
                localStorage['cartId'] = '';              
                this.createCart();
                this.paymentAmount = 0.00
              }, 3000);
            }
          })
      },
    
    }
  });
});


// functioning of buttons

// function pizzaCart() {
//   return {
//     cart: [],
//     showMessage: false,
//     message: '',
//     addToCart(flavour, name, price, quantity, total) {
//       let found = false;
//       this.cart.forEach(item => {
//         if (item.name === name) {
//           item.quantity++;
//           found = true;
//         }
//       });
//       if (!found) {
//         this.cart.push({ flavour, name, price, quantity: 1 });
//       }
//     },
//   }
// }