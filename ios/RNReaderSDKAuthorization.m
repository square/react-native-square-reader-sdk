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

#import "RNReaderSDKAuthorization.h"
#import "RNReaderSDKErrorUtilities.h"
#import "Converters/SQRDLocation+RNReaderSDKAdditions.h"

// Define all the error codes and messages below
// These error codes and messages **MUST** align with iOS error codes and javascript error codes
// Search KEEP_IN_SYNC_AUTHORIZE_ERROR to update all places

// Expected errors:
static NSString *const RNReaderSDKAuthorizeNoNetwork = @"AUTHORIZE_NO_NETWORK";

// React native module debug error codes
static NSString *const RNReaderSDKRNAuthLocationNotAuthorized = @"rn_auth_location_not_authorized";

// react native module debug messages
static NSString *const RNReaderSDKRNMessageAuthLocationNotAuthorized = @"This device must be authorized with a Square location in order to get that location. Obtain an authorization code for a Square location from the mobile/authorization-code endpoint and then call authorizeAsync.";


@implementation RNReaderSDKAuthorization

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(authorize,
                 authCode
                 : (NSString *)authCode
                     authorizeWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [SQRDReaderSDK.sharedSDK authorizeWithCode:authCode
                                 completionHandler:^(SQRDLocation *_Nullable location, NSError *_Nullable error) {
                                     if (error != nil) {
                                         NSString *message = error.localizedDescription;
                                         NSString *debugCode = error.userInfo[SQRDErrorDebugCodeKey];
                                         NSString *debugMessage = error.userInfo[SQRDErrorDebugMessageKey];
                                         reject([self _authorizationErrorCodeFromNativeErrorCode:error.code],
                                                [RNReaderSDKErrorUtilities serializeErrorToJson:debugCode message:message debugMessage:debugMessage],
                                                error);
                                         return;
                                     }
                                     resolve([location jsonDictionary]);
                                 }];
    });
}

RCT_REMAP_METHOD(deauthorize,
                 deauthorizeWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [SQRDReaderSDK.sharedSDK deauthorizeWithCompletionHandler:^(NSError *_Nullable error) {
            if (error != nil) {
                NSString *message = error.localizedDescription;
                NSString *debugCode = error.userInfo[SQRDErrorDebugCodeKey];
                NSString *debugMessage = error.userInfo[SQRDErrorDebugMessageKey];
                reject(RNReaderSDKUsageError,
                       [RNReaderSDKErrorUtilities serializeErrorToJson:debugCode message:message debugMessage:debugMessage],
                       error);
                return;
            }
            resolve([NSNull null]);
        }];
    });
}

RCT_REMAP_METHOD(isAuthorized,
                 isAuthorizedWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        resolve(@(SQRDReaderSDK.sharedSDK.isAuthorized));
    });
}

RCT_REMAP_METHOD(isAuthorizationInProgress,
                 isAuthorizationInProgressWithResolver
                 : (RCTPromiseResolveBlock)resolve
                 rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        resolve(@(SQRDReaderSDK.sharedSDK.isAuthorizationInProgress));
    });
}

RCT_REMAP_METHOD(authorizedLocation,
                 authorizedLocationWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (SQRDReaderSDK.sharedSDK.isAuthorized) {
            resolve([SQRDReaderSDK.sharedSDK.authorizedLocation jsonDictionary]);
        } else {
            reject(RNReaderSDKUsageError, [RNReaderSDKErrorUtilities createNativeModuleError:RNReaderSDKRNAuthLocationNotAuthorized debugMessage:RNReaderSDKRNMessageAuthLocationNotAuthorized], nil);
        }
    });
}

RCT_REMAP_METHOD(canDeauthorize,
                 canDeauthorizeWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        resolve(@(SQRDReaderSDK.sharedSDK.canDeauthorize));
    });
}

- (NSString *)_authorizationErrorCodeFromNativeErrorCode:(NSInteger)nativeErrorCode
{
    NSString *errorCode = @"UNKNOWN";
    if (nativeErrorCode == SQRDAuthorizationErrorUsageError) {
        errorCode = RNReaderSDKUsageError;
    } else {
        switch (nativeErrorCode) {
            case SQRDAuthorizationErrorNoNetworkConnection:
                errorCode = RNReaderSDKAuthorizeNoNetwork;
                break;
        }
    }
    return errorCode;
}

@end
