/*
Copyright 2022 Square Inc.

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
package com.squareup.sdk.reader.react;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.squareup.sdk.reader.ReaderSdk;
import com.squareup.sdk.reader.checkout.AdditionalPaymentType;
import com.squareup.sdk.reader.checkout.CheckoutActivityCallback;
import com.squareup.sdk.reader.checkout.CheckoutErrorCode;
import com.squareup.sdk.reader.checkout.CheckoutParameters;
import com.squareup.sdk.reader.checkout.CheckoutResult;
import com.squareup.sdk.reader.checkout.CurrencyCode;
import com.squareup.sdk.reader.checkout.Money;
import com.squareup.sdk.reader.checkout.TipSettings;
import com.squareup.sdk.reader.core.CallbackReference;
import com.squareup.sdk.reader.core.Result;
import com.squareup.sdk.reader.core.ResultError;
import com.squareup.sdk.reader.react.internal.converter.CheckoutResultConverter;
import com.squareup.sdk.reader.react.internal.ErrorHandlerUtils;
import com.squareup.sdk.reader.react.internal.ReaderSdkException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

class CheckoutModule extends ReactContextBaseJavaModule {
    // Define all the checkout debug codes and messages below
    // These error codes and messages **MUST** align with iOS error codes and javascript error codes
    // Search KEEP_IN_SYNC_CHECKOUT_ERROR to update all places

    // react native module debug error codes
    private static final String RN_CHECKOUT_ALREADY_IN_PROGRESS = "rn_checkout_already_in_progress";
    private static final String RN_CHECKOUT_INVALID_PARAMETER = "rn_checkout_invalid_parameter";

    // react native module debug messages
    private static final String RN_MESSAGE_CHECKOUT_ALREADY_IN_PROGRESS = "A checkout operation is already in progress. Ensure that the in-progress checkout is completed before calling startCheckoutAsync again.";
    private static final String RN_MESSAGE_CHECKOUT_INVALID_PARAMETER = "Invalid parameter found in checkout parameters.";

    private volatile CallbackReference checkoutCallbackRef;
    private final Handler mainLooperHandler;
    private final CheckoutResultConverter checkoutResultConverter;

    public CheckoutModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mainLooperHandler = new Handler(Looper.getMainLooper());
        checkoutResultConverter = new CheckoutResultConverter();
    }

    @Override
    public String getName() {
        return "RNReaderSDKCheckout";
    }

    @ReactMethod
    public void startCheckout(ReadableMap jsCheckoutParameters, final Promise promise) {
        StringBuilder paramError = new StringBuilder();
        if (!validateJSCheckoutParams(jsCheckoutParameters, paramError)) {
            String paramErrorDebugMessage = String.format("%s %s", RN_MESSAGE_CHECKOUT_INVALID_PARAMETER, paramError.toString());
            String errorJsonMessage = ErrorHandlerUtils.createNativeModuleError(RN_CHECKOUT_INVALID_PARAMETER, paramErrorDebugMessage);
            promise.reject(ErrorHandlerUtils.USAGE_ERROR, new ReaderSdkException(errorJsonMessage));
            return;
        }

        if (checkoutCallbackRef != null) {
            String errorJsonMessage = ErrorHandlerUtils.createNativeModuleError(RN_CHECKOUT_ALREADY_IN_PROGRESS, RN_MESSAGE_CHECKOUT_ALREADY_IN_PROGRESS);
            promise.reject(ErrorHandlerUtils.USAGE_ERROR, new ReaderSdkException(errorJsonMessage));
            return;
        }

        CheckoutActivityCallback checkoutCallback = new CheckoutActivityCallback() {
            @Override
            public void onResult(Result<CheckoutResult, ResultError<CheckoutErrorCode>> result) {
                checkoutCallbackRef.clear();
                checkoutCallbackRef = null;
                if (result.isError()) {
                    ResultError<CheckoutErrorCode> error = result.getError();
                    String errorJsonMessage = ErrorHandlerUtils.serializeErrorToJson(error.getDebugCode(), error.getMessage(), error.getDebugMessage());
                    promise.reject(ErrorHandlerUtils.getErrorCode(error.getCode()), new ReaderSdkException(errorJsonMessage));
                    return;
                }
                CheckoutResult checkoutResult = result.getSuccessValue();
                promise.resolve(checkoutResultConverter.toJSObject(checkoutResult));
            }
        };
        checkoutCallbackRef = ReaderSdk.checkoutManager().addCheckoutActivityCallback(checkoutCallback);

        ReadableMap jsAmountMoney = jsCheckoutParameters.getMap("amountMoney");
        Money amountMoney = new Money(
                jsAmountMoney.getInt("amount"),
                jsAmountMoney.hasKey("currencyCode") ? CurrencyCode.valueOf(jsAmountMoney.getString("currencyCode")) : CurrencyCode.current());

        CheckoutParameters.Builder checkoutParamsBuilder = CheckoutParameters.newBuilder(amountMoney);
        if (jsCheckoutParameters.hasKey("note")) {
            checkoutParamsBuilder.note(jsCheckoutParameters.getString("note"));
        }
        if (jsCheckoutParameters.hasKey("skipReceipt")) {
            checkoutParamsBuilder.skipReceipt(jsCheckoutParameters.getBoolean("skipReceipt"));
        }
        if (jsCheckoutParameters.hasKey("collectSignature")) {
            checkoutParamsBuilder.collectSignature(jsCheckoutParameters.getBoolean("collectSignature"));
        }
        if (jsCheckoutParameters.hasKey("allowSplitTender")) {
            checkoutParamsBuilder.allowSplitTender(jsCheckoutParameters.getBoolean("allowSplitTender"));
        }
        if (jsCheckoutParameters.hasKey("delayCapture")) {
            checkoutParamsBuilder.delayCapture(jsCheckoutParameters.getBoolean("delayCapture"));
        }
        if (jsCheckoutParameters.hasKey("tipSettings")) {
            TipSettings tipSettings = buildTipSettings(jsCheckoutParameters.getMap("tipSettings"));
            checkoutParamsBuilder.tipSettings(tipSettings);
        }
        if (jsCheckoutParameters.hasKey("additionalPaymentTypes")) {
            Set<AdditionalPaymentType> additionalPaymentTypes = buildAdditionalPaymentTypes(jsCheckoutParameters.getArray("additionalPaymentTypes"));
            checkoutParamsBuilder.additionalPaymentTypes(additionalPaymentTypes);
        }

        final CheckoutParameters checkoutParams = checkoutParamsBuilder.build();
        final Activity currentActivity = getCurrentActivity();
        mainLooperHandler.post(new Runnable() {
            @Override
            public void run() {
                ReaderSdk.checkoutManager().startCheckoutActivity(currentActivity, checkoutParams);
            }
        });
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        // clear the callback to avoid memory leaks when react native module is destroyed
        if (checkoutCallbackRef != null) {
            checkoutCallbackRef.clear();
        }
    }

    static private boolean validateJSCheckoutParams(ReadableMap jsCheckoutParams, StringBuilder paramError) {
        // check types of all parameters
        if (!jsCheckoutParams.hasKey("amountMoney") || jsCheckoutParams.getType("amountMoney") != ReadableType.Map) {
            paramError.append("'amountMoney' is missing or not an object");
            return false;
        } else if (jsCheckoutParams.hasKey("skipReceipt") && jsCheckoutParams.getType("skipReceipt") != ReadableType.Boolean) {
            paramError.append("'skipReceipt' is not a boolean");
            return false;
        } else if (jsCheckoutParams.hasKey("collectSignature") && jsCheckoutParams.getType("collectSignature") != ReadableType.Boolean) {
            paramError.append("'collectSignature' is not a boolean");
            return false;
        } else if (jsCheckoutParams.hasKey("allowSplitTender") && jsCheckoutParams.getType("allowSplitTender") != ReadableType.Boolean) {
            paramError.append("'allowSplitTender' is not a boolean");
            return false;
        } else if (jsCheckoutParams.hasKey("delayCapture") && jsCheckoutParams.getType("delayCapture") != ReadableType.Boolean) {
            paramError.append("'delayCapture' is not a boolean");
            return false;
        } else if (jsCheckoutParams.hasKey("note") && jsCheckoutParams.getType("note") != ReadableType.String) {
            paramError.append("'note' is not a string");
            return false;
        } else if (jsCheckoutParams.hasKey("tipSettings") && jsCheckoutParams.getType("tipSettings") != ReadableType.Map) {
            paramError.append("'tipSettings' is not an object");
            return false;
        } else if (jsCheckoutParams.hasKey("additionalPaymentTypes") && jsCheckoutParams.getType("additionalPaymentTypes") != ReadableType.Array) {
            paramError.append("'additionalPaymentTypes' is not an array");
            return false;
        }

        // check amountMoney
        ReadableMap amountMoney = jsCheckoutParams.getMap("amountMoney");
        if (!amountMoney.hasKey("amount") || amountMoney.getType("amount") != ReadableType.Number) {
            paramError.append("'amount' is not an integer");
            return false;
        }
        if (amountMoney.hasKey("currencyCode") && amountMoney.getType("currencyCode") != ReadableType.String) {
            paramError.append("'currencyCode' is not a String");
            return false;
        }
        if (amountMoney.hasKey("currencyCode")) {
            try {
                CurrencyCode.valueOf(amountMoney.getString("currencyCode"));
            } catch (IllegalArgumentException ex) {
                paramError.append("failed to parse 'currencyCode'");
                return false;
            }
        }

        if (jsCheckoutParams.hasKey("tipSettings")) {
            // check tipSettings
            ReadableMap tipSettings = jsCheckoutParams.getMap("tipSettings");
            if (tipSettings.hasKey("showCustomTipField") && tipSettings.getType("showCustomTipField") != ReadableType.Boolean) {
                paramError.append("'showCustomTipField' is not a boolean");
                return false;
            } else if (tipSettings.hasKey("showSeparateTipScreen") && tipSettings.getType("showSeparateTipScreen") != ReadableType.Boolean) {
                paramError.append("'showSeparateTipScreen' is not a boolean");
                return false;
            } else if (tipSettings.hasKey("tipPercentages") && tipSettings.getType("tipPercentages") != ReadableType.Array) {
                paramError.append("'tipPercentages' is not an array");
                return false;
            }
        }

        return true;
    }

    static private TipSettings buildTipSettings(ReadableMap tipSettingsConfig) {
        TipSettings.Builder tipSettingsBuilder = TipSettings.newBuilder();

        if (tipSettingsConfig.hasKey("showCustomTipField")) {
            tipSettingsBuilder.showCustomTipField(tipSettingsConfig.getBoolean("showCustomTipField"));
        }
        if (tipSettingsConfig.hasKey("showSeparateTipScreen")) {
            tipSettingsBuilder.showSeparateTipScreen(tipSettingsConfig.getBoolean("showSeparateTipScreen"));
        }
        if (tipSettingsConfig.hasKey("tipPercentages")) {
            ReadableArray tipPercentages = tipSettingsConfig.getArray("tipPercentages");
            if (tipPercentages != null) {
                List<Integer> percentagesList = new ArrayList<>();
                for (int i = 0; i < tipPercentages.size(); i++) {
                    percentagesList.add(tipPercentages.getInt(i));
                }
                tipSettingsBuilder.tipPercentages(percentagesList);
            }
        }

        return tipSettingsBuilder.build();
    }

    static private Set<AdditionalPaymentType> buildAdditionalPaymentTypes(ReadableArray additionalPaymentTypes) {
        Set<AdditionalPaymentType> types = new LinkedHashSet<>();
        if (additionalPaymentTypes != null) {
            for (int i = 0; i < additionalPaymentTypes.size(); i++) {
                String typeName = additionalPaymentTypes.getString(i);
                switch (typeName) {
                    case "cash":
                        types.add(AdditionalPaymentType.CASH);
                        break;
                    case "manual_card_entry":
                        types.add(AdditionalPaymentType.MANUAL_CARD_ENTRY);
                        break;
                    case "other":
                        types.add(AdditionalPaymentType.OTHER);
                        break;
                    default:
                        throw new RuntimeException("Unexpected payment type: " + typeName);
                }
            }
        }
        return types;
    }
}
