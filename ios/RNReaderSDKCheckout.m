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

#import "RNReaderSDKCheckout.h"
#import "RNReaderSDKErrorUtilities.h"
#import "Converters/SQRDCheckoutResult+RNReaderSDKAdditions.h"


@interface RNReaderSDKCheckout ()

@property (strong, readwrite) RCTPromiseResolveBlock checkoutResolver;
@property (strong, readwrite) RCTPromiseRejectBlock checkoutRejecter;

@end

// Define all the error codes and messages below
// These error codes and messages **MUST** align with iOS error codes and javascript error codes
// Search KEEP_IN_SYNC_CHECKOUT_ERROR to update all places

// Expected errors:
static NSString *const RNReaderSDKCheckoutCancelled = @"CHECKOUT_CANCELED";
static NSString *const RNReaderSDKCheckoutSdkNotAuthorized = @"CHECKOUT_SDK_NOT_AUTHORIZED";

// React native module debug error codes
static NSString *const RNReaderSDKRNCheckoutAlreadyInProgress = @"rn_checkout_already_in_progress";
static NSString *const RNReaderSDKRNCheckoutInvalidParameter = @"rn_checkout_invalid_parameter";

// react native module debug messages
static NSString *const RNReaderSDKRNMessageCheckoutAlreadyInProgress = @"A checkout operation is already in progress. Ensure that the in-progress checkout is completed before calling startCheckoutAsync again.";
static NSString *const RNReaderSDKRNMessageCheckoutInvalidParameter = @"Invalid parameter found in checkout parameters.";


@implementation RNReaderSDKCheckout

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(startCheckout,
                 jsCheckoutParameters
                 : (NSDictionary *)jsParams
                     startCheckoutWithResolver
                 : (RCTPromiseResolveBlock)resolve
                     rejecter
                 : (RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.checkoutResolver != nil) {
            reject(RNReaderSDKUsageError, [RNReaderSDKErrorUtilities createNativeModuleError:RNReaderSDKRNCheckoutAlreadyInProgress debugMessage:RNReaderSDKRNMessageCheckoutAlreadyInProgress], nil);
            return;
        }
        NSString *paramError = nil;
        if ([self _validateJSCheckoutParameters:jsParams errorMsg:&paramError] == NO) {
            NSString *paramErrorDebugMessage = [NSString stringWithFormat:@"%@ %@", RNReaderSDKRNMessageCheckoutInvalidParameter, paramError];
            reject(RNReaderSDKUsageError, [RNReaderSDKErrorUtilities createNativeModuleError:RNReaderSDKRNCheckoutInvalidParameter debugMessage:paramErrorDebugMessage], nil);
            return;
        }
        NSDictionary *jsAmountMoney = jsParams[@"amountMoney"];
        SQRDMoney *amountMoney = nil;
        if (jsAmountMoney[@"currencyCode"]) {
            amountMoney = [[SQRDMoney alloc] initWithAmount:[jsAmountMoney[@"amount"] longValue] currencyCode:SQRDCurrencyCodeMake(jsAmountMoney[@"currencyCode"])];
        } else {
            amountMoney = [[SQRDMoney alloc] initWithAmount:[jsAmountMoney[@"amount"] longValue]];
        }

        SQRDCheckoutParameters *checkoutParams = [[SQRDCheckoutParameters alloc] initWithAmountMoney:amountMoney];
        if (jsParams[@"note"]) {
            checkoutParams.note = jsParams[@"note"];
        }
        if (jsParams[@"skipReceipt"]) {
            checkoutParams.skipReceipt = [jsParams[@"skipReceipt"] boolValue];
        }
        if (jsParams[@"collectSignature"]) {
            checkoutParams.collectSignature = [jsParams[@"collectSignature"] boolValue];
        }
        if (jsParams[@"allowSplitTender"]) {
            checkoutParams.allowSplitTender = [jsParams[@"allowSplitTender"] boolValue];
        }
        if (jsParams[@"delayCapture"]) {
            checkoutParams.delayCapture = [jsParams[@"delayCapture"] boolValue];
        }
        if (jsParams[@"tipSettings"]) {
            SQRDTipSettings *tipSettings = [self _buildTipSettings:jsParams[@"tipSettings"]];
            checkoutParams.tipSettings = tipSettings;
        }
        if (jsParams[@"additionalPaymentTypes"]) {
            checkoutParams.additionalPaymentTypes = [self _buildAdditionalPaymentTypes:jsParams[@"additionalPaymentTypes"]];
        }
        SQRDCheckoutController *checkoutController = [[SQRDCheckoutController alloc] initWithParameters:checkoutParams delegate:self];

        self.checkoutResolver = resolve;
        self.checkoutRejecter = reject;
        UIViewController *rootViewController = UIApplication.sharedApplication.delegate.window.rootViewController;
        [checkoutController presentFromViewController:rootViewController];
    });
}

