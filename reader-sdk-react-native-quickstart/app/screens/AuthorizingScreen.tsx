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
import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {
  authorizeAsync,
  AuthorizeErrorNoNetwork,
  UsageError,
} from 'react-native-square-reader-sdk';
import ProgressView from '../components/ProgressView';

export default function AuthorizingScreen({navigation, route}) {
  // GET AUTHORIZE CODE
  useEffect(() => {
    authorize();
  });

  // CHECK AUTHENTICATION CODE
  const authorize = async () => {
    const authCode = route.params.authCode;
    if (!authCode) {
      Alert.alert('Error: empty auth code');
      navigation.goBack();
      return;
    }
    try {
      await authorizeAsync(authCode);
      navigation.navigate('Checkout');
    } catch (ex: any) {
      let errorMessage = ex.message;
      // SWITCHCASE FOR ERROR CONDITIONS
      switch (ex.code) {
        case AuthorizeErrorNoNetwork:
          // Remind connecting to network and retry
          Alert.alert('Network error', ex.message, [
            {text: 'Retry', onPress: () => authorize()},
            {
              text: 'Cancel',
              onPress: () => navigation.navigate('Authorize'),
              style: 'cancel',
            },
          ]);
          break;
        case UsageError:
          if (__DEV__) {
            errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
            console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`);
          }
          Alert.alert('Error', errorMessage);
          navigation.navigate('Authorize');
          break;
        default:
          Alert.alert('Error', errorMessage);
          navigation.navigate('Authorize');
          break;
      }
    }
  };

  // MAIN VIEW DESIGN
  return <ProgressView />;
}
