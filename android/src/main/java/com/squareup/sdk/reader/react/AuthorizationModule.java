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

import android.os.Handler;
import android.os.Looper;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.squareup.sdk.reader.ReaderSdk;
import com.squareup.sdk.reader.authorization.AuthorizeCallback;
import com.squareup.sdk.reader.authorization.AuthorizeErrorCode;
import com.squareup.sdk.reader.authorization.DeauthorizeCallback;
import com.squareup.sdk.reader.authorization.DeauthorizeErrorCode;
import com.squareup.sdk.reader.authorization.Location;
import com.squareup.sdk.reader.core.CallbackReference;
import com.squareup.sdk.reader.core.Result;
import com.squareup.sdk.reader.core.ResultError;
import com.squareup.sdk.reader.react.converter.LocationConverter;

class AuthorizationModule extends ReactContextBaseJavaModule {
    // Define all the authorization error debug codes and messages below
    // These error codes and messages **MUST** align with iOS error codes and javascript error codes

    // react native module debug error codes
    private static final String RN_AUTHORIZE_ALREADY_IN_PROGRESS = "rn_authorize_already_in_progress";
    private static final String RN_AUTH_LOCATION_NOT_AUTHORIZED = "rn_auth_location_not_authorized";
    private static final String RN_DEAUTHORIZE_ALREADY_IN_PROGRESS = "rn_deauthorize_already_in_progress";

    // react native module debug messages
    private static final String RN_MESSAGE_AUTHORIZE_ALREADY_IN_PROGRESS = "Authorization is already in progress. Please wait for authorizeAsync to complete.";
    private static final String RN_MESSAGE_AUTH_LOCATION_NOT_AUTHORIZED = "You should authorize first before get authorize location.";
    private static final String RN_MESSAGE_DEAUTHORIZE_ALREADY_IN_PROGRESS = "Deauthorization is already in progress. Please wait for deauthorizeAsync to complete.";

    private CallbackReference authorizeCallbackRef;
    private CallbackReference deauthorizeCallbackRef;

    public AuthorizationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.authorizeCallbackRef = null;
        this.deauthorizeCallbackRef = null;
    }

    @Override
    public String getName() {
        return "RNReaderSDKAuthorization";
    }

    @ReactMethod
    public void isAuthorized(Promise promise) {
        promise.resolve(ReaderSdk.authorizationManager().getAuthorizationState().isAuthorized());
    }

    @ReactMethod
    public void authorizedLocation(Promise promise) {
        if (ReaderSdk.authorizationManager().getAuthorizationState().isAuthorized()) {
            promise.resolve(LocationConverter.toJSObject(ReaderSdk.authorizationManager().getAuthorizationState().getAuthorizedLocation()));
        } else {
            String errorJsonMessage = ErrorHandlerUtilities.createNativeModuleError(RN_AUTH_LOCATION_NOT_AUTHORIZED, RN_MESSAGE_AUTH_LOCATION_NOT_AUTHORIZED);
            promise.reject(ErrorHandlerUtilities.USAGE_ERROR, new ReaderSdkException(errorJsonMessage));
        }
    }

    @ReactMethod
    public void authorize(final String authCode, final Promise promise) {
        if (this.authorizeCallbackRef != null) {
            String errorJsonMessage = ErrorHandlerUtilities.createNativeModuleError(RN_AUTHORIZE_ALREADY_IN_PROGRESS, RN_MESSAGE_AUTHORIZE_ALREADY_IN_PROGRESS);
            promise.reject(ErrorHandlerUtilities.USAGE_ERROR, new ReaderSdkException(errorJsonMessage));
            return;
        }
        this.authorizeCallbackRef = ReaderSdk.authorizationManager().addAuthorizeCallback(new AuthorizeCallback() {
            @Override
            public void onResult(Result<Location, ResultError<AuthorizeErrorCode>> result) {
                authorizeCallbackRef.clear();
                authorizeCallbackRef = null;
                if (result.isError()) {
                    ResultError<AuthorizeErrorCode> error = result.getError();
                    String errorJsonMessage = ErrorHandlerUtilities.serializeErrorToJson(error.getDebugCode(), error.getMessage(), error.getDebugMessage());
                    promise.reject(ErrorHandlerUtilities.getErrorCode(error.getCode()), new ReaderSdkException(errorJsonMessage));
                    return;
                }
                Location location = result.getSuccessValue();
                promise.resolve(LocationConverter.toJSObject(location));
            }
        });
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                ReaderSdk.authorizationManager().authorize(authCode);
            }
        });
    }

    @ReactMethod
    public void canDeauthorize(Promise promise) {
        promise.resolve(ReaderSdk.authorizationManager().getAuthorizationState().canDeauthorize());
    }

    @ReactMethod
    public void deauthorize(final Promise promise) {
        if (this.deauthorizeCallbackRef != null) {
            String errorJsonMessage = ErrorHandlerUtilities.createNativeModuleError(RN_DEAUTHORIZE_ALREADY_IN_PROGRESS, RN_MESSAGE_DEAUTHORIZE_ALREADY_IN_PROGRESS);
            promise.reject(ErrorHandlerUtilities.USAGE_ERROR, new ReaderSdkException(errorJsonMessage));
            return;
        }
        this.deauthorizeCallbackRef = ReaderSdk.authorizationManager().addDeauthorizeCallback(new DeauthorizeCallback() {
            @Override
            public void onResult(Result<Void, ResultError<DeauthorizeErrorCode>> result) {
                deauthorizeCallbackRef.clear();
                deauthorizeCallbackRef = null;
                if (result.isError()) {
                    ResultError<DeauthorizeErrorCode> error = result.getError();
                    String errorJsonMessage = ErrorHandlerUtilities.serializeErrorToJson(error.getDebugCode(), error.getMessage(), error.getDebugMessage());
                    promise.reject(ErrorHandlerUtilities.getErrorCode(error.getCode()), new ReaderSdkException(errorJsonMessage));
                    return;
                }
                promise.resolve(null);
            }
        });
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                ReaderSdk.authorizationManager().deauthorize();
            }
        });
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        // clear the callback to avoid memory leaks when react native module is destroyed
        if (this.authorizeCallbackRef != null) {
            this.authorizeCallbackRef.clear();
        }
        if (this.deauthorizeCallbackRef != null) {
            this.deauthorizeCallbackRef.clear();
        }
    }

}