- (void)checkoutController:(SQRDCheckoutController *)checkoutController didFinishCheckoutWithResult:(SQRDCheckoutResult *)result
{
    self.checkoutResolver([result jsonDictionary]);
    [self _clearCheckoutHooks];
}

- (void)checkoutController:(SQRDCheckoutController *)checkoutController didFailWithError:(NSError *)error
{
    NSString *message = error.localizedDescription;
    NSString *debugCode = error.userInfo[SQRDErrorDebugCodeKey];
    NSString *debugMessage = error.userInfo[SQRDErrorDebugMessageKey];
    self.checkoutRejecter([self _checkoutErrorCodeFromNativeErrorCode:error.code],
                          [RNReaderSDKErrorUtilities serializeErrorToJson:debugCode message:message debugMessage:debugMessage],
                          error);
    [self _clearCheckoutHooks];
}

- (void)checkoutControllerDidCancel:(SQRDCheckoutController *)checkoutController
{
    // Return transaction cancel as an error in order to align with Android implementation
    self.checkoutRejecter(RNReaderSDKCheckoutCancelled, [RNReaderSDKErrorUtilities createNativeModuleError:RNReaderSDKCheckoutCancelled debugMessage:@"The user canceled the transaction."], nil);
    [self _clearCheckoutHooks];
}

- (void)_clearCheckoutHooks
{
    self.checkoutResolver = nil;
    self.checkoutRejecter = nil;
}

- (BOOL)_validateJSCheckoutParameters:(NSDictionary *)jsCheckoutParameters errorMsg:(NSString **)errorMsg
{
    // check types of all parameters
    if (!jsCheckoutParameters[@"amountMoney"] || ![jsCheckoutParameters[@"amountMoney"] isKindOfClass:[NSDictionary class]]) {
        *errorMsg = @"'amountMoney' is missing or not an object";
        return NO;
    }
    if (jsCheckoutParameters[@"skipReceipt"] && ![jsCheckoutParameters[@"skipReceipt"] isKindOfClass:[NSNumber class]]) {
        *errorMsg = @"'skipReceipt' is not a boolean";
        return NO;
    }
    if (jsCheckoutParameters[@"collectSignature"] && ![jsCheckoutParameters[@"collectSignature"] isKindOfClass:[NSNumber class]]) {
        *errorMsg = @"'collectSignature' is not a boolean";
        return NO;
    }
    if (jsCheckoutParameters[@"allowSplitTender"] && ![jsCheckoutParameters[@"allowSplitTender"] isKindOfClass:[NSNumber class]]) {
        *errorMsg = @"'allowSplitTender' is not a boolean";
        return NO;
    }
    if (jsCheckoutParameters[@"delayCapture"] && ![jsCheckoutParameters[@"delayCapture"] isKindOfClass:[NSNumber class]]) {
        *errorMsg = @"'delayCapture' is not a boolean";
        return NO;
    }
    if (jsCheckoutParameters[@"note"] && ![jsCheckoutParameters[@"note"] isKindOfClass:[NSString class]]) {
        *errorMsg = @"'note' is not a string";
        return NO;
    }
    if (jsCheckoutParameters[@"tipSettings"] && ![jsCheckoutParameters[@"tipSettings"] isKindOfClass:[NSDictionary class]]) {
        *errorMsg = @"'tipSettings' is not an object";
        return NO;
    }
    if (jsCheckoutParameters[@"additionalPaymentTypes"] && ![jsCheckoutParameters[@"additionalPaymentTypes"] isKindOfClass:[NSArray class]]) {
        *errorMsg = @"'additionalPaymentTypes' is not an array";
        return NO;
    }

    // check amountMoney
    NSDictionary *amountMoney = jsCheckoutParameters[@"amountMoney"];
    if (!amountMoney[@"amount"] || ![amountMoney[@"amount"] isKindOfClass:[NSNumber class]]) {
        *errorMsg = @"'amount' is not an integer";
        return NO;
    }
    if (amountMoney[@"currencyCode"] && ![amountMoney[@"currencyCode"] isKindOfClass:[NSString class]]) {
        *errorMsg = @"'currencyCode' is not a string";
        return NO;
    }

    // check tipSettings
    NSDictionary *tipSettings = jsCheckoutParameters[@"tipSettings"];
    if (tipSettings != nil) {
        if ((tipSettings[@"showCustomTipField"] && ![tipSettings[@"showCustomTipField"] isKindOfClass:[NSNumber class]])) {
            *errorMsg = @"'showCustomTipField' is not a boolean";
            return NO;
        }
        if (tipSettings[@"showSeparateTipScreen"] && ![tipSettings[@"showSeparateTipScreen"] isKindOfClass:[NSNumber class]]) {
            *errorMsg = @"'showSeparateTipScreen' is not a boolean";
            return NO;
        }
        if (tipSettings[@"tipPercentages"] && ![tipSettings[@"tipPercentages"] isKindOfClass:[NSArray class]]) {
            *errorMsg = @"'tipPercentages' is not an array";
            return NO;
        }
    }

    return YES;
}

