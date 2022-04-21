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
  deauthorizeAsync,
  canDeauthorizeAsync,
} from 'react-native-square-reader-sdk';
import ProgressView from '../components/ProgressView';

export default function DeauthorizingScreen({navigation}) {
  // USEEFFECT ACTION
  useEffect(() => {
    window.setTimeout(async () => {
      if (await canDeauthorizeAsync()) {
        try {
          await deauthorizeAsync();
          navigation.navigate('Authorize');
        } catch (ex: any) {
          let errorMessage = ex.message;
          if (__DEV__) {
            errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
            console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`);
          }
          Alert.alert('Error', errorMessage);
        }
      } else {
        Alert.alert(
          'Unable to deauthorize',
          'You cannot deauthorize right now.',
        );
        navigation.goBack();
      }
    }, 1000);
  });

  return <ProgressView />;
}
