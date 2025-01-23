<script setup lang="ts">
import { Checkout } from '@devprotocol/clubs-core/ui/vue'
import { TransactionForm } from '@devprotocol/clubs-plugin-payments/components'
import { loadLibrary } from '@devprotocol/clubs-plugin-payments/utils'
import { computed, onMounted, ref } from 'vue'
import { ComposedCheckoutOptions, Payments } from '../../types.ts'
import { ComposedItem } from '@devprotocol/clubs-plugin-payments'
import { i18nFactory, ProseTextInherit } from '@devprotocol/clubs-core'
import { Strings } from '../../i18n/index.ts'

const props = defineProps<ComposedCheckoutOptions>()

const composedItem: ComposedItem = {
	payload: props.payload ?? '',
	price: props.fiat.price,
	source: props.offering,
}

const i18nBase = i18nFactory(Strings)
const i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(['en']))

const { rpcUrl, chainId, debugMode, fiat } = props

const acceptAllPayments = computed(
	() =>
		props.acceptablePayments.includes(Payments.CreditCard) &&
		props.acceptablePayments.includes(Payments.Crypto),
)

// for the credit card toggle
const isUsingCreditCard = ref(
	acceptAllPayments.value
		? true
		: props.acceptablePayments.includes(Payments.CreditCard),
)

// Payment Gateway
const { PUBLIC_POP_CLIENT_KEY } = import.meta.env

const computedProps = computed(() => {
	if (isUsingCreditCard.value) {
		return {
			...props,
			amount: fiat.price.yen,
			fiatCurrency: '¥',
			useDiscretePaymentFlow: isUsingCreditCard,
			useInjectedTransactionForm: isUsingCreditCard,
			uiMode: 'embed',
		}
	} else {
		return {
			...props,
			fiatCurrency: undefined,
			uiMode: 'embed',
		}
	}
})

onMounted(() => {
	i18n.value = i18nBase(navigator.languages)
	loadLibrary({ clientKey: PUBLIC_POP_CLIENT_KEY })
})
</script>

<template>
	<Checkout v-bind="computedProps">
		<template #before:transaction-form>
			<div v-if="acceptAllPayments" class="w-full text-right">
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
		</template>
		<template #main:transaction-form>
			<TransactionForm
				v-if="isUsingCreditCard"
				:item="composedItem"
				:chainId="chainId"
				:rpcUrl="rpcUrl"
				:debugMode="debugMode"
				:base="props.base"
			/>
		</template>
		<template #after:description>
			<span
				v-html="i18n('Copyrights')"
				:class="ProseTextInherit"
				class="after-description text-xs !text-black/50"
			></span>
		</template>
		<template #after:sign-in-form>
			<div class="my-6 flex flex-col gap-8">
				<p class="text-sm">{{ i18n('SignInRequest') }}</p>
				<a
					href=""
					target="_blank"
					class="hs-link flex w-fit items-center gap-2 text-xs"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="size-4"
					>
						<path
							fill-rule="evenodd"
							d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 .99 1.667c-.459.134-1.033.566-1.033 1.29v.25a.75.75 0 1 0 1.5 0v-.115a2.5 2.5 0 1 0-2.518-4.153.75.75 0 1 0 1.061 1.06Z"
							clip-rule="evenodd"
						/>
					</svg>
					{{ i18n('GuideLink') }}
				</a>
			</div>
		</template>
	</Checkout>
</template>

<style scoped>
.after-description * {
	color: inherit;
	font-size: inherit;
}
</style>
