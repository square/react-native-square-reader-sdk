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
import CheckoutParams from '../models/CheckoutParams';
import ValidateCheckoutParameters from '../utils';

let checkoutParams:CheckoutParams;

describe('Test ValidateCheckoutParameters', () => {
  beforeEach(() => {
    checkoutParams = {
      amountMoney: {
        amount: 100,
        currencyCode: 'USD', // optional, use authorized location's currency code by default
      },
      // Optional for all following configuration
      skipReceipt: false,
      collectSignature: true,
      allowSplitTender: false,
      delayCapture: false,
      note: 'Hello 💳 💰 World!',
      tipSettings: {
        showCustomTipField: true,
        showSeparateTipScreen: false,
        tipPercentages: [15, 20, 30],
      },
      additionalPaymentTypes: ['cash', 'manual_card_entry', 'other'],
    };
  });

  it('returns when checkoutParams pass validation', () => {
    expect(ValidateCheckoutParameters(checkoutParams)).toBeUndefined();
  });

  it('throws if checkoutParams is null', () => {
    checkoutParams = null;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'checkoutParams' is undefined or null");
  });

  it('throws if amountMoney is null', () => {
    checkoutParams.amountMoney = null;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'amountMoney' is missing or not an object");
  });
});
