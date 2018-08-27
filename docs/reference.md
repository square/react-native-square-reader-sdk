# React Native Reader SDK Technical Reference

This technical reference documents methods available in the React Native
wrapper for Reader SDK. For detailed documentation on Reader SDK, please see
[docs.connect.squareup.com].

Method                                                    | Return Type | Description
--------------------------------------------------------- | ----------- | ---
[authorizeAsync](#authorizeasync)                         | void                  | Authorizes Reader SDK to collect payments.
[canDeauthorizeAsync](#candeauthorizeasync)               | boolean               | Verifies Reader SDK can be deauthorized.
[deauthorizeAsync](#deauthorizeasync)                     | void                  | Deauthorizes Reader SDK.
[getAuthorizedLocationAsync](#getauthorizedlocationasync) | [Location](#location) | Returns the currently authorized location
[isAuthorizedAsync](#isauthorizedasync)                   | boolean               | Verifies Reader SDK is currently authorized for payment collection.
[startCheckoutAsync](#startcheckoutasync)                 | void                  | Begins the checkout workflow.
[startReaderSettingsAsync](#startreadersettingsasync)     | void                  | Starts the Reader settings flow for connecting Square Reader

---

* [Methods](#methods)
* [Objects](#objects)
* [Enums](#enums)

---

## Methods

### `authorizeAsync`

Used to authorize [Reader SDK] to collect payments on behalf of a Square
location. On success, `authorizeAsync` returns information about the currently
authorized location.

Parameter  | Type   | Description
---------- | ------ | -----------
`authCode` | string | Authorization code from the [Mobile Authorization API]

#### Example usage

```javascript
import {
  authorizeAsync,
  AuthorizeErrorNoNetowrk,
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


### `canDeauthorizeAsync`

Used to determine if it is safe to deauthorize Reader SDK. Returns `true` if all
transactions have been successfully synced to Square.

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


### `deauthorizeAsync`

Used to deauthorize [Reader SDK]. Reader SDK cannot be deauthorized if there
are transactions that have not been synced to Square.

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


### `getAuthorizedLocationAsync`

Used to fetch information about the location currently authorized for Reader
SDK. Returns an error if Reader SDK is not already authorized and a
[`Location`](#location) on success.

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

### `isAuthorizedAsync`

Used to determine if Reader SDK is currently authorized to accept payments.
Returns `true` if the authorization flow was completed with a valid
[Mobile Authorization API] token.

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

### `startCheckoutAsync`

Used to start the checkout flow and collect payment information from Square
Reader. Returns a [CheckoutResult](#checkoutresult) on success and an error
otherwise (for example, if Reader SDK is not currently authorized).

#### Parameters

* `checkoutParams` - a [CheckoutParameter](#checkoutparameter) object.
Configures the checkout flow and transaction amount.

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

### `startReaderSettingsAsync`

Used to start the Reader settings flow. Returns an error if Reader SDK is not
currently authorized.

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


## Objects

### CheckoutParameter

Configures the UI experience for the checkout flow.

Field                  | Type                                    | Description
---------------------- | ------------------------------------------------- | -----------------
amountMoney            | [Money](#money)                                   | **REQUIRED**. The total payment amount.
skipReceipt            | boolean                                           | Indicates that the digital receipt options screen should not be displayed during checkout. Default: `null`
alwaysRequireSignature | boolean                                           | Indicates that signature collection is required during checkout for all card transactions. Default: `true`
allowSplitTender       | boolean                                           | Indicates that multiple payment methods are allowed. Default: `false`
note                   | String                                            | A note to display on digital receipts and in the [Square Dashboard]. Default: `null`
tipSettings            | [TipSettings](#tipsettings)                       | Settings that configure the tipping behavior of the checkout flow. Default: `null`
additionalPaymentTypes | [AdditionalPaymentType](#additionalpaymenttype)[] | Valid payment methods for checkout (in addition to payments via Square Readers). Default: empty set.

#### Example JSON

```json
{
  "amountMoney": {
    "amount": 1000,
    "currencyCode": "USD"
  },
  "skipReceipt": false,
  "alwaysRequireSignature": true,
  "allowSplitTender": false,
  "note": "Payment for dogsitting",
  "tipSettings": {
  },
  "additionalPaymentTypes": ["cash", "manual", "other"]
}
```

### CheckoutResult

Contains the result of a successful checkout flow.

Field               | Type                                    | Description
------------------- | ------------------------------------------------- | -----------------
totalMoney          | [Money](#money)     | The total amount of money collected during the checkout flow.
locationID          | String              | The unique ID of the location to which the transaction was credited.
totalTipMoney       | [Money](#money)     | The total tip amount applied across all tenders.
transactionID       | String              | Assigned when the card is processed by Square..
transactionClientID | String              | A unique client-generated ID.
createdAt           | String              | The date and time when the transaction was completed as determined by the client device.
tenders             | [Tender](#tender)[] | The set of tenders associated with a successful transaction.
transactionID       | String              | A unique ID issued by Square. Only set for successful transactions that include one or more card tenders.

All successful transactions include a client-generated ID (`transactionClientID`).
Transactions with card tenders also include a `transactionID` that is assigned
when the card is processed by Square.

To reconcile transactions that do not have card tenders, use
`transactionClientID` to match client-generated transactions to the `client_id`
field in transactions returned by the ListTransactions endpoint of the
[Transactions API].

#### Example JSON

```json
{
"totalMoney": {
  "currencyCode": "USD",
  "amount": 100
},
"locationID": "XXXXXXXXXXXXX",
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
    "tenderID": "XXXXXXXXXXXXXXXXXXXXXXXX",
    "createdAt": "2018-08-22T18:05:59Z"
  },
],
  "transactionID": "XXXXXXXXXXXXXXXXXXXXXXXX",
  "transactionClientID": "0X0000X0-0000-000X-XX0X-X00XX00X00X0",
  "createdAt": "2018-08-22T18:05:21Z"
}
```


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
locationID                    | String          | A unique ID for the location assigned by Square

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
  "locationID": "XXXXXXXXXXXXX"
}
```


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
optional for the Reader SDK React Native module because `Money` objects will use
the currency code of the currently authorized location by default.

#### Example JSON

```json
{
  "amount": 100,
  "currencyCode": "USD"
}
```


### Tender

Contains the result of a processed tender.

Field     | Type                      | Description
--------- | ------------------------- | -----------------
type      | [TenderType](#tendertype) | The method used to make payment.
tenderID  | String                    | A unique ID issued by Square. Only set for `card` tenders.
createdAt | String                    | The date and time when the tender was processed as determined by the client device.

#### Example JSON

```json
{
  "type": "card",
  "tenderID": "XXXXXXXXXXXXXXXXXXXXXXXX",
  "createdAt": "2018-08-22T18:05:18Z"
}
```


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


### TenderType

Methods used to provide payment during a successful checkout flow:

* `card`  - Scanned, dipped, or manually typed-in card payments.
* `cash`  - Cash payments. Useful for testing.
* `other` - Check, third-party gift cards, and other payment types.


## Errors

* `USAGE_ERROR` - Reader SDK was used in an unexpected or unsupported way.
* `AUTHORIZE_NO_NETWORK` - Reader SDK could not connect to the network.
* `CHECKOUT_CANCELED` - The user canceled the checkout flow.
* `CHECKOUT_SDK_NOT_AUTHORIZED` - The checkout flow started but Reader SDK was
  not authorized.
* `READER_SETTINGS_SDK_NOT_AUTHORIZED` - The Reader settings flow started but
  Reader SDK was not authorized.


[//]: # "Link anchor definitions"
[docs.connect.squareup.com]: https://docs.connect.squareup.com
[Mobile Authorization API]: https://docs.connect.squareup.com/payments/readersdk/mobile-authz-guide
[Reader SDK]: https://docs.connect.squareup.com/payments/readersdk/overview
[ISO 4217 format]: https://www.iban.com/currency-codes.html
[Square Dashboard]: https://squareup.com/dashboard/
[Transactions API]:
