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
package com.squareup.sdk.reader.react.converter;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.squareup.sdk.reader.checkout.CheckoutResult;
import com.squareup.sdk.reader.checkout.Money;
import com.squareup.sdk.reader.checkout.Tender;

    public class CheckoutResultConverter {
    static public WritableMap toJSObject(CheckoutResult result) {
        WritableMap mapToReturn = new WritableNativeMap();
        if (result == null) {
            return mapToReturn;
        }
        mapToReturn.putString("transactionId", result.getTransactionId());
        mapToReturn.putString("transactionClientID", result.getTransactionClientId());
        mapToReturn.putString("locationID", result.getLocationId());
        mapToReturn.putString("createdAt", DateFormatUtilities.formatISO8601UTC(result.getCreatedAt()));
        Money totalMoney = result.getTotalMoney();
        if (totalMoney != null) {
            mapToReturn.putMap("totalMoney", MoneyConverter.toJSObject(totalMoney));
        }
        Money totalTipMoney = result.getTotalTipMoney();
        if (totalTipMoney != null) {
            mapToReturn.putMap("totalTipMoney", MoneyConverter.toJSObject(totalTipMoney));
        }

        WritableArray jsTenders = new WritableNativeArray();
        for (Tender tender : result.getTenders()) {
            jsTenders.pushMap(TenderConverter.toJSObject(tender));
        }
        mapToReturn.putArray("tenders", jsTenders);

        return mapToReturn;
    }
}
