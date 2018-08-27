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

#import "SQRDLocation+RNReaderSDKAdditions.h"
#import "SQRDMoney+RNReaderSDKAdditions.h"


@implementation SQRDLocation (RNReaderSDKAdditions)

- (NSMutableDictionary *)jsonDictionary
{
    NSMutableDictionary *jsLocationResult = [[NSMutableDictionary alloc] init];
    jsLocationResult[@"locationId"] = self.locationID;
    jsLocationResult[@"name"] = self.name;
    jsLocationResult[@"businessName"] = self.businessName;
    jsLocationResult[@"isCardProcessingActivated"] = [NSNumber numberWithBool:self.isCardProcessingActivated == YES];
    jsLocationResult[@"minimumCardPaymentAmountMoney"] = [self.minimumCardPaymentAmountMoney jsonDictionary];
    jsLocationResult[@"maximumCardPaymentAmountMoney"] = [self.maximumCardPaymentAmountMoney jsonDictionary];
    jsLocationResult[@"currencyCode"] = @(self.currencyCode);
    return jsLocationResult;
}

@end
