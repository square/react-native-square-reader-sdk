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

#import "RNReaderSDKErrorUtilities.h"
@import SquareReaderSDK;

// Usage error
NSString *const RNReaderSDKUsageError = @"USAGE_ERROR";


@implementation RNReaderSDKErrorUtilities

+ (NSString *)createNativeModuleError:(NSString *)nativeModuleErrorCode debugMessage:(NSString *)debugMessage
{
    return [self serializeErrorToJson:nativeModuleErrorCode
                              message:[NSString stringWithFormat:@"Something went wrong. Please contact the developer of this application and provide them with this error code: %@", nativeModuleErrorCode]
                         debugMessage:debugMessage];
}

+ (NSString *)serializeErrorToJson:(NSString *)debugCode message:(NSString *)message debugMessage:(NSString *)debugMessage
{
    NSMutableDictionary *errObject = [[NSMutableDictionary alloc] init];
    errObject[@"debugCode"] = debugCode;
    errObject[@"message"] = message;
    errObject[@"debugMessage"] = debugMessage;
    NSError *writeError = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:errObject options:NSJSONWritingPrettyPrinted error:&writeError];
    if (jsonData) {
        return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    } else {
        return [NSString stringWithFormat:@"{'message': '%@'}",
                                          @"failed to serialize error"];
    }
}
@end
