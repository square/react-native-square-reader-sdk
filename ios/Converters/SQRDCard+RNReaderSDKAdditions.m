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

#import "SQRDCard+RNReaderSDKAdditions.h"
#import "SQRDTender+RNReaderSDKAdditions.h"
#import "SQRDMoney+RNReaderSDKAdditions.h"
#import "RNReaderSDKDateFormatter.h"


@implementation SQRDCard (RNReaderSDKAdditions)

- (NSDictionary *)jsonDictionary
{
    return @{
        @"brand" : [self _stringForBrand:self.brand],
        @"lastFourDigits" : self.lastFourDigits,
        @"expirationMonth" : self.expirationMonth ?: [NSNull null],
        @"expirationYear" : self.expirationYear ?: [NSNull null],
        @"id" : self.cardID ?: [NSNull null],
        @"cardholderName" : self.cardholderName ?: [NSNull null],
    };
}

- (NSString *) _stringForBrand:(SQRDCardBrand)brand
{
    NSString *result = nil;
    switch(brand) {
        case SQRDCardBrandVisa:
            result = @"VISA";
            break;
        case SQRDCardBrandMastercard:
            result = @"MASTERCARD";
            break;
        case SQRDCardBrandAmericanExpress:
            result = @"AMERICAN_EXPRESS";
            break;
        case SQRDCardBrandDiscover:
            result = @"DISCOVER";
            break;
        case SQRDCardBrandDiscoverDiners:
            result = @"DISCOVER_DINERS";
            break;
        case SQRDCardBrandInterac:
            result = @"INTERAC";
            break;
        case SQRDCardBrandJCB:
            result = @"JCB";
            break;
        case SQRDCardBrandChinaUnionPay:
            result = @"CHINA_UNIONPAY";
            break;
        case SQRDCardBrandSquareGiftCard:
            result = @"SQUARE_GIFT_CARD";
            break;
        case SQRDCardBrandEftpos:
            result = @"EFTPOS";
            break;
        case SQRDCardBrandOtherBrand:
            result = @"OTHER_BRAND";
            break;
    }
    return result;
}

@end
