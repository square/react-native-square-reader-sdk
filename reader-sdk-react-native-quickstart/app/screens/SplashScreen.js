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
  StyleSheet, View, Platform, Alert, Animated, Easing, Dimensions,
} from 'react-native';
import Permissions from 'react-native-permissions';
import {
  isAuthorizedAsync,
} from 'react-native-square-reader-sdk';
import SquareLogo from '../components/SquareLogo';
import { backgroundColor } from '../styles/common';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoTranslateY: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(
      this.state.logoTranslateY,
      {
        toValue: -(Dimensions.get('window').height / 2 - 120), // Calculate the position of icon after tanslate
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        duration: 1500,
        useNativeDriver: true,
      },
    ).start();

    window.setTimeout(async () => {
      const { navigate } = this.props.navigation;
      try {
        const permissions = await Permissions.checkMultiple(['microphone', 'location']);

        if (Platform.OS === 'ios' // Android doesn't need to handle permission explicitly
            && (permissions.microphone !== 'authorized'
              || permissions.location !== 'authorized')) {
          this.props.navigation.navigate('PermissionSettings');
          return;
        }

        const isAuthorized = await isAuthorizedAsync();
        if (!isAuthorized) {
          navigate('Auth');
          return;
        }

        // Permission has been granted (for iOS only) and readerSDK has been authorized
        this.props.navigation.navigate('Checkout');
      } catch (ex) {
        Alert.alert('Navigation Error', ex.message);
      }
    }, 1600);
  }

  render() {
    return (
      <View style={styles.container}>
        <SquareLogo style={{ transform: [{ translateY: this.state.logoTranslateY }] }} />
      </View>
    );
  }
}

SplashScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
});
