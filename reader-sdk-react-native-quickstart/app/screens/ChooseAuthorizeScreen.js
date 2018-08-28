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
import Permissions from 'react-native-permissions';
import CustomButton from '../components/CustomButton';
import SquareLogo from '../components/SquareLogo';
import { defaultStyles } from '../styles/common';

export default class ChooseAuthorizeScreen extends Component {
  async goToQRAuthorize() {
    const { navigate } = this.props.navigation;
    try {
      const cameraPermission = await Permissions.check('camera');
      if (cameraPermission === 'authorized') {
        navigate('QRAuthorize');
      } else if (cameraPermission === 'undetermined') {
        const userResponse = await Permissions.request('camera');
        if (userResponse === 'authorized') {
          navigate('QRAuthorize');
        }
      } else {
        Alert.alert('Please enable camera permission in settings.');
      }
    } catch (ex) {
      Alert.alert('Permission Error', ex.message);
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
          <Text style={defaultStyles.title}>Authorize Reader SDK.</Text>
          <Text style={defaultStyles.subtitle}>
Generate an authorization code
            {'\n'}
in the Reader SDK tab
            {'\n'}
of the Developer Portal.
          </Text>
        </View>
        <View style={defaultStyles.buttonContainer}>
          <CustomButton
            title="Scan QR Code"
            onPress={() => this.goToQRAuthorize()}
            primary
          />
          <CustomButton
            title="Manually Enter Code"
            onPress={() => navigate('ManualAuthorize')}
          />
        </View>
      </View>
    );
  }
}

ChooseAuthorizeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
