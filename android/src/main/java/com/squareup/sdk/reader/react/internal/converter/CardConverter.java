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
import com.squareup.sdk.reader.checkout.Card;
import java.util.HashMap;
import java.util.Map;

public class CardConverter {
    private static final Map<Card.Brand, String> brandStringMap;

    static {
        brandStringMap = new HashMap<>();
        for (Card.Brand brand : Card.Brand.values()) {
            switch(brand) {
                case VISA:
                    brandStringMap.put(brand, "VISA");
                    break;
                case MASTERCARD:
                    brandStringMap.put(brand, "MASTERCARD");
                    break;
                case AMERICAN_EXPRESS:
                    brandStringMap.put(brand, "AMERICAN_EXPRESS");
                    break;
                case DISCOVER:
                    brandStringMap.put(brand, "DISCOVER");
                    break;
                case DISCOVER_DINERS:
                    brandStringMap.put(brand, "DISCOVER_DINERS");
                    break;
                case INTERAC:
                    brandStringMap.put(brand, "INTERAC");
                    break;
                case JCB:
                    brandStringMap.put(brand, "JCB");
                    break;
                case CHINA_UNIONPAY:
                    brandStringMap.put(brand, "CHINA_UNIONPAY");
                    break;
                case SQUARE_GIFT_CARD:
                    brandStringMap.put(brand, "SQUARE_GIFT_CARD");
                    break;
                case EFTPOS:
                    brandStringMap.put(brand, "EFTPOS");
                    break;
                case FELICA:
                    brandStringMap.put(brand, "FELICA");
                    break;
                case OTHER_BRAND:
                    brandStringMap.put(brand, "OTHER_BRAND");
                    break;
                default:
                    // UNKNOWN should never happen if the right Reader SDK version is loaded with plugin
                    // But we choose not break plugin if the type isn't important
                    brandStringMap.put(brand, "UNKNOWN");
            }
        }
    }

    public WritableMap toJSObject(Card card) {
        // We use this "Ignore if null" principle for all returned dictionary
        WritableMap mapToReturn = new WritableNativeMap();
        mapToReturn.putString("brand", brandStringMap.get(card.getBrand()));
        mapToReturn.putString("lastFourDigits", card.getLastFourDigits());
        if (card.getExpirationMonth() != null) {
            mapToReturn.putInt("expirationMonth", card.getExpirationMonth());
        }
        if (card.getExpirationYear() != null) {
            mapToReturn.putInt("expirationYear", card.getExpirationYear());
        }
        if (card.getId() != null) {
            mapToReturn.putString("id", card.getId());
        }
        if (card.getCardholderName() != null) {
            mapToReturn.putString("cardholderName", card.getCardholderName());
        }
        return mapToReturn;
    }
}
