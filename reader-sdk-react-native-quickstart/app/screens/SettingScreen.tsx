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
import React from 'react';
import {View, Text, Alert} from 'react-native';
import {
  startReaderSettingsAsync,
  ReaderSettingsErrorSdkNotAuthorized,
  UsageError,
} from 'react-native-square-reader-sdk';
import CustomButton from '../components/CustomButton';
import {defaultStyles} from '../styles/common';

export function SettingScreen({navigation, route}) {
  const {goBack} = navigation;
  const locationName = route.params.locationName;

  // ONSTART READER SETTING
  const onStartReaderSettings = async () => {
    const {navigate} = navigation.navigate;
    try {
      await startReaderSettingsAsync();
    } catch (ex: any) {
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
  };

  const showConfirmDialog = () => {
    return Alert.alert('Alert', 'Are you sure you want to Deauthorize Token?', [
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          onDeauthorize();
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
      },
    ]);
  };

  // NAVIGATION TO DEAUTHORIZING SCREEN
  const onDeauthorize = async () => {
    navigation.navigate('Deauthorizing');
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <View style={defaultStyles.descriptionContainer}>
        <Text style={defaultStyles.title}>
          Location:
          {locationName}
        </Text>
      </View>
      <View style={defaultStyles.buttonContainer}>
        <CustomButton
          title="Reader Settings"
          onPress={() => onStartReaderSettings()}
          primary
        />
        <CustomButton title="Deauthorize" onPress={() => showConfirmDialog()} />
        <CustomButton title="Cancel" onPress={() => goBack()} />
      </View>
    </View>
  );
}
