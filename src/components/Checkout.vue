<template>
	<div>
		<!--<div>{{cartAll}}</div>-->

		<h3 class="mb-3">Order Now</h3>
		<transition enter-active-class="animated zoomIn"
					leave-active-class="animated zoomOut"
					mode="out-in"
					appear>
		<form v-if="!isDone" @submit.prevent="onSubmit" key="form">
			<app-input v-for="(field, i) in this.orderInfo"
					   :name="field.name"
					   :value="field.value.trim()"
					   :pattern="field.pattern"
					   :errormessage="field.errorMessage"
					   :key="i"
					   @changed="onChanged(i, $event)"
					   @validate="onValidate(i, $event)"
			></app-input>
			<button class="btn btn-success"
					:disabled="!formReady">
				<span v-if="isSending"><v-icon name="spinner" pulse class="loader"/>Sending...</span>
				<span v-else>Order Now!</span>
			</button>
		</form>
		<div v-else class="alert output w-50" key="output">
			Thank you for buying!
		</div>
		</transition>
	</div>
</template>

<script>
    import AppInput from './Input';
    import {mapGetters, mapActions} from 'vuex';
    import Icon from 'vue-awesome/components/Icon'
    import 'vue-awesome/icons/spinner'

    export default {
        components: {
            AppInput,
            'v-icon': Icon
        },
        created() {
            this.controls = this.orderInfo.map(function (item, i) {
                return {
                    valid: false
                }
            });
        },
        data(){
            return {
                controls: []
            }

        },
        computed: {
            ...mapGetters('checkout', {
                isSending: 'formSending',
                isDone: 'formDone',
                orderInfo: 'orderInfo',
                cartAll: 'cartAll'
            }),
            fieldsDone() {
                return this.controls.reduce((total, item) => {
                    let valid = item.valid;
                    return total + (valid ? 1 : 0);
                }, 0);
            },
            formReady() {
                return this.fieldsDone === this.controls.length;
            }
        },
        methods: {
            ...mapActions('cart', {
                clearCart: 'clearCart'
            }),
			...mapActions('checkout', {
                onSubmiting: 'orders'
            }),
            onChanged(i, e) {
                this.$store.commit('checkout/changedValue', {
                    i: i,
                    value: e.value
                });
            },
            onValidate(ind, e) {
                let control = this.controls[ind];

                control.valid = e.valid;
            },
			onSubmit(){
                this.onSubmiting().then(
					(res) => {
                        console.log('submited');
                       this.clearCart();
                    },
					(error) => {
                        console.log('not submited');
					},
				);
			}
        }
    }
</script>

<style scoped>
	.loader{
		margin-right: 10px;
	}
	.output{
		text-align: center;
		font-size: 2rem;
		padding-top: 50px;
		padding-bottom: 50px;
		margin: 50px auto;
		background: aliceblue;
		color: #007bff;
		border-radius: 10px;
	}
</style>