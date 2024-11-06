<script setup lang="ts">
import { Checkout } from '@devprotocol/clubs-core/ui/vue'
import { TransactionForm } from '@devprotocol/clubs-plugin-payments'
import {loadLibrary} from '@devprotocol/clubs-plugin-payments/utils'
import { onMounted, ref } from 'vue'

const props = defineProps<{
	checkoutProps: {
		payload: string
		props: {
			passportItem: {
				id: string
				sTokenId: string
				sTokenPayload: string
				clubsUrl: string
				itemAssetType: string
				itemAssetValue: string
			}
			amount: number
			propertyAddress: string
			currency: string
			fiatCurrency: string
			rpcUrl: string
			payload: string
			description: string
			itemImageSrc: string
			itemName: string
			feePercentage: number
			feeBeneficiary: string
			accessControlUrl: string
			accessControlDescription: string
			fiatAmount: number
			chainId: number
		}
	}
}>()

// for the credit card toggle
const isUsingCreditCard = ref(true)

// Payment Gateway
const { PUBLIC_POP_CLIENT_KEY } = import.meta.env

onMounted(()=>{
	loadLibrary({clientKey: PUBLIC_POP_CLIENT_KEY})
})
</script>

<template>
	<Checkout
		v-bind="checkoutProps.props"
		:useDiscretePaymentFlow="isUsingCreditCard"
		:useInjectedTransactionForm="isUsingCreditCard"
		uiMode="embed"
	>
		<template #after:transaction-form>
			<div>
				<div class="w-full text-right">
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
				</div>
				<TransactionForm
					v-if="isUsingCreditCard"
					:item="checkoutProps.props.passportItem"
					:chainId="checkoutProps.props.chainId"
					:rpcUrl="checkoutProps.props.rpcUrl"
					:debugMode="true"
				/>
			</div>
		</template>
	</Checkout>
</template>

<style scoped></style>
