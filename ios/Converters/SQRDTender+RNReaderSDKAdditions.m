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

#import "SQRDTender+RNReaderSDKAdditions.h"
#import "SQRDMoney+RNReaderSDKAdditions.h"
#import "SQRDTenderCardDetails+RNReaderSDKAdditions.h"
#import "SQRDTenderCashDetails+RNReaderSDKAdditions.h"
#import "RNReaderSDKDateFormatter.h"


@implementation SQRDTender (RNReaderSDKAdditions)

- (NSMutableDictionary *)jsonDictionary;
{
    NSMutableDictionary *jsTenderResult = [[NSMutableDictionary alloc] init];
    jsTenderResult[@"createdAt"] = [RNReaderSDKDateFormatter iso8601StringFromDate:self.createdAt];
    jsTenderResult[@"tipMoney"] = [self.tipMoney jsonDictionary];
    jsTenderResult[@"totalMoney"] = [self.totalMoney jsonDictionary];

    NSString *jsTenderType = nil;
    switch (self.type) {
        case SQRDTenderTypeCard:
            jsTenderType = @"card";
            jsTenderResult[@"tenderId"] = self.tenderID;
            jsTenderResult[@"cardDetails"] = [self.cardDetails jsonDictionary];
            break;
        case SQRDTenderTypeCash:
            jsTenderType = @"cash";
            jsTenderResult[@"cashDetails"] = [self.cashDetails jsonDictionary];
            break;
        case SQRDTenderTypeOther:
            jsTenderType = @"other";
            break;
    }
    jsTenderResult[@"type"] = jsTenderType;
    return jsTenderResult;
}

@end
