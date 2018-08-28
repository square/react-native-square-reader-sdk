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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Alert } from 'react-native';
import { withGlobalize } from 'react-native-globalize';

import {
  startCheckoutAsync,
  CheckoutErrorCanceled,
  CheckoutErrorSdkNotAuthorized,
} from 'react-native-square-reader-sdk';

import CustomButton from '../components/CustomButton';
import SquareLogo from '../components/SquareLogo';
import { defaultStyles } from '../styles/common';

class PayScreen extends Component {
  async onCheckout() {
    // A checkout parameter is required for this checkout method
    const checkoutParams = {
      amountMoney: {
        amount: 100,
        currencyCode: 'USD', // optional, use authorized location's currency code by default
      },
      // Optional for all following configuration
      skipReceipt: false,
      alwaysRequireSignature: true,
      allowSplitTender: false,
      note: 'ReaderSDKSample Transaction',
      tipSettings: {
        showCustomTipField: true,
        showSeparateTipScreen: false,
        tipPercentages: [15, 20, 30],
      },
      additionalPaymentTypes: ['cash', 'manual', 'other'],
    };

    try {
      const checkoutResult = await startCheckoutAsync(checkoutParams);
      // Consume checkout result from here
      const currencyFormatter = this.props.globalize.getCurrencyFormatter(
        checkoutResult.totalMoney.currencyCode,
        { minimumFractionDigits: 0, maximumFractionDigits: 2 },
      );
      const formattedCurrency = currencyFormatter(checkoutResult.totalMoney.amount / 100);
      Alert.alert(`${formattedCurrency} Successfully Charged`, 'See the debugger console for transaction details. You can refund transactions from your Square Dashboard.');
      console.log(JSON.stringify(checkoutResult));
    } catch (ex) {
      let errorMessage = ex.message;
      switch (ex.code) {
        case CheckoutErrorCanceled:
          // Handle canceled transaction here
          break;
        case CheckoutErrorSdkNotAuthorized:
          // Handle sdk not authorized
          break;
        default:
          if (__DEV__) {
            errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
            console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`);
          }
          Alert.alert('Error', errorMessage);
          break;
      }
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={defaultStyles.pageContainer}>
        <View style={defaultStyles.logoContainer}>
          <SquareLogo />
        </View>
        <View style={defaultStyles.descriptionContainer}>
          <Text style={defaultStyles.title}>Take a payment.</Text>
        </View>
        <View style={defaultStyles.buttonContainer}>
          <CustomButton
            title="Charge $1.00"
            onPress={() => this.onCheckout()}
            primary
          />
          <CustomButton
            title="Settings"
            onPress={() => navigate('Setting', { location: 'Jane' })
            }
          />
        </View>
      </View>
    );
  }
}

PayScreen.propTypes = {
  globalize: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default withGlobalize(PayScreen);
