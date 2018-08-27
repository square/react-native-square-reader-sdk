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
import com.squareup.sdk.reader.core.CallbackReference;
import com.squareup.sdk.reader.core.Result;
import com.squareup.sdk.reader.core.ResultError;
import com.squareup.sdk.reader.hardware.ReaderSettingsActivityCallback;
import com.squareup.sdk.reader.hardware.ReaderSettingsErrorCode;

class ReaderSettingsModule extends ReactContextBaseJavaModule {
    // Define all the reader settings debug codes and messages below
    // These error codes and messages **MUST** align with iOS error codes and javascript error codes

    // react native module debug error codes
    private static final String RN_READER_SETTINGS_ALREADY_IN_PROGRESS = "rn_reader_settings_already_in_progress";

    // react native module debug messages
    private static final String RN_MESSAGE_READER_SETTINGS_ALREADY_IN_PROGRESS = "A reader settings operation is already in progress. Ensure that the in-progress reader settings is completed before calling startReaderSettingsAsync again.";

    private CallbackReference readerSettingCallbackRef;

    public ReaderSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.readerSettingCallbackRef = null;
    }

    @Override
    public String getName() {
        return "RNReaderSDKReaderSettings";
    }

    @ReactMethod
    public void startReaderSettings(final Promise promise) {
        if (this.readerSettingCallbackRef != null) {
            String errorJsonMessage = ErrorHandlerUtilities.createNativeModuleError(RN_READER_SETTINGS_ALREADY_IN_PROGRESS, RN_MESSAGE_READER_SETTINGS_ALREADY_IN_PROGRESS);
            promise.reject(ErrorHandlerUtilities.USAGE_ERROR, new ReaderSdkException(errorJsonMessage));
            return;
        }
        this.readerSettingCallbackRef = ReaderSdk.readerManager()
                .addReaderSettingsActivityCallback(new ReaderSettingsActivityCallback() {
                    @Override
                    public void onResult(Result<Void, ResultError<ReaderSettingsErrorCode>> result) {
                        readerSettingCallbackRef.clear();
                        readerSettingCallbackRef = null;
                        if (result.isError()) {
                            ResultError<ReaderSettingsErrorCode> error = result.getError();
                            String errorJsonMessage = ErrorHandlerUtilities.serializeErrorToJson(error.getDebugCode(), error.getMessage(), error.getDebugMessage());
                            promise.reject(ErrorHandlerUtilities.getErrorCode(error.getCode()), new ReaderSdkException(errorJsonMessage));
                            return;
                        }
                        promise.resolve(null);
                    }
                });

        final Activity currentActivity = this.getCurrentActivity();
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                ReaderSdk.readerManager().startReaderSettingsActivity(currentActivity);
            }
        });
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        // clear the callback to avoid memory leaks when react native module is destroyed
        if (this.readerSettingCallbackRef != null) {
            this.readerSettingCallbackRef.clear();
        }
    }
}
