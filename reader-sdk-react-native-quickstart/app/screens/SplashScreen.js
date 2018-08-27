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
import { StyleSheet, View, Platform, Alert, Animated, Easing, Dimensions } from 'react-native';
import Permissions from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import {
  isAuthorizedAsync,
} from 'react-native-square-reader-sdk';
import SquareLogo from '../components/SquareLogo';
import { backgroundColor } from '../styles/common';

export default class SplashScreen extends Component {

  state = {
    logoTranslateY: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.timing(
      this.state.logoTranslateY,
      {
        toValue: -(Dimensions.get('window').height / 2 - 120), // Calculate the position of icon after tanslate
        easing: Easing.bezier(.25,.1,.25,1),
        duration: 1500,
      }
    ).start();

    window.setTimeout(async () => {
      const { navigate } = this.props.navigation;
      try {
        const permissions = await Permissions.checkMultiple(['microphone', 'location']);

        if (Platform.OS == 'ios' && // Android doesn't need to handle permission explicitly
            ((!DeviceInfo.isEmulator() && permissions.microphone != 'authorized') ||
              permissions.location != 'authorized')) {
          this.props.navigation.navigate('PermissionSettings');
          return;
        }

        const isAuthorized = await isAuthorizedAsync();
        if (!isAuthorized) {
          navigate('Auth');
          return;
        }

        // Permission has been granted (for iOS only) and readerSDK has been authorized
        this.props.navigation.navigate('Pay');
      } catch(ex) {
        Alert.alert('Navigation Error', ex.message);
      }
    }, 1600);
  }

  render() {
    return (
      <View style={styles.container}>
          <SquareLogo style={{transform: [{ translateY: this.state.logoTranslateY }]}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
