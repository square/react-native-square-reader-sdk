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

#import "RNReaderSDKStoreCustomerCard.h"
#import "RNReaderSDKErrorUtilities.h"
#import "Converters/SQRDCard+RNReaderSDKAdditions.h"


@interface RNReaderSDKStoreCustomerCard ()

@property (strong, readwrite) RCTPromiseResolveBlock storeCardResolver;
@property (strong, readwrite) RCTPromiseRejectBlock storeCardRejecter;

@end

// Define all the error codes and messages below
// These error codes and messages **MUST** align with iOS error codes and javascript error codes
// Search KEEP_IN_SYNC_STORE_CUSTOMER_CARD_ERROR to update all places

// Expected errors:
static NSString *const RNReaderSDKStoreCustomerCardCancelled = @"STORE_CUSTOMER_CARD_CANCELED";
static NSString *const RNReaderSDKStoreCustomerCardInvalidCustomerID = @"STORE_CUSTOMER_CARD_INVALID_CUSTOMER_ID";
static NSString *const RNReaderSDKStoreCustomerCardSdkNotAuthorized = @"STORE_CUSTOMER_CARD_SDK_NOT_AUTHORIZED";
static NSString *const RNReaderSDKStoreCustomerCardNoNetwork = @"STORE_CUSTOMER_CARD_NO_NETWORK";

// React native module debug error codes
static NSString *const RNReaderSDKRNStoreCustomerCardAlreadyInProgress = @"rn_add_customer_already_in_progress";

// react native module debug messages
static NSString *const RNReaderSDKRNMessageStoreCustomerCardAlreadyInProgress = @"A store customer card operation is already in progress. Ensure that the in-progress store customer card is completed before calling startStoreCardAsync again.";


@implementation RNReaderSDKStoreCustomerCard

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(startStoreCard,
                 customerID
                 : (NSString *)customerID
                     startStoreCardWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.storeCardResolver != nil) {
            reject(RNReaderSDKUsageError, [RNReaderSDKErrorUtilities createNativeModuleError:RNReaderSDKRNStoreCustomerCardAlreadyInProgress debugMessage:RNReaderSDKRNMessageStoreCustomerCardAlreadyInProgress], nil);
            return;
        }

        SQRDStoreCustomerCardController *storeCustomerCardContorller = [[SQRDStoreCustomerCardController alloc] initWithCustomerID:customerID delegate:self];

        self.storeCardResolver = resolve;
        self.storeCardRejecter = reject;
        UIViewController *rootViewController = UIApplication.sharedApplication.delegate.window.rootViewController;
        [storeCustomerCardContorller presentFromViewController:rootViewController];
    });
}

- (void)storeCustomerCardController:(SQRDStoreCustomerCardController *)storeCustomerCardController didFinishWithCard:(nonnull SQRDCard *)card
{
    self.storeCardResolver([card jsonDictionary]);
    [self clearStoreCardHooks];
}

- (void)storeCustomerCardController:(SQRDStoreCustomerCardController *)storeCustomerCardController didFailWithError:(NSError *)error
{
    NSString *message = error.localizedDescription;
    NSString *debugCode = error.userInfo[SQRDErrorDebugCodeKey];
    NSString *debugMessage = error.userInfo[SQRDErrorDebugMessageKey];
    self.storeCardRejecter([self getStoreCardErrorCode:error.code],
                           [RNReaderSDKErrorUtilities serializeErrorToJson:debugCode message:message debugMessage:debugMessage],
                           error);
    [self clearStoreCardHooks];
}

- (void)storeCustomerCardControllerDidCancel:(SQRDStoreCustomerCardController *)storeCustomerCardController
{
    // Return transaction cancel as an error in order to align with Android implementation
    self.storeCardRejecter(RNReaderSDKStoreCustomerCardCancelled, [RNReaderSDKErrorUtilities createNativeModuleError:RNReaderSDKStoreCustomerCardCancelled debugMessage:@"The user canceled the transaction."], nil);
    [self clearStoreCardHooks];
}

- (void)clearStoreCardHooks
{
    self.storeCardResolver = nil;
    self.storeCardRejecter = nil;
}


- (NSString *)getStoreCardErrorCode:(NSInteger)nativeErrorCode
{
    NSString *errorCode = @"UNKNOWN";
    if (nativeErrorCode == SQRDStoreCustomerCardControllerErrorUsageError) {
        errorCode = RNReaderSDKUsageError;
    } else {
        switch (nativeErrorCode) {
            case SQRDStoreCustomerCardControllerErrorInvalidCustomerID:
                errorCode = RNReaderSDKStoreCustomerCardInvalidCustomerID;
                break;
            case SQRDStoreCustomerCardControllerErrorSDKNotAuthorized:
                errorCode = RNReaderSDKStoreCustomerCardSdkNotAuthorized;
                break;
            case SQRDStoreCustomerCardControllerErrorNoNetworkConnection:
                errorCode = RNReaderSDKStoreCustomerCardNoNetwork;
                break;
        }
    }
    return errorCode;
}

@end
