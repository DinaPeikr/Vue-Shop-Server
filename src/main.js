import Vue from 'vue';
import App from './App.vue';

import {store} from './store';
import router from './routes';
import { Modal } from 'bootstrap-vue/es/components';

Vue.use(Modal);
new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});

/*
import server from './server';
console.log(server.get('products.php').then((response) => {
	console.log(response.data);
})); 
*/

//когда данные приходят в index.html
// store.dispatch('products/loadItemsFromPreload', {
//     products: window._DATA.products
// });

store.dispatch('cart/load');
//store.dispatch('cart/clearCart');

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'animate.css/animate.min.css'
import './css/style.css'