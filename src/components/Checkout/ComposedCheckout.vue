<script setup lang="ts">
import { Checkout } from '@devprotocol/clubs-core/ui/vue'
import {
	TransactionForm,
	type ComposedItem,
} from '@devprotocol/clubs-plugin-payments'
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
		:payload="checkoutProps.source?.payload"
		:itemName="checkoutProps.source?.name"
		:description="checkoutProps.source?.description || 'No description'"
		:itemImageSrc="checkoutProps.source?.imageSrc"
		uiMode="embed"
	>
		<template #after:transaction-form>
			<label
				class="inline-flex cursor-pointer items-center justify-end gap-1 p-3"
			>
				<input
					type="checkbox"
					v-model="isUsingCreditCard"
					class="peer sr-only"
				/>
				<span class="text-sm font-medium text-black/50 dark:text-gray-300"
					>Credit Card</span
				>
				<div
					class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
				></div>
			</label>
		</template>
	</Checkout>
</template>

<style scoped></style>
