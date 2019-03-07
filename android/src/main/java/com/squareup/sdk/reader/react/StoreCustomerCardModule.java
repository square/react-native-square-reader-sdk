/*
Copyright 2018 Square Inc.

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
import com.squareup.sdk.reader.ReaderSdk;
import com.squareup.sdk.reader.checkout.Card;
import com.squareup.sdk.reader.core.CallbackReference;
import com.squareup.sdk.reader.core.Result;
import com.squareup.sdk.reader.core.ResultError;
import com.squareup.sdk.reader.crm.StoreCardActivityCallback;
import com.squareup.sdk.reader.crm.StoreCustomerCardErrorCode;
import com.squareup.sdk.reader.react.internal.ErrorHandlerUtils;
import com.squareup.sdk.reader.react.internal.ReaderSdkException;
import com.squareup.sdk.reader.react.internal.converter.CardConverter;

class StoreCustomerCardModule extends ReactContextBaseJavaModule {
    // Define all the store customer card debug codes and messages below
    // These error codes and messages **MUST** align with iOS error codes and javascript error codes
    // Search KEEP_IN_SYNC_STORE_CUSTOMER_CARD_ERROR to update all places

    // react native module debug error codes
    private static final String RN_STORE_CUSTOMER_CARD_ALREADY_IN_PROGRESS = "rn_store_customer_card_already_in_progress";

    // react native module debug messages
    private static final String RN_MESSAGE_STORE_CUSTOMER_CARD_ALREADY_IN_PROGRESS = "A store customer card operation is already in progress. Ensure that the in-progress store customer card is completed before calling startStoreCardAsync again.";

    private volatile CallbackReference storeCardCallbackRef;
    private final Handler mainLooperHandler;
    private final CardConverter cardConverter;

    public StoreCustomerCardModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mainLooperHandler = new Handler(Looper.getMainLooper());
        cardConverter = new CardConverter();
    }

    @Override
    public String getName() {
        return "RNReaderSDKStoreCustomerCard";
    }

    @ReactMethod
    public void startStoreCard(final String customerId, final Promise promise) {
        if (storeCardCallbackRef != null) {
            String errorJsonMessage = ErrorHandlerUtils.createNativeModuleError(RN_STORE_CUSTOMER_CARD_ALREADY_IN_PROGRESS, RN_MESSAGE_STORE_CUSTOMER_CARD_ALREADY_IN_PROGRESS);
            promise.reject(ErrorHandlerUtils.USAGE_ERROR, new ReaderSdkException(errorJsonMessage));
            return;
        }

        StoreCardActivityCallback storeCardActivityCallback = new StoreCardActivityCallback() {
            @Override
            public void onResult(Result<Card, ResultError<StoreCustomerCardErrorCode>> result) {
                storeCardCallbackRef.clear();
                storeCardCallbackRef = null;
                if (result.isError()) {
                    ResultError<StoreCustomerCardErrorCode> error = result.getError();
                    String errorJsonMessage = ErrorHandlerUtils.serializeErrorToJson(error.getDebugCode(), error.getMessage(), error.getDebugMessage());
                    promise.reject(ErrorHandlerUtils.getErrorCode(error.getCode()), new ReaderSdkException(errorJsonMessage));
                    return;
                }

                Card card = result.getSuccessValue();
                promise.resolve(cardConverter.toJSObject(card));
            }
        };

        storeCardCallbackRef = ReaderSdk.customerCardManager().addStoreCardActivityCallback(storeCardActivityCallback);
        final Activity currentActivity = getCurrentActivity();
        mainLooperHandler.post(new Runnable() {
            @Override
            public void run() {
                ReaderSdk.customerCardManager().startStoreCardActivity(currentActivity, customerId);
            }
        });
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        // clear the callback to avoid memory leaks when react native module is destroyed
        if (storeCardCallbackRef != null) {
            storeCardCallbackRef.clear();
        }
    }
}
