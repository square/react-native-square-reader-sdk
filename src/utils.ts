/*
 Copyright 2019 Square Inc.

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

import AmountMoney from "./models/AmountMoney";
import CheckoutParams from "./models/CheckoutParams";
import ErrorDetails from "./models/ErrorDetails";
import TipSettings from "./models/TipSettings";

function hasNonNullProperty(obj, property) {
  if (Object.prototype.hasOwnProperty.call(obj, property) && typeof obj[property] !== 'undefined' && obj[property] !== null) {
    return true;
  }
  return false;
}

export default function ValidateCheckoutParameters(checkoutParams:CheckoutParams) {
  let paramError:ErrorDetails = {
    debugMessage : 'Invalid parameter found in checkout parameters. ',
    message : 'Something went wrong. Please contact the developer of this application and provide them with this error code: rn_checkout_invalid_parameter'
  };
  paramError.debugCode = 'rn_checkout_invalid_parameter';
  if (!checkoutParams) {
    paramError.debugMessage += "'checkoutParams' is undefined or null";
    throw new Error(JSON.stringify(paramError));
  }
  if (!hasNonNullProperty(checkoutParams, 'amountMoney') || typeof checkoutParams.amountMoney !== 'object') {
    paramError.debugMessage += "'amountMoney' is missing or not an object";
    throw new Error(JSON.stringify(paramError));
  } else if (hasNonNullProperty(checkoutParams, 'skipReceipt') && typeof checkoutParams.skipReceipt !== 'boolean') {
    paramError.debugMessage += "'skipReceipt' is not a boolean";
    throw new Error(JSON.stringify(paramError));
  } else if (hasNonNullProperty(checkoutParams, 'collectSignature') && typeof checkoutParams.collectSignature !== 'boolean') {
    paramError.debugMessage += "'collectSignature' is not a boolean";
    throw new Error(JSON.stringify(paramError));
  } else if (hasNonNullProperty(checkoutParams, 'allowSplitTender') && typeof checkoutParams.allowSplitTender !== 'boolean') {
    paramError.debugMessage += "'allowSplitTender' is not a boolean";
    throw new Error(JSON.stringify(paramError));
  } else if (hasNonNullProperty(checkoutParams, 'delayCapture') && typeof checkoutParams.delayCapture !== 'boolean') {
    paramError.debugMessage += "'delayCapture' is not a boolean";
    throw new Error(JSON.stringify(paramError));
  } else if (hasNonNullProperty(checkoutParams, 'note') && typeof checkoutParams.note !== 'string') {
    paramError.debugMessage += "'note' is not a string";
    throw new Error(JSON.stringify(paramError));
  } else if (hasNonNullProperty(checkoutParams, 'tipSettings') && typeof checkoutParams.tipSettings !== 'object') {
    paramError.debugMessage += "'tipSettings' is not an object";
    throw new Error(JSON.stringify(paramError));
  } else if (hasNonNullProperty(checkoutParams, 'additionalPaymentTypes') && !Array.isArray(checkoutParams.additionalPaymentTypes)) {
    paramError.debugMessage += "'additionalPaymentTypes' is not an array";
    throw new Error(JSON.stringify(paramError));
  }

  // check amountMoney
  const amountMoney:AmountMoney = checkoutParams.amountMoney;
  if (!hasNonNullProperty(amountMoney, 'amount') || typeof amountMoney.amount !== 'number') {
    paramError.debugMessage += "'amount' is not an integer";
    throw new Error(JSON.stringify(paramError));
  }
  if (hasNonNullProperty(amountMoney, 'currencyCode') && typeof amountMoney.currencyCode !== 'string') {
    paramError.debugMessage += "'currencyCode' is not a String";
    throw new Error(JSON.stringify(paramError));
  }

  if (hasNonNullProperty(checkoutParams, 'tipSettings')) {
    // check tipSettings
    const {tipSettings} = checkoutParams;
    if (hasNonNullProperty(tipSettings, 'showCustomTipField') && typeof tipSettings.showCustomTipField !== 'boolean') {
      paramError.debugMessage += "'showCustomTipField' is not a boolean";
      throw new Error(JSON.stringify(paramError));
    } else if (hasNonNullProperty(tipSettings, 'showSeparateTipScreen') && typeof tipSettings.showSeparateTipScreen !== 'boolean') {
      paramError.debugMessage += "'showSeparateTipScreen' is not a boolean";
      throw new Error(JSON.stringify(paramError));
    } else if (hasNonNullProperty(tipSettings, 'tipPercentages') && !Array.isArray(tipSettings.tipPercentages)) {
      paramError.debugMessage += "'tipPercentages' is not an array";
      throw new Error(JSON.stringify(paramError));
    }
  }
}
