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
import ValidateCheckoutParameters from '../utils';

let checkoutParams = {};

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

  it('throws if skipReceipt is not a boolean', () => {
    checkoutParams.skipReceipt = 1;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'skipReceipt' is not a boolean");
  });

  it('throws if collectSignature is not a boolean', () => {
    checkoutParams.collectSignature = 1;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'collectSignature' is not a boolean");
  });

  it('throws if allowSplitTender is not a boolean', () => {
    checkoutParams.allowSplitTender = 1;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'allowSplitTender' is not a boolean");
  });

  it('throws if delayCapture is not a boolean', () => {
    checkoutParams.delayCapture = 1;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'delayCapture' is not a boolean");
  });

  it('throws if note is not a string', () => {
    checkoutParams.note = 1;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'note' is not a string");
  });

  it('throws if tipSettings is not an object', () => {
    checkoutParams.tipSettings = 1;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'tipSettings' is not an object");
  });

  it('throws if additionalPaymentTypes is not an array', () => {
    checkoutParams.additionalPaymentTypes = {};
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'additionalPaymentTypes' is not an array");
  });

  it('throws if amountMoney.amount is not a number', () => {
    checkoutParams.amountMoney.amount = false;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'amount' is not an integer");
  });

  it('throws if amountMoney.currencyCode is not a string', () => {
    checkoutParams.amountMoney.currencyCode = false;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'currencyCode' is not a String");
  });

  it('throws if tipSettings.showCustomTipField is not a boolean', () => {
    checkoutParams.tipSettings.showCustomTipField = 2;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'showCustomTipField' is not a boolean");
  });

  it('throws if tipSettings.showSeparateTipScreen is not a boolean', () => {
    checkoutParams.tipSettings.showSeparateTipScreen = 1;
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'showSeparateTipScreen' is not a boolean");
  });

  it('throws if tipSettings.tipPercentages is not an array', () => {
    checkoutParams.tipSettings.tipPercentages = {};
    expect(() => {
      ValidateCheckoutParameters(checkoutParams);
    }).toThrow("'tipPercentages' is not an array");
  });
});
