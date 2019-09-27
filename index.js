/*
 Copyright 2019 Square Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

import { NativeModules } from 'react-native'; // eslint-disable-line import/no-unresolved
import ValidateCheckoutParameters from './src/utils';

const {
  RNReaderSDKAuthorization,
  RNReaderSDKCheckout,
  RNReaderSDKReaderSettings,
  RNReaderSDKStoreCustomerCard,
} = NativeModules;

export async function authorizeAsync(authCode) {
  try {
    return await RNReaderSDKAuthorization.authorize(authCode);
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

export async function deauthorizeAsync() {
  try {
    await RNReaderSDKAuthorization.deauthorize();
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

export async function isAuthorizedAsync() {
  try {
    return await RNReaderSDKAuthorization.isAuthorized();
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

export async function isAuthorizationInProgressAsync() {
  try {
    return await RNReaderSDKAuthorization.isAuthorizationInProgress();
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

export async function canDeauthorizeAsync() {
  try {
    return await RNReaderSDKAuthorization.canDeauthorize();
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

export async function getAuthorizedLocationAsync() {
  try {
    return await RNReaderSDKAuthorization.authorizedLocation();
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

export async function startCheckoutAsync(checkoutParams) {
  try {
    ValidateCheckoutParameters(checkoutParams);
    return await RNReaderSDKCheckout.startCheckout(checkoutParams);
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

export async function startReaderSettingsAsync() {
  try {
    await RNReaderSDKReaderSettings.startReaderSettings();
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

export async function startStoreCardAsync(customerId) {
  try {
    return await RNReaderSDKStoreCustomerCard.startStoreCard(customerId);
  } catch (ex) {
    throw createReaderSDKError(ex);
  }
}

// error codes are defined below, both iOS and Android *MUST* return same error for these errors:
// Usage error
export const UsageError = 'USAGE_ERROR';

// Expected errors:
// Search KEEP_IN_SYNC_AUTHORIZE_ERROR to update all places
export const AuthorizeErrorNoNetwork = 'AUTHORIZE_NO_NETWORK';
// Search KEEP_IN_SYNC_CHECKOUT_ERROR to update all places
export const CheckoutErrorCanceled = 'CHECKOUT_CANCELED';
export const CheckoutErrorSdkNotAuthorized = 'CHECKOUT_SDK_NOT_AUTHORIZED';
// Search KEEP_IN_SYNC_READER_SETTINGS_ERROR to update all places
export const ReaderSettingsErrorSdkNotAuthorized = 'READER_SETTINGS_SDK_NOT_AUTHORIZED';
// Search KEEP_IN_SYNC_STORE_CUSTOMER_CARD_ERROR to update all places
export const StoreCustomerCardCancelled = 'STORE_CUSTOMER_CARD_CANCELED';
export const StoreCustomerCardInvalidCustomerId = 'STORE_CUSTOMER_CARD_INVALID_CUSTOMER_ID';
export const StoreCustomerCardSdkNotAuthorized = 'STORE_CUSTOMER_CARD_SDK_NOT_AUTHORIZED';
export const StoreCustomerCardNoNetwork = 'STORE_CUSTOMER_CARD_NO_NETWORK';

function createReaderSDKError(ex) {
  try {
    const errorDetails = JSON.parse(ex.message);
    ex.message = errorDetails.message; // eslint-disable-line no-param-reassign
    ex.debugCode = errorDetails.debugCode; // eslint-disable-line no-param-reassign
    ex.debugMessage = errorDetails.debugMessage; // eslint-disable-line no-param-reassign
  } catch (parseEx) {
    ex.parseEx = parseEx; // eslint-disable-line no-param-reassign
  }

  return ex;
}
