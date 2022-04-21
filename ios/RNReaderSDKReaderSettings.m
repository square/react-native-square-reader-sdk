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

#import "RNReaderSDKReaderSettings.h"
#import "RNReaderSDKErrorUtilities.h"


@interface RNReaderSDKReaderSettings ()

@property (strong, readwrite) RCTPromiseResolveBlock readerSettingResolver;
@property (strong, readwrite) RCTPromiseRejectBlock readerSettingRejecter;

@end

// Define all the error codes and messages below
// These error codes and messages **MUST** align with iOS error codes and javascript error codes
// Search KEEP_IN_SYNC_READER_SETTINGS_ERROR to update all places

// Expected errors:
static NSString *const RNReaderSDKReaderSettingsSdkNotAuthorized = @"READER_SETTINGS_SDK_NOT_AUTHORIZED";

// React native module debug error codes
static NSString *const RNReaderSDKRNReaderSettingsAlreadyInProgress = @"rn_reader_settings_already_in_progress";

// react native module debug messages
static NSString *const RNReaderSDKRNMessageReaderSettingsAlreadyInProgress = @"A reader settings operation is already in progress. Ensure that the in-progress reader settings is completed before calling startReaderSettingsAsync again.";


@implementation RNReaderSDKReaderSettings

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(startReaderSettings,
                 startReaderSettingsWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.readerSettingResolver != nil) {
            reject(RNReaderSDKUsageError, [RNReaderSDKErrorUtilities createNativeModuleError:RNReaderSDKRNReaderSettingsAlreadyInProgress debugMessage:RNReaderSDKRNMessageReaderSettingsAlreadyInProgress], nil);
            return;
        }
        SQRDReaderSettingsController *readerSettingsController = [[SQRDReaderSettingsController alloc] initWithDelegate:self];
        self.readerSettingResolver = resolve;
        self.readerSettingRejecter = reject;
        UIViewController *rootViewController = UIApplication.sharedApplication.delegate.window.rootViewController;
        [readerSettingsController presentFromViewController:rootViewController];
    });
}

- (void)readerSettingsControllerDidPresent:(SQRDReaderSettingsController *)readerSettingsController
{
    self.readerSettingResolver([NSNull null]);
    [self clearReaderSettingHooks];
}

- (void)readerSettingsController:(SQRDReaderSettingsController *)readerSettingsController didFailToPresentWithError:(NSError *)error
{
    NSString *message = error.localizedDescription;
    NSString *debugCode = error.userInfo[SQRDErrorDebugCodeKey];
    NSString *debugMessage = error.userInfo[SQRDErrorDebugMessageKey];
    self.readerSettingRejecter([self _readerSettingsErrorCodeFromNativeErrorCode:error.code],
                               [RNReaderSDKErrorUtilities serializeErrorToJson:debugCode message:message debugMessage:debugMessage],
                               error);
    [self clearReaderSettingHooks];
}

- (void)clearReaderSettingHooks
{
    self.readerSettingResolver = nil;
    self.readerSettingRejecter = nil;
}

- (NSString *)_readerSettingsErrorCodeFromNativeErrorCode:(NSInteger)nativeErrorCode
{
    NSString *errorCode = @"UNKNOWN";
    if (nativeErrorCode == SQRDReaderSettingsControllerErrorUsageError) {
        errorCode = RNReaderSDKUsageError;
    } else {
        switch (nativeErrorCode) {
            case SQRDReaderSettingsControllerErrorSDKNotAuthorized:
                errorCode = RNReaderSDKReaderSettingsSdkNotAuthorized;
                break;
        }
    }
    return errorCode;
}

@end
