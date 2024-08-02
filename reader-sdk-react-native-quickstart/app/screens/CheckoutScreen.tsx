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

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  Image,
  TouchableOpacity,
  ActionSheetIOS, // eslint-disable-line react-native/split-platform-components
} from 'react-native';

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
import {defaultStyles} from '../styles/common';
const iconImage = require('../components/img/setting.png');

export default function CheckoutScreen({navigation}) {
  const [locationName, setLocationName] = useState('');

  // USEEFFCT METHOD FOR GET AND SET LOCATION DETAILS
  useEffect(() => {
    (async function () {
      try {
        const authorizedLocation = await getAuthorizedLocationAsync();
        setLocationName(authorizedLocation.name);
      } catch (ex: any) {
        if (__DEV__) {
          Alert.alert(ex.debugCode, ex.debugMessage);
        } else {
          Alert.alert(ex.code, ex.message);
        }
      }
    })();
  }, []);

  // ON SETTING CLICK
  const onSettings = () => {
    if (Platform.OS !== 'ios') {
      navigation.navigate('Setting', {locationName: locationName});
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Reader Settings', 'Deauthorize', 'Cancel'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
          title: `Location: ${locationName}`,
        },
        async buttonIndex => {
          if (buttonIndex === 0) {
            // Handle reader settings
            try {
              await startReaderSettingsAsync();
            } catch (ex: any) {
              let errorMessage = ex.message;
              switch (ex.code) {
                case ReaderSettingsErrorSdkNotAuthorized:
                  // Handle reader settings not authorized
                  navigation.navigate('Deauthorizing');
                  break;
                case UsageError:
                default:
                  if (__DEV__) {
                    errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
                    console.log(
                      `${ex.code}:${ex.debugCode}:${ex.debugMessage}`,
                    );
                  }
                  Alert.alert('Error', errorMessage);
                  break;
              }
            }
          } else if (buttonIndex === 1) {
            // Handle Deauthorize
            navigation.navigate('Deauthorizing');
          }
        },
      );
    }
  };

  // ON CHECKOUT CLICK
  const onCheckout = async () => {
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
    } catch (ex: any) {
      let errorMessage = ex.message;
      switch (ex.code) {
        case CheckoutErrorCanceled:
          // Handle canceled transaction here
          console.log('transaction canceled.');
          break;
        case CheckoutErrorSdkNotAuthorized:
          // Handle sdk not authorized
          navigation.navigate('Deauthorizing');
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
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <TouchableOpacity onPress={() => onSettings()}>
        <Image style={defaultStyles.settingIconStyle} source={iconImage} />
      </TouchableOpacity>
      <View style={defaultStyles.logoContainer}>
        <SquareLogo style={defaultStyles.logoStyle} />
      </View>
      <View style={defaultStyles.descriptionContainer}>
        <Text style={defaultStyles.title}>Take a payment.</Text>
      </View>
      <View style={defaultStyles.buttonContainer}>
        <CustomButton
          title="Charge $1.00"
          onPress={() => onCheckout()}
          primary
        />
      </View>
    </View>
  );
}
