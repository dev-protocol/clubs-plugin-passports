<script setup lang="ts">
import {Checkout} from '@devprotocol/clubs-core/ui/vue'
import {TransactionForm, type ComposedItem} from '@devprotocol/clubs-plugin-payments'
import { ref } from 'vue'

const isUsingCreditCard = ref(false)

</script>

<template>
	<Checkout>
		<TransactionForm v-if="isUsingCreditCard" slot="main:transaction-form" />
		<button
			@click="isUsingCreditCard = true"
			slot="after:transaction-form"
		>Credit Card</button>
	</Checkout>
</template>

<style scoped>

</style>
