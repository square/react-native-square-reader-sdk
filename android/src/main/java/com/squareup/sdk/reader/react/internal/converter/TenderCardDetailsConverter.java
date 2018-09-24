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

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.squareup.sdk.reader.checkout.TenderCardDetails;
import java.util.HashMap;
import java.util.Map;

class TenderCardDetailsConverter {
    private static final Map<TenderCardDetails.EntryMethod, String> entryMethodStringMap;

    static {
        entryMethodStringMap = new HashMap<>();
        for (TenderCardDetails.EntryMethod method : TenderCardDetails.EntryMethod.values()) {
            switch (method) {
                case MANUALLY_ENTERED:
                    entryMethodStringMap.put(method, "MANUALLY_ENTERED");
                    break;
                case SWIPE:
                    entryMethodStringMap.put(method, "SWIPE");
                    break;
                case CHIP:
                    entryMethodStringMap.put(method, "CHIP");
                    break;
                case CONTACTLESS:
                    entryMethodStringMap.put(method, "CONTACTLESS");
                    break;
                default:
                    throw new RuntimeException("Unexpected entry method: " + method.name());
            }
        }

    }
    private final CardConverter cardConverter;

    public TenderCardDetailsConverter(){
        cardConverter = new CardConverter();
    }

    public WritableMap toJSObject(TenderCardDetails tenderCardDetails) {
        WritableMap mapToReturn = new WritableNativeMap();
        mapToReturn.putString("entryMethod", entryMethodStringMap.get(tenderCardDetails.getEntryMethod()));
        mapToReturn.putMap("card", cardConverter.toJSObject(tenderCardDetails.getCard()));
        return mapToReturn;
    }
}
