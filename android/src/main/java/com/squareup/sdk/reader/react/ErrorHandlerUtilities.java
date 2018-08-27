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

import com.facebook.react.BuildConfig;
import com.squareup.sdk.reader.authorization.AuthorizeErrorCode;
import com.squareup.sdk.reader.checkout.CheckoutErrorCode;
import com.squareup.sdk.reader.core.ErrorCode;
import com.squareup.sdk.reader.core.ResultError;
import com.squareup.sdk.reader.hardware.ReaderSettingsErrorCode;

import org.json.JSONException;
import org.json.JSONObject;

class ErrorHandlerUtilities {
    // Define all the error codes and messages below
    // These error codes and messages **MUST** align with iOS error codes and javascript error codes

    // Usage error
    public static final String USAGE_ERROR = "USAGE_ERROR";

    // Expected Errors,
    private static final String AUTHORIZE_NO_NETWORK = "AUTHORIZE_NO_NETWORK";
    private static final String CHECKOUT_CANCELED = "CHECKOUT_CANCELED";
    private static final String CHECKOUT_SDK_NOT_AUTHORIZED = "CHECKOUT_SDK_NOT_AUTHORIZED";
    private static final String READER_SETTINGS_SDK_NOT_AUTHORIZED = "READER_SETTINGS_SDK_NOT_AUTHORIZED";

    static public String createNativeModuleError(String nativeModuleErrorCode, String debugMessage) {
        return serializeErrorToJson(
                nativeModuleErrorCode,
                String.format("Something went wrong. Please contact the developer of this application and provide them with this error code: %s", nativeModuleErrorCode),
                debugMessage);
    }

    static public String serializeErrorToJson(String debugCode, String message, String debugMessage) {
        JSONObject errorData = new JSONObject();
        try {
            errorData.put("debugCode", debugCode);
            errorData.put("message", message);
            errorData.put("debugMessage", debugMessage);
        } catch (JSONException ex) {
            return String.format("{ 'message': 'failed to serialize error'}");
        }

        return errorData.toString();
    }

    static public String getErrorCode(ErrorCode nativeErrorCode) {
        if (nativeErrorCode.isUsageError()) {
            return USAGE_ERROR;
        } else {
            String errorCodeStr = "UNKNOWN";
            if (nativeErrorCode instanceof AuthorizeErrorCode) {
                AuthorizeErrorCode authErrorCode = (AuthorizeErrorCode)nativeErrorCode;
                switch(authErrorCode) {
                    case NO_NETWORK:
                        errorCodeStr = AUTHORIZE_NO_NETWORK;
                        break;
                }
            } else if (nativeErrorCode instanceof CheckoutErrorCode) {
                CheckoutErrorCode checkoutErrorCode = (CheckoutErrorCode)nativeErrorCode;
                switch(checkoutErrorCode) {
                    case CANCELED:
                        errorCodeStr = CHECKOUT_CANCELED;
                        break;
                    case SDK_NOT_AUTHORIZED:
                        errorCodeStr = CHECKOUT_SDK_NOT_AUTHORIZED;
                        break;
                }
            } else if (nativeErrorCode instanceof ReaderSettingsErrorCode) {
                ReaderSettingsErrorCode readerSettingsErrorCode = (ReaderSettingsErrorCode)nativeErrorCode;
                switch(readerSettingsErrorCode) {
                    case SDK_NOT_AUTHORIZED:
                        errorCodeStr = READER_SETTINGS_SDK_NOT_AUTHORIZED;
                        break;
                }
            }
            return errorCodeStr;
        }
    }

    static private String getErrorMessage(ResultError<?> error) {
        if (BuildConfig.DEBUG) {
            return error.getDebugMessage();
        }
        return error.getMessage();
    }
}