- (SQRDTipSettings *)_buildTipSettings:(NSDictionary *)tipSettingConfig
{
    SQRDTipSettings *tipSettings = [[SQRDTipSettings alloc] init];
    if (tipSettingConfig[@"showCustomTipField"]) {
        tipSettings.showCustomTipField = [tipSettingConfig[@"showCustomTipField"] boolValue];
    }
    if (tipSettingConfig[@"showSeparateTipScreen"]) {
        tipSettings.showSeparateTipScreen = [tipSettingConfig[@"showSeparateTipScreen"] boolValue];
    }
    if (tipSettingConfig[@"tipPercentages"]) {
        NSMutableArray *tipPercentages = [[NSMutableArray alloc] init];
        for (NSNumber *percentage in tipSettingConfig[@"tipPercentages"]) {
            // Workaround - React native 0.58+ cannot convert integer array to a NSArray<NSNumber *> correctly
            // so that we have to explicity convert the integer value
            [tipPercentages addObject:@([percentage intValue])];
        }
        tipSettings.tipPercentages = tipPercentages;
    }

    return tipSettings;
}

- (SQRDAdditionalPaymentTypes)_buildAdditionalPaymentTypes:(NSArray *)additionalPaymentTypes
{
    SQRDAdditionalPaymentTypes sqrdAdditionalPaymentTypes = 0;
    for (NSString *typeName in additionalPaymentTypes) {
        if ([typeName isEqualToString:@"cash"]) {
            sqrdAdditionalPaymentTypes |= SQRDAdditionalPaymentTypeCash;
        } else if ([typeName isEqualToString:@"manual_card_entry"]) {
            sqrdAdditionalPaymentTypes |= SQRDAdditionalPaymentTypeManualCardEntry;
        } else if ([typeName isEqualToString:@"other"]) {
            sqrdAdditionalPaymentTypes |= SQRDAdditionalPaymentTypeOther;
        }
    }

    return sqrdAdditionalPaymentTypes;
}

- (NSString *)_checkoutErrorCodeFromNativeErrorCode:(NSInteger)nativeErrorCode
{
    NSString *errorCode = @"UNKNOWN";
    if (nativeErrorCode == SQRDCheckoutControllerErrorUsageError) {
        errorCode = RNReaderSDKUsageError;
    } else {
        switch (nativeErrorCode) {
            case SQRDCheckoutControllerErrorSDKNotAuthorized:
                errorCode = RNReaderSDKCheckoutSdkNotAuthorized;
                break;
        }
    }
    return errorCode;
}

@end
