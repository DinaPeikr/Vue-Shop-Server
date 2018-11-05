import server from '~/server';

export default {
	namespaced: true,
	state: {
		products: {}
	},
	getters: {
		all(state){
			return state.products;
		},
		getId: (state, getters) => (id) => {
			return state.products[id];
		},
        has: (state, getters) => (id) => {
            return id in state.products;
        }
	},
	mutations: {
        setItems(state, products){
             state.products = products;
        }
	},
	actions: {
        loadItems(store){
            return new Promise((resolve, reject) => {
                server.get('products.php').then((response) => {
                    store.commit('setItems', response.data);
                    resolve();
                });
            });
        },
        // loadItemsFromPreload(store, data){
        //     store.commit('setItems', data.products);
        // }
	}
};
