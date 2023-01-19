declare module "react-native-square-reader-sdk" {
	// See documentation at https://github.com/square/react-native-square-reader-sdk/blob/master/docs/reference.md

	/** Authorizes Reader SDK to collect payments. */
	export function authorizeAsync(authCode: string): Promise<Location>
	/** Verifies Reader SDK can be deauthorized. */ // spell-checker:ignore deauthorized
	export function canDeauthorizeAsync(): Promise<boolean> // spell-checker:ignore deauthorize
	/** Deauthorizes Reader SDK. */ // spell-checker:ignore deauthorizes
	export function deauthorizeAsync(): Promise<void>
	/** Returns the currently authorized location. */
	export function getAuthorizedLocationAsync(): Promise<Location>
	/** Verifies Reader SDK is currently authorized for payment collection. */
	export function isAuthorizedAsync(): Promise<boolean>
	/** Verifies Reader SDK is currently authorizing. */
	export function isAuthorizationInProgressAsync(): Promise<boolean>
	/** Begins the checkout workflow. */
	export function startCheckoutAsync(checkoutParams: CheckoutParameter): Promise<CheckoutResult>
	/** Starts the Reader settings flow for connecting Square Reader. */
	export function startReaderSettingsAsync(): Promise<void>
	/** Used to start the store a card for a customer flow. */
	export function startStoreCardAsync(customerId: string): Promise<Card>

	export interface Money {
		/** The amount of money, in the smallest denomination of the indicated currency. */
		amount: number
		/** The type of currency, in ISO 4217 format. For example, the currency code for US dollars is USD. Default: the authorized location's currency code. */
		currencyCode?: string
	}

	export interface Location {
		/** The currency used for all transactions at this location, specified in ISO 4217 format. */
		currencyCode: string
		/** The business name associated with the location. This is the name shown on Square digital receipts. */
		businessName: string
		/** Indicates whether or not this location is activated for card processing. */
		isCardProcessingActivated: boolean
		/** The maximum card payment amount allowed at this location. */
		maximumCardPaymentAmountMoney: Money
		/** The minimum card payment amount allowed at this location. */
		minimumCardPaymentAmountMoney: Money
		/** The nickname of the location as set in the Square Dashboard. */
		name: string
		/** A unique ID for the location assigned by Square */
		locationId: string
	}

	export interface CheckoutParameter {
		/** The total payment amount. */
		amountMoney: Money
		/** Indicates that the digital receipt options screen should not be displayed during checkout. Default: false */
		skipReceipt?: boolean
		/** Indicates that signature collection is required during checkout. When false, the signature screen will never be displayed; when true, it will always be used. Default: false */
		collectSignature?: boolean
		/** Indicates that multiple payment methods are allowed. Default: false */
		allowSplitTender?: boolean
		/** When true, if checkout completes successfully, the SDK will only authorize, but not capture any card payments.
		 * You can then use the Square Connect CaptureTransaction endpoint to capture the card payments at a later time.
		 * Setting delayCapture to true will skip the receipt, tipping, and signature screens, and the following parameters will
		 * 	be ignored: tipSettings, skipReceipt, collectSignature. Default: false.
		 * By default, the SDK will immediately capture all card payments. */
		delayCapture?: boolean
		/** A note to display on digital receipts and in the Square Dashboard. Default: undefined (empty note) */
		note?: string
		/** Settings that configure the tipping behavior of the checkout flow. Default: undefined (Tip screen disabled) */
		tipSettings?: TipSettings
		/** Valid payment methods for checkout (in addition to payments via Square Readers). Default: undefined (No additional payment method) */
		additionalPaymentTypes?: AdditionalPaymentType[]
	}

	export interface CheckoutResult {
		/** The total amount of money collected during the checkout flow. */
		totalMoney: Money
		/** The unique ID of the location to which the transaction was credited. */
		locationId: string
		/** The total tip amount applied across all tenders. */
		totalTipMoney: Money
		/** A unique client-generated ID. */
		transactionClientId: string
		/** The date and time when the transaction was completed as determined by the client device. */
		createdAt: string
		/** The set of tenders associated with a successful transaction. */
		tenders: Tender[]
		/** A unique ID issued by Square. Only set for successful transactions that include one or more card tenders. */
		transactionId: string
	}

	export interface TipSettings {
		/** Indicates whether custom tip amounts are allowed during the checkout flow. Default: false. */
		showCustomTipField?: boolean
		/** Indicates that tip options should be presented on their own screen. Default: false. */
		showSeparateTipScreen?: boolean
		/** A list of up to 3 non-negative integers from 0 to 100 (inclusive) to indicate tip percentages that will be presented during the checkout flow. Default: [15, 20, 25] */
		tipPercentages?: number[]
	}

	export type AdditionalPaymentType = "card" | "cash" | "other"

	export interface Tender {
		/** Details about the tender. Only set for card tenders. */
		cardDetails: CardDetails
		/** Details about the tender. Only set for cash tenders. */
		cashDetails: CashDetails
		/** The date and time when the tender was processed as determined by the client device. */
		createdAt: string
		/** A unique ID issued by Square. Only set for card tenders. */
		tenderId: string
		/** The monetary amount added to this tender as a tip. */
		tipMoney: Money
		/** The total monetary amount of this tender, including tips. */
		totalMoney: Money
		/** The method used to make payment. */
		type: TenderType
	}

	export interface CardDetails {
		/** Indicate how the card information was captured. */
		entryMethod: EntryMethod
		/** Provides information about the card used for payment. */
		card: Card
	}

	export interface Card {
		/** Indicates the entity responsible for issuing the card. */
		brand: CardBrand
		/** The last four digits of the card. */
		lastFourDigits: string
		/** The month when the associated card expires, if available. Expiration month is always an integer between 1 and 12, inclusive. */
		expirationMonth: number
		/** The 4-digit year when the associated card expires, if available. */
		expirationYear: number
		/** The unique, Square-issued identifier for the card. Only set when the object represents a saved card on file. */
		id: string
		/** The cardholder name. This value is present only if this object represents a customer’s card on file. */
		cardholderName: string
	}

	export interface CashDetails {
		/** The total payment amount provided as cash during checkout. */
		buyerTenderMoney: Money
		/** The total change provided as cash during checkout. */
		changeBackMoney: Money
	}

	export type CardBrand =
		| "VISA"
		| "MASTERCARD"
		| "AMERICAN_EXPRESS"
		| "DISCOVER"
		| "DISCOVER_DINERS"
		| "INTERAC" // spell-checker:ignore INTERAC
		| "JCB"
		| "CHINA_UNIONPAY" // spell-checker:ignore UNIONPAY
		| "SQUARE_GIFT_CARD"
		| "EFTPOS" // spell-checker:ignore EFTPOS
		| "OTHER_BRAND"
	export type EntryMethod = "CHIP" | "CONTACTLESS" | "MANUALLY_ENTERED" | "SWIPE" | "UNKNOWN" // spell-checker:ignore CONTACTLESS
	export type TenderType = "card" | "cash" | "other"

	// Error codes
	export const UsageError: string
	export const AuthorizeErrorNoNetwork: string
	export const CheckoutErrorCanceled: string
	export const CheckoutErrorSdkNotAuthorized: string
	export const ReaderSettingsErrorSdkNotAuthorized: string
	export const StoreCustomerCardCancelled: string
	export const StoreCustomerCardInvalidCustomerId: string
	export const StoreCustomerCardSdkNotAuthorized: string
	export const StoreCustomerCardNoNetwork: string

	export interface SquareException {
		debugMessage: string
		message: string
		code?: string
		debugCode?: string
	}
}
