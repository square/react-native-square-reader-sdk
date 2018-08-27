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
import {
  startReaderSettingsAsync,
  ReaderSettingsErrorSdkNotAuthorized,
  UsageError,
} from 'react-native-square-reader-sdk';
import CustomButton from '../components/CustomButton';
import { defaultStyles } from '../styles/common';

export default class SettingScreen extends Component {
  async onStartReaderSettings() {
    const { navigate } = this.props.navigation;
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
  }

  async onDeauthorize() {
    this.props.navigation.navigate('Deauthorizing');
  }

  render() {
    const { navigation } = this.props;
    const { goBack } = navigation;
    const locationName = navigation.getParam('locationName', '');
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
            onPress={() => this.onStartReaderSettings()}
            primary
          />
          <CustomButton
            title="Deauthorize"
            onPress={() => this.onDeauthorize()}
          />
          <CustomButton
            title="Cancel"
            onPress={() => goBack()}
          />
        </View>
      </View>
    );
  }
}

SettingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
