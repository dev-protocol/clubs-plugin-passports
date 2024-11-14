<script setup lang="ts">
import { Checkout } from '@devprotocol/clubs-core/ui/vue'
import { TransactionForm } from '@devprotocol/clubs-plugin-payments/components'
import { loadLibrary } from '@devprotocol/clubs-plugin-payments/utils'
import { computed, onMounted, ref } from 'vue'
import { ClubsConfiguration } from '@devprotocol/clubs-core'
import { ComposedCheckoutOptions } from '../../types.ts'

const props = defineProps({
	checkoutProps: Object,
})

const {
	amount,
	propertyAddress,
	fiatCurrency,
	rpcUrl,
	payload,
	description,
	itemImageSrc,
	itemName,
	accessControlUrl,
	accessControlDescription,
	chainId,
	passportItem,
} = props.checkoutProps as ComposedCheckoutOptions & {
	passportItem: ClubsConfiguration
} & Pick<ClubsConfiguration, 'chainId'>

// for the credit card toggle
const isUsingCreditCard = ref(true)

// Payment Gateway
const { PUBLIC_POP_CLIENT_KEY } = import.meta.env

const computedProps = computed(() => {
	if (isUsingCreditCard.value) {
		return {
			amount,
			propertyAddress,
			fiatCurrency,
			rpcUrl,
			payload,
			description,
			itemImageSrc,
			itemName,
			accessControlUrl,
			accessControlDescription,
			useDiscretePaymentFlow: isUsingCreditCard,
			useInjectedTransactionForm: isUsingCreditCard,
			uiMode: 'embed',
		}
	} else {
		return {
			amount,
			propertyAddress,
			rpcUrl,
			payload,
			description,
			itemImageSrc,
			itemName,
			accessControlUrl,
			accessControlDescription,
			uiMode: 'embed',
		}
	}
})

onMounted(() => {
	loadLibrary({ clientKey: PUBLIC_POP_CLIENT_KEY })
})
</script>

<template>
	<Checkout v-bind="computedProps">
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
					:item="passportItem"
					:chainId="chainId"
					:rpcUrl="rpcUrl"
					:debugMode="true"
				/>
			</div>
		</template>
	</Checkout>
</template>

<style scoped></style>
