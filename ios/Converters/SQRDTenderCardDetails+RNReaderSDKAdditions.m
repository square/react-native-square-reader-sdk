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

#import "SQRDTenderCardDetails+RNReaderSDKAdditions.h"
#import "SQRDCard+RNReaderSDKAdditions.h"


@implementation SQRDTenderCardDetails (RNReaderSDKAdditions)

- (NSDictionary *)jsonDictionary
{
    return @{
        @"entryMethod" : [self _stringFromTenderCardDetailsEntryMethod:self.entryMethod],
        @"card" : [self.card jsonDictionary],
    };
}

- (NSString *)_stringFromTenderCardDetailsEntryMethod:(SQRDTenderCardDetailsEntryMethod)method
{
    NSString *result = nil;
    switch (method) {
        case SQRDTenderCardDetailsEntryMethodManuallyEntered:
            result = @"MANUALLY_ENTERED";
            break;
        case SQRDTenderCardDetailsEntryMethodSwipe:
            result = @"SWIPE";
            break;
        case SQRDTenderCardDetailsEntryMethodChip:
            result = @"CHIP";
            break;
        case SQRDTenderCardDetailsEntryMethodContactless:
            result = @"CONTACTLESS";
            break;
        case SQRDTenderCardDetailsEntryMethodUnknown:
            result = @"UNKNOWN";
            break;
    }
    return result;
}

@end
