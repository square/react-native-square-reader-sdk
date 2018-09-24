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
package com.squareup.sdk.reader.react.internal.converter;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.squareup.sdk.reader.checkout.CheckoutResult;
import com.squareup.sdk.reader.checkout.Money;
import com.squareup.sdk.reader.checkout.Tender;
import com.squareup.sdk.reader.react.internal.DateFormatUtils;

public class CheckoutResultConverter {
    private final MoneyConverter moneyConverter;
    private final TenderConverter tenderConverter;

    public CheckoutResultConverter() {
        moneyConverter = new MoneyConverter();
        tenderConverter = new TenderConverter();
    }

    public WritableMap toJSObject(CheckoutResult result) {
        WritableMap mapToReturn = new WritableNativeMap();
        if (result.getTransactionId() != null) {
            mapToReturn.putString("transactionId", result.getTransactionId());
        }
        mapToReturn.putString("transactionClientId", result.getTransactionClientId());
        mapToReturn.putString("locationId", result.getLocationId());
        mapToReturn.putString("createdAt", DateFormatUtils.formatISO8601UTC(result.getCreatedAt()));
        Money totalMoney = result.getTotalMoney();
        mapToReturn.putMap("totalMoney", moneyConverter.toJSObject(totalMoney));
        Money totalTipMoney = result.getTotalTipMoney();
        mapToReturn.putMap("totalTipMoney", moneyConverter.toJSObject(totalTipMoney));

        WritableArray jsTenders = new WritableNativeArray();
        for (Tender tender : result.getTenders()) {
            jsTenders.pushMap(tenderConverter.toJSObject(tender));
        }
        mapToReturn.putArray("tenders", jsTenders);

        return mapToReturn;
    }
}
