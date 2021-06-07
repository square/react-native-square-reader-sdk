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
import { defaultStyles } from '../styles/common';
import SquareLogo from '../components/SquareLogo';

export default class PermissionScreenIOS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      micPermissionButtonLabel: '',
      micButtonEnabled: true,
      micButtonHandler: null,
      locationPermissionButtonLabel: '',
      locationButtonEnabled: true,
      locationbuttonHandler: null,
    };
  }

  async componentDidMount() {
    this.checkPermissionsAndNavigateAsync();
  }

  async onOpenSettings() {
    if (!await this.checkPermissionsAndNavigateAsync()) {
      Permissions.openSettings();
    }
  }

  async onEnableMicAccess() {
    try {
      await Permissions.request('microphone');
      this.checkPermissionsAndNavigateAsync();
    } catch (ex) {
      Alert.alert('Permission Request', ex.message);
    }
  }

  async onEnableLocationAccess() {
    try {
      await Permissions.request('location');
      this.checkPermissionsAndNavigateAsync();
    } catch (ex) {
      Alert.alert('Permission Request', ex.message);
    }
  }

  async checkPermissionsAndNavigateAsync() {
    try {
      const permissions = await Permissions.checkMultiple(['microphone', 'location']);
      if (permissions.microphone === 'authorized' && permissions.location === 'authorized') {
        this.props.navigation.navigate('Splash');
        return true;
      }
      this.updateMicrophoneState(permissions.microphone);
      this.updateLocationState(permissions.location);
      return false;
    } catch (ex) {
      Alert.alert('Permission Error', ex.message);
      return true;
    }
  }

  updateMicrophoneState(state) {
    switch (state) {
      case 'authorized':
        this.setState({
          micPermissionButtonLabel: 'Microphone Enabled',
          micButtonEnabled: false,
          micButtonHandler: null,
        });
        break;
      case 'denied':
        this.setState({
          micPermissionButtonLabel: 'Enable Microphone in Settings',
          micButtonEnabled: true,
          micButtonHandler: this.onOpenSettings.bind(this),
        });
        break;
      case 'restricted':
        this.setState({
          micPermissionButtonLabel: 'Microphone permission is restricted',
          micButtonEnabled: false,
          micButtonHandler: null,
        });
        break;
      case 'undetermined':
        this.setState({
          micPermissionButtonLabel: 'Enable Microphone Access',
          micButtonEnabled: true,
          micButtonHandler: this.onEnableMicAccess.bind(this),
        });
        break;
      default:
        Alert.alert('Unknown microphone permission');
    }
  }

  updateLocationState(state) {
    switch (state) {
      case 'authorized':
        this.setState({
          locationPermissionButtonLabel: 'Location Enabled',
          locationButtonEnabled: false,
          locationbuttonHandler: null,
        });
        break;
      case 'denied':
        this.setState({
          locationPermissionButtonLabel: 'Enable Location in Settings',
          locationButtonEnabled: true,
          locationbuttonHandler: this.onOpenSettings.bind(this),
        });
        break;
      case 'restricted':
        this.setState({
          locationPermissionButtonLabel: 'Location permission is restricted',
          locationButtonEnabled: false,
          locationbuttonHandler: null,
        });
        break;
      case 'undetermined':
        this.setState({
          locationPermissionButtonLabel: 'Enable Location Access',
          locationButtonEnabled: true,
          locationbuttonHandler: this.onEnableLocationAccess.bind(this),
        });
        break;
      default:
        Alert.alert('Unknown location permision');
    }
  }

  render() {
    return (
      <View style={defaultStyles.pageContainer}>
        <View style={defaultStyles.logoContainer}>
          <SquareLogo />
        </View>
        <View style={defaultStyles.descriptionContainer}>
          <Text style={defaultStyles.title}>Grant Reader SDK the required permissions.</Text>
        </View>
        <View style={defaultStyles.buttonContainer}>
          <CustomButton
            title={this.state.micPermissionButtonLabel}
            disabled={!this.state.micButtonEnabled}
            onPress={() => this.state.micButtonHandler()}
          />
          <CustomButton
            title={this.state.locationPermissionButtonLabel}
            disabled={!this.state.locationButtonEnabled}
            onPress={() => this.state.locationbuttonHandler()}
          />
        </View>
      </View>
    );
  }
}

PermissionScreenIOS.propTypes = {
  navigation: PropTypes.object.isRequired,
};
