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
import {
  View, Text, Alert, Platform,
  ActionSheetIOS, // eslint-disable-line react-native/split-platform-components
} from 'react-native';
import { withGlobalize } from 'react-native-globalize';

import {
  startCheckoutAsync,
  startReaderSettingsAsync,
  getAuthorizedLocationAsync,
  CheckoutErrorCanceled,
  CheckoutErrorSdkNotAuthorized,
  ReaderSettingsErrorSdkNotAuthorized,
  UsageError,
} from 'react-native-square-reader-sdk';

import CustomButton from '../components/CustomButton';
import SquareLogo from '../components/SquareLogo';
import { defaultStyles } from '../styles/common';

class CheckoutScreen extends Component {
  async componentDidMount() {
    try {
      const authorizedLocation = await getAuthorizedLocationAsync();
      this.setState({ locationName: authorizedLocation.name });
    } catch (ex) {
      if (__DEV__) {
        Alert.alert(ex.debugCode, ex.debugMessage);
      } else {
        Alert.alert(ex.code, ex.message);
      }
    }
  }

  async onCheckout() {
    const { navigate } = this.props.navigation;
    // A checkout parameter is required for this checkout method
    const checkoutParams = {
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
          console.log('transaction canceled.');
          break;
        case CheckoutErrorSdkNotAuthorized:
          // Handle sdk not authorized
          navigate('Deauthorizing');
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

  onSettings() {
    const { navigate } = this.props.navigation;
    if (Platform.OS !== 'ios') {
      navigate('Setting', { locationName: this.state.locationName });
    } else {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Reader Settings', 'Deauthorize', 'Cancel'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
        title: `Location: ${this.state.locationName}`,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          // Handle reader settings
          try {
            await startReaderSettingsAsync();
          } catch (ex) {
            let errorMessage = ex.message;
            switch (ex.code) {
              case ReaderSettingsErrorSdkNotAuthorized:
                // Handle reader settings not authorized
                navigate('Deauthorizing');
                break;
              case UsageError:
              default:
                if (__DEV__) {
                  errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
                  console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`);
                }
                Alert.alert('Error', errorMessage);
                break;
            }
          }
        } else if (buttonIndex === 1) {
          // Handle Deauthorize
          navigate('Deauthorizing');
        }
      });
    }
  }

  render() {
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
            onPress={() => this.onSettings()}
          />
        </View>
      </View>
    );
  }
}

CheckoutScreen.propTypes = {
  globalize: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default withGlobalize(CheckoutScreen);
