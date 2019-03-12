# React Native Reader SDK Technical Reference

This technical reference documents methods available in the React Native
wrapper for Reader SDK. For detailed documentation on Reader SDK, please see
[docs.connect.squareup.com].

---

* [Methods at a glance](#methods-at-a-glance)
* [Method details](#method-details)
* [Objects](#objects)
* [Constants](#constants)
* [Errors](#errors)

---



## Methods at a glance

Method                                                    | Return Object                       | Description
--------------------------------------------------------- | --------------------------------- | ---
[authorizeAsync](#authorizeasync)                         | [Location](#location)             | Authorizes Reader SDK to collect payments.
[canDeauthorizeAsync](#candeauthorizeasync)               | boolean                           | Verifies Reader SDK can be deauthorized.
[deauthorizeAsync](#deauthorizeasync)                     | void                              | Deauthorizes Reader SDK.
[getAuthorizedLocationAsync](#getauthorizedlocationasync) | [Location](#location)             | Returns the currently authorized location
[isAuthorizedAsync](#isauthorizedasync)                   | boolean                           | Verifies Reader SDK is currently authorized for payment collection.
[startCheckoutAsync](#startcheckoutasync)                 | [CheckoutResult](#checkoutresult) | Begins the checkout workflow.
[startReaderSettingsAsync](#startreadersettingsasync)     | void                              | Starts the Reader settings flow for connecting Square Reader



## Method details

### authorizeAsync

Used to authorize [Reader SDK] to collect payments on behalf of a Square
location.

Parameter | Type   | Description
--------- | ------ | -----------
authCode  | string | Authorization code from the [Mobile Authorization API]

* **On success**: returns information about the currently authorized location as a
  [Location](#location) object.
* **On failure**: throws [`USAGE_ERROR`](#e1) or [`AUTHORIZE_NO_NETWORK`](#e2).

#### Example usage

```javascript
import {
  authorizeAsync,
  AuthorizeErrorNoNetwork,
  UsageError,
} from 'react-native-square-reader-sdk';
...
try {
  const authorizedLocation = await authorizeAsync(authCode);
  // Authorized and authorizedLocation is available
} catch(ex) {
  switch(ex.code) {
    case AuthorizeErrorNoNetwork:
      // Remind connecting to network
      break;
    case UsageError:
      let errorMessage = ex.message;
      if (__DEV__) {
        errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
        console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
      }
      Alert.alert('Error', errorMessage);
      break;
  }
}
```


---

### canDeauthorizeAsync

Used to determine if it is safe to deauthorize Reader SDK.

* **On success**: returns `true` if all transactions have successfully synced to
  Square, `false` otherwise.
* **On failure**: throws [`USAGE_ERROR`](#e1).

#### Example usage

```javascript
import { canDeauthorizeAsync } from 'react-native-square-reader-sdk';
...
if (await canDeauthorizeAsync()) {

  // Handle deauthorization

} else {
  Alert.alert('Unable to deauthorize', 'You cannot deauthorize right now.');
}
```


---

### deauthorizeAsync

Used to deauthorize [Reader SDK]. Reader SDK cannot be deauthorized if there
are transactions that have not been synced to Square.

* **On success**: returns nothing.
* **On failure**: throws [`USAGE_ERROR`](#e1) or [`AUTHORIZE_NO_NETWORK`](#e2).

#### Example usage

```javascript
import { deauthorizeAsync } from 'react-native-square-reader-sdk';
...
try {
  await deauthorizeAsync();
  // Deauthorize finished successfully
} catch(ex) {
  let errorMessage = ex.message;
  if (__DEV__) {
    errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
    console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
  }
  Alert.alert('Error', errorMessage);
}
```


---

### getAuthorizedLocationAsync

Used to fetch information about the location currently authorized for Reader
SDK.

* **On success**: returns information about the currently authorized location as a
  [Location](#location) object.
* **On failure**: throws [`USAGE_ERROR`](#e1).

#### Example usage

```javascript
import { getAuthorizedLocationAsync } from 'react-native-square-reader-sdk';
...

try {
  const authorizedLocation = await getAuthorizedLocationAsync();
  // Start using the location object
} catch (ex) {
  let errorMessage = ex.message;
  if (__DEV__) {
    errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
    console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
  }
  Alert.alert('Error', errorMessage);
}
```


---

### isAuthorizedAsync

Used to determine if Reader SDK is currently authorized to accept payments.

* **On success**: returns `true` if the authorization flow was completed with a
  valid [Mobile Authorization API] token, `false` otherwise.
* **On failure**: throws [`USAGE_ERROR`](#e1).


#### Example usage

```javascript
import { isAuthorizedAsync } from 'react-native-square-reader-sdk';
...
if (await isAuthorizedAsync()) {

  // Ready to take payments

} else {
  Alert.alert('Unable to take payments', 'Reader SDK is not authorized.');
}
```


---

### startCheckoutAsync

Used to start the checkout flow and collect payment information from Square
Reader. Checkout cannot be started from a modal screen.

Parameter      | Type                                    | Description
-------------- | --------------------------------------- | -----------
checkoutParams | [CheckoutParameter](#checkoutparameter) | Configures the checkout flow and transaction amount.

* **On success**: returns information about the checkout result as a
  [CheckoutResult](#checkoutresult) object.
* **On failure**: throws [`USAGE_ERROR`](#e1), [`CHECKOUT_CANCELED`](#e3), or
  [`CHECKOUT_SDK_NOT_AUTHORIZED`](#e4)


#### Example usage

```javascript
import {
  startCheckoutAsync,
  CheckoutErrorCancelled,
  CheckoutErrorSdkNotAuthorized,
  UsageError,
} from 'react-native-square-reader-sdk';
...
try {
  const checkoutResult = await startCheckoutAsync(checkoutParams);
  // checkout finished successfully and checkoutResult is available
} catch(ex) {
  switch(ex.code) {
    case CheckoutErrorCanceled:
      // Handle canceled transaction here
      break;
    case CheckoutErrorSdkNotAuthorized:
      // Handle sdk not authorized
      break;
    default:
      let errorMessage = ex.message;
      if (__DEV__) {
        errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
        console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
      }
      Alert.alert('Error', errorMessage);
      break;
  }
}
```


---

### startReaderSettingsAsync

Used to start the Reader settings flow. Returns an error if Reader SDK is not
currently authorized.

* **On success**: returns nothing.
* **On failure**: throws [`USAGE_ERROR`](#e1) or
  [`READER_SETTINGS_SDK_NOT_AUTHORIZED`](#e5)

#### Example usage

```javascript
import {
  startReaderSettingsAsync,
  ReaderSettingsErrorSdkNotAuthorized,
  UsageError,
} from 'react-native-square-reader-sdk';
...
try {
  await startReaderSettingsAsync();
} catch (ex) {
  switch(ex.code) {
    case ReaderSettingsErrorSdkNotAuthorized:
      // Handle reader settings not authorized
      break;
    case UsageError:
      let errorMessage = ex.message;
      if (__DEV__) {
        errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
        console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
      }
      Alert.alert('Error', errorMessage);
      break;
  }
}
```


---

### startStoreCardAsync

Used to start the store a card for a customer flow.

The card information is stored on Square servers, not on the specific device running Reader SDK. This means cards cannot be saved on file when offline, and that saved cards for a customer are available from any device, keyed by customer ID.

* **On success**: returns information about the stored card as a
  [Card](#card) object.
* **On failure**: throws [`USAGE_ERROR`](#e1),
[`STORE_CUSTOMER_CARD_CANCELED`](#e6),
[`STORE_CUSTOMER_CARD_INVALID_CUSTOMER_ID`](#e7),
[`STORE_CUSTOMER_CARD_SDK_NOT_AUTHORIZED`](#e8) or
[`STORE_CUSTOMER_CARD_NO_NETWORK`](#e9)

#### Example usage

```javascript
import {
  startStoreCardAsync,
  StoreCustomerCardCancelled,
  StoreCustomerCardInvalidCustomerId,
  StoreCustomerCardSdkNotAuthorized,
  StoreCustomerCardNoNetwork,
  UsageError,
} from 'react-native-square-reader-sdk';
...
const customerId = 'DRYKVK5Y6H5R4JH9ZPQB3XPZQC';
try {
  const card = await startStoreCardAsync(customerId);
  // Customer's card is stored successfully and card infomation is available
} catch (ex) {
  let errorMessage = ex.message;
  switch (ex.code) {
    case StoreCustomerCardCancelled:
      // Handle canceled
      break;
    case StoreCustomerCardInvalidCustomerId:
      // Handle invalid customer id error
      break;
    case StoreCustomerCardNoNetwork:
      // Handle no network error
      break;
    case StoreCustomerCardSdkNotAuthorized:
      // Handle sdk not authorized
      break;
    default:
      if (__DEV__) {
        errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
        console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`);
      }
      Alert.alert('Error', errorMessage);
      break;
  }
}
```


## Objects

### Card

Represents the non-confidential details of a payment card.

Field             | Type                    | Description
----------------- | ----------------------- | --------------------
brand             | [CardBrand](#cardbrand) | Indicates the entity responsible for issuing the card.
lastFourDigits    | String                  | Indicates how the card information was captured.
expirationMonth   | integer                 | The month when the associated card expires, if available. Expiration month is always an integer between 1 and 12, inclusive.
expirationYear    | integer                 | The 4-digit year when the associated card expires, if available.
id                | String                  | The unique, Square-issued identifier for the card. Only set when the object represents a saved card on file.
cardholderName    | String                  | The cardholder name. This value is present only if this object represents a customer’s card on file.

#### Example JSON

```json
{
  "brand": "VISA",
  "lastFourDigits": "1111",
  "expirationMonth": 10,
  "expirationYear": 2019,
  "id": "ccof:GrUQnrDgWnQIK6tp3GB",
  "cardHolderName": "Tod Hu"
}
```


---

### CardDetails

Contains details related to a `card` tender used in a successful checkout flow.

Field       | Type                        | Description
----------- | --------------------------- | -----------------
entryMethod | [EntryMethod](#entrymethod) | Indicate how the card information was captured.
card        | [Card](#card)               | Provides information about the card used for payment.

#### Example JSON

```json
{
  "entryMethod": "MANUALLY_ENTERED",
  "card": {
    "brand": "VISA",
    "lastFourDigits": "1111"
  }
}
```


---

### CashDetails

Contains details related to a `cash` tender used in a successful checkout flow.

Field            | Type            | Description
---------------- | --------------- | -----------------
buyerTenderMoney | [Money](#money) | The total payment amount provided as `cash` during checkout.
changBackMoney   | [Money](#money) | The total change provided as `cash` during checkout.

#### Example JSON

```json
{
  "buyerTenderMoney": {
    "currencyCode": "USD",
    "amount": 110
  },
  "changBackMoney": {
    "currencyCode": "USD",
    "amount": 10
  }
}
```


---

### CheckoutParameter

Configures the UI experience for the checkout flow.

Field                  | Type                                              | Description
---------------------- | ------------------------------------------------- | -----------------
amountMoney            | [Money](#money)                                   | **REQUIRED**. The total payment amount.
skipReceipt            | boolean                                           | Indicates that the digital receipt options screen should not be displayed during checkout. Default: `false`
collectSignature       | boolean                                           | Indicates that signature collection is required during checkout. When false, the signature screen will never be displayed; when true, it will always be used. Default: `false`
allowSplitTender       | boolean                                           | Indicates that multiple payment methods are allowed. Default: `false`
note                   | String                                            | A note to display on digital receipts and in the [Square Dashboard]. Default: `undefined` (empty note)
tipSettings            | [TipSettings](#tipsettings)                       | Settings that configure the tipping behavior of the checkout flow. Default: `undefined` (Tip screen disabled)
additionalPaymentTypes | [AdditionalPaymentType](#additionalpaymenttype)[] | Valid payment methods for checkout (in addition to payments via Square Readers). Default: `undefined` (No additional payment method)

#### Example JSON

```json
{
  "amountMoney": {
    "amount": 1000,
    "currencyCode": "USD"
  },
  "skipReceipt": false,
  "collectSignature": true,
  "allowSplitTender": false,
  "note": "Payment for dogsitting",
  "tipSettings": {
    "showCustomTipField": "false",
    "showSeparateTipScreen": "true",
    "tipPercentages": [10, 15, 20]
  },
  "additionalPaymentTypes": ["cash", "manual_card_entry", "other"]
}
```


---

### CheckoutResult

Contains the result of a successful checkout flow.

Field               | Type                 | Description
------------------- | -------------------- | -----------------
totalMoney          | [Money](#money)     | The total amount of money collected during the checkout flow.
locationId          | String              | The unique ID of the location to which the transaction was credited.
totalTipMoney       | [Money](#money)     | The total tip amount applied across all tenders.
transactionClientId | String              | A unique client-generated ID.
createdAt           | String              | The date and time when the transaction was completed as determined by the client device.
tenders             | [Tender](#tender)[] | The set of tenders associated with a successful transaction.
transactionId       | String              | A unique ID issued by Square. Only set for successful transactions that include one or more card tenders.

All successful transactions include a client-generated ID (`transactionClientId`).
Transactions with card tenders also include a `transactionId` that is assigned
when the card is processed by Square.

To reconcile transactions that do not have card tenders, use
`transactionClientId` to match client-generated transactions to the `client_id`
field in transactions returned by the ListTransactions endpoint of the
[Transactions API].

#### Example JSON

```json
{
"totalMoney": {
  "currencyCode": "USD",
  "amount": 100
},
"locationId": "XXXXXXXXXXXXX",
"totalTipMoney": {
  "currencyCode": "USD",
  "amount": 0
},
"tenders": [
  {
    "type": "cash",
    "createdAt": "2018-08-22T18:05:18Z"
  },
  {
    "type": "card",
    "tenderId": "XXXXXXXXXXXXXXXXXXXXXXXX",
    "createdAt": "2018-08-22T18:05:59Z"
  },
],
  "transactionId": "XXXXXXXXXXXXXXXXXXXXXXXX",
  "transactionClientId": "0X0000X0-0000-000X-XX0X-X00XX00X00X0",
  "createdAt": "2018-08-22T18:05:21Z"
}
```


---

### Location

Represents information about a location associated with a Square account.

Field                         | Type            | Description
----------------------------- | --------------- | -----------------
currencyCode                  | String          | The currency used for all transactions at this location, specified in [ISO 4217 format] .
businessName                  | String          | The business name associated with the location. This is the name shown on Square digital receipts.
isCardProcessingActivated     | boolean         | Indicates whether or not this location is activated for card processing.
maximumCardPaymentAmountMoney | [Money](#money) | The maximum card payment amount allowed at this location.
minimumCardPaymentAmountMoney | [Money](#money) | The minimum card payment amount allowed at this location.
name                          | String          | The nickname of the location as set in the [Square Dashboard].
locationId                    | String          | A unique ID for the location assigned by Square

#### Example JSON

```json
{
  "currencyCode": "USD",
  "businessName": "Raphael's Puppy Care Emporium",
  "isCardProcessingActivated": true,
  "maximumCardPaymentAmountMoney": {
    "amount": 50000,
    "currencyCode": "USD"},
  "minimumCardPaymentAmountMoney": {
    "amount": 100,
    "currencyCode": "USD"},
  "name": "Chicago Treat-mobile",
  "locationId": "XXXXXXXXXXXXX"
}
```


---

### Money

Captures information about the amount tendered during a transaction. **Monetary
amounts are specified, in the smallest denomination of the currency indicated**.
For example, when `currency` is `USD`, `amount` is in cents, so a 1 dollar
payment (1 USD) would have `amount` equal to `100`.  

Field        | Type    | Description
------------ | ------- | -----------------
amount       | integer | **REQUIRED** The amount of money, in the smallest denomination of the indicated currency.
currencyCode | string  | The type of currency, in [ISO 4217 format]. For example, the currency code for US dollars is USD.

All `Money` objects require an `amount` and `currencyCode` but `currenyCode` is
optional for the Reader SDK React Native plugin because `Money` objects will use
the currency code of the currently authorized location by default.

#### Example JSON

```json
{
  "amount": 100,
  "currencyCode": "USD"
}
```


---

### Tender

Contains the result of a processed tender.

Field       | Type                        | Description
----------- | --------------------------- | -----------------
cardDetails | [CardDetails](#carddetails) | Details about the tender. Only set for `card` tenders.
cashDetails | [CashDetails](#cashdetails) | Details about the tender. Only set for `cash` tenders.
createdAt   | String                      | The date and time when the tender was processed as determined by the client device.
tenderId    | String                      | A unique ID issued by Square. Only set for `card` tenders.
tipMoney    | [Money](#money)             | The monetary amount added to this tender as a tip.
totalMoney  | [Money](#money)             | The total monetary amount of this tender, including tips.
type        | [TenderType](#tendertype)   | The method used to make payment.


#### Example JSON

```json
{
  "type": "cash",
  "tenderId": "XXXXXXXXXXXXXXXXXXXXXXXX",
  "createdAt": "2018-08-22T18:05:18Z",
  "totalMoney": {
    "amount": 1500,
    "currencyCode": "USD"
  },
  "tipMoney": {
    "amount": 500,
    "currencyCode": "USD"
  },
  "cashDetails": {
    "buyerTenderMoney": {
      "currencyCode": "USD",
      "amount": 2000
    },
    "changBackMoney": {
      "currencyCode": "USD",
      "amount": 500
    }
  }      
}
```


---

### TipSettings

Settings that configure the tipping behavior of the checkout flow.

Field                 | Type      | Description
--------------------- | --------- | -----------------
showCustomTipField    | boolean   | Indicates whether custom tip amounts are allowed during the checkout flow. Default: `false`.
showSeparateTipScreen | boolean   | Indicates that tip options should be presented on their own screen. Default: `false`.
tipPercentages        | Integer[] | A list of up to 3 non-negative integers from 0 to 100 (inclusive) to indicate tip percentages that will be presented during the checkout flow. Default: `[15, 20, 25]`

#### Example JSON

```json
{
  "showCustomTipField": "false",
  "showSeparateTipScreen": "true",
  "tipPercentages": [10, 15, 20]
}
```



## Constants

### AdditionalPaymentType

Payment types accepted during the Reader SDK checkout flow in addition to
payments via Square Readers:

* `card`  - Manually typed-in card payments.
* `cash`  - Cash payments. Useful for testing.
* `other` - Check, third-party gift cards, and other payment types.


---

### CardBrand

Supported brands for `card` payments accepted during the Reader SDK checkout
flow.

* `VISA` - Visa Inc. credit or debit card.
* `MASTERCARD` - Mastercard Incorporated credit or debit card.
* `AMERICAN_EXPRESS` - merican Express Company credit card.
* `DISCOVER` - Discover Financial Services credit card.
* `DISCOVER_DINERS` - Diners Club International credit card.
* `INTERAC` - Canadian Interbank Network debit card.
* `JCB` - Japan Credit Bureau credit card.
* `CHINA_UNIONPAY` - China UnionPay credit card.
* `SQUARE_GIFT_CARD` - [Square-issued gift card].
* `EFTPOS` - A debit or cash-back transaction (Electronic Funds Transfer at Point Of Sale).
* `OTHER_BRAND` - An unexpected card type.


---

### EntryMethod

Entry methods for `card` payments accepted during the Reader SDK checkout flow.

* `CHIP` - Card information collected with Square Reader via chip ("dip").
* `CONTACTLESS` - Card information collected with Square Reader via NFC ("tap").
* `MANUALLY_ENTERED` - Card information collected by typing it in ("keyed-in").
* `SWIPE` - Card information collected with Square Reader via magstripe ("swipe").
* `UNKNOWN` - **iOS only**. Card information collected in some other way (e.g., Apple Pay digital wallet).


---

### TenderType

Methods used to provide payment during a successful checkout flow:

* `card`  - Scanned, dipped, or manually typed-in card payments.
* `cash`  - Cash payments. Useful for testing.
* `other` - Check, third-party gift cards, and other payment types.



## Errors

Error                                                    | Cause                                                               | Returned by
-------------------------------------------------------- | ------------------------------------------------------------------- | ---
<a id="e1">`USAGE_ERROR`</a>                             | Reader SDK was used in an unexpected or unsupported way.            | all methods
<a id="e2">`AUTHORIZE_NO_NETWORK`</a>                    | Reader SDK could not connect to the network.                        | [authorizeAsync](#authorizeasync)
<a id="e3">`CHECKOUT_CANCELED`</a>                       | The user canceled the checkout flow.                                | [startCheckoutAsync](#startcheckoutasync)
<a id="e4">`CHECKOUT_SDK_NOT_AUTHORIZED`</a>             | The checkout flow started but Reader SDK was not authorized.        | [startCheckoutAsync](#startcheckoutasync)
<a id="e5">`READER_SETTINGS_SDK_NOT_AUTHORIZED`</a>      | The Reader settings flow started but Reader SDK was not authorized. | [startReaderSettingsAsync](#startreadersettingsasync)
<a id="e6">`STORE_CUSTOMER_CARD_CANCELED`</a>            | The user canceled the store card flow.                              | [startStoreCardAsync](#startstorecardasync)
<a id="e7">`STORE_CUSTOMER_CARD_INVALID_CUSTOMER_ID`</a> | The customer ID passed into the controller was invalid.             | [startStoreCardAsync](#startstorecardasync)
<a id="e8">`STORE_CUSTOMER_CARD_SDK_NOT_AUTHORIZED`</a>  | The flow to store a customer card started but Reader SDK was not authorized. | [startStoreCardAsync](#startstorecardasync)
<a id="e9">`STORE_CUSTOMER_CARD_NO_NETWORK`</a>          | Reader SDK could not connect to the network.                        | [startStoreCardAsync](#startstorecardasync)


[//]: # "Link anchor definitions"
[docs.connect.squareup.com]: https://docs.connect.squareup.com
[Mobile Authorization API]: https://docs.connect.squareup.com/payments/readersdk/mobile-authz-guide
[Reader SDK]: https://docs.connect.squareup.com/payments/readersdk/overview
[ISO 4217 format]: https://www.iban.com/currency-codes.html
[Square Dashboard]: https://squareup.com/dashboard/
[Transactions API]: https://docs.connect.squareup.com/payments/transactions/overview
[Square-issued gift card]: https://squareup.com/us/en/software/gift-cards
