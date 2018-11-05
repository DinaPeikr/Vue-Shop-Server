import server from '~/server';

export default {
	namespaced: true,
	state: {
		productsId: [],
		processId: []
	},
	getters: {
		all(state, getters, rootState, rootGetters){
            return state.productsId.map((item, i ) => {
                return rootGetters['products/getId'](item);
            });
		},
		inCart: (state, getters) => (id) => {
			return state.productsId.indexOf(id) !== -1;
		},
        inProcess: (state, getters) => (id) => {
			return state.processId.indexOf(id) !== -1;
		},
		cnt(state, getters){
			return state.productsId.length;
		},
		totals(state, getters, rootState, rootGetters){
			return state.productsId.reduce((total, item) => {
				return total + rootGetters['products/getId'](item).price;
			}, 0);
		},
        canAdd: (state, getters) => (id) => {
            return !getters.inProcess(id) && !getters.inCart(id);
        },
        canRemove: (state, getters) => (id) => {
            return !getters.inProcess(id) && getters.inCart(id);
        }
	},
	mutations: {
		add(state, data){
			state.productsId.push(data.id);
		},
		remove(state, data){
			let ind = state.productsId.indexOf(data.id);
			state.productsId.splice(ind, 1);
		},
        addToProcess(state, data){
            state.processId.push(data.id);
        },
        removeFromProcess(state, data){
            let ind = state.processId.indexOf(data.id);
            state.processId.splice(ind, 1);
        },
        load(state, products){
            state.productsId = products.map(i => String(i));
        },
        clearCart(state){
            state.productsId = [];
        }
	},
	actions: {
		add(store, data){
			return new Promise((resolve, reject) => {
                if(store.getters.canAdd(data.id)){
                    store.commit('addToProcess', data);

                    server.get('cart.php', {
                    	params: {
                            action: 'add',
                            id: data.id
						}
					}).then((response) => {
						if (response.data === true) {
                            store.commit('add', data);
                            store.commit('removeFromProcess', data);
                            resolve();
						}
                    });
                } else {
                	reject();
				}
			});
		},
		remove(store, data){
            return new Promise((resolve, reject) => {
                if(store.getters.canRemove(data.id)){
                    store.commit('addToProcess', data);

                    server.get('cart.php', {
                        params: {
                            action: 'delete',
                            id: data.id
                        }
                    }).then((response) => {
                        if (response.data === true) {
                            store.commit('remove', data);
                            store.commit('removeFromProcess', data);
                            resolve();
                        }
                    });
                } else {
                	reject();
				}
			});
		},
        load(store){
            server.get('cart.php', {
                params: {
                    action: 'all'
                }
            }).then((response) => {
                store.commit('load', response.data);
            });
        },
        clearCart(store){
            server.get('cart.php', {
                params: {
                    action: 'all'
                }
            }).then((response) => {
                store.commit('clearCart', response.data);
            });
        }
	}
};