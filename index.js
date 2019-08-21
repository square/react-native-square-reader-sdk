import { NativeModules } from 'react-native'; // eslint-disable-line import/no-unresolved

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
