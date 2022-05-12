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
package com.squareup.sdk.reader.react.internal.converter;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.squareup.sdk.reader.authorization.Location;

public final class LocationConverter {
    private final MoneyConverter moneyConverter;

    public LocationConverter() {
        moneyConverter = new MoneyConverter();
    }

    public WritableMap toJSObject(Location location) {
        WritableMap mapToReturn = new WritableNativeMap();
        mapToReturn.putString("locationId", location.getLocationId());
        mapToReturn.putString("name", location.getName());
        mapToReturn.putString("businessName", location.getBusinessName());
        mapToReturn.putBoolean("isCardProcessingActivated", location.isCardProcessingActivated());
        mapToReturn.putMap("minimumCardPaymentAmountMoney", moneyConverter.toJSObject(location.getMinimumCardPaymentAmountMoney()));
        mapToReturn.putMap("maximumCardPaymentAmountMoney", moneyConverter.toJSObject(location.getMaximumCardPaymentAmountMoney()));
        mapToReturn.putString("currencyCode", location.getCurrencyCode().name());

        return mapToReturn;
    }
}
