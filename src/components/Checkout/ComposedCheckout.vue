<script setup lang="ts">
import {Checkout} from '@devprotocol/clubs-core/ui/vue'
import {TransactionForm, type ComposedItem} from '@devprotocol/clubs-plugin-payments'
import { ref } from 'vue'
import type { PassportItemDocument, TokenURIWithId } from '../../types.ts'

interface Props {
	checkoutProps: ComposedItem & PassportItemDocument
}

const { checkoutProps } = defineProps<Props>()

//
const isUsingCreditCard = ref(false)
</script>

<template>
	<Checkout
		:amount="checkoutProps.source?.price || 100"
		:currency="checkoutProps.source?.currency || 'ETH'"
		:propertyAddress="checkoutProps.source?.id"
		rpcUrl="https://polygon-rpc.com"
		:payload='checkoutProps.source?.payload'
		:itemName="checkoutProps.source?.name"
		:description="checkoutProps.source?.description || 'No description'"
		:itemImageSrc="checkoutProps.source?.imageSrc"
		uiMode="embed"
	>
		<template #after:transaction-form>
			<label class="inline-flex items-center justify-end gap-1 p-3 cursor-pointer">
				<input type="checkbox" v-model="isUsingCreditCard" class="sr-only peer">
				<span class="text-sm font-medium text-black/50 dark:text-gray-300">Credit Card</span>
				<div class="relative w-11 h-6 bg-gray-200 rounded-full
				peer peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
				peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white
				after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
				dark:bg-gray-700 dark:border-gray-600
				peer-checked:bg-blue-600"></div>
			</label>
		</template>
	</Checkout>
</template>

<style scoped>

</style>
