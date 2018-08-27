import { NativeModules } from 'react-native';

const { RNReaderSDKAuthorization, RNReaderSDKCheckout, RNReaderSDKReaderSettings } = NativeModules;

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
    return RNReaderSDK.authorizedLocation();
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

// error codes are defined below, both iOS and Android *MUST* return same error for these errors:
// Usage error
export const UsageError = "USAGE_ERROR";

// Expected errors:
export const AuthorizeErrorNoNetwork = "AUTHORIZE_NO_NETWORK";
export const CheckoutErrorCanceled = "CHECKOUT_CANCELED";
export const CheckoutErrorSdkNotAuthorized = "CHECKOUT_SDK_NOT_AUTHORIZED";
export const ReaderSettingsErrorSdkNotAuthorized = "READER_SETTINGS_SDK_NOT_AUTHORIZED";

function createReaderSDKError(ex) {
    try {
        const errorDetails = JSON.parse(ex.message);
        ex.message = errorDetails.message;
        ex.debugCode = errorDetails.debugCode;
        ex.debugMessage = errorDetails.debugMessage;
    } catch (parseEx) {
        ex.parseEx = parseEx;
    }

    return ex;
}
