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
import { Alert } from 'react-native';
import { deauthorizeAsync, canDeauthorizeAsync } from 'react-native-square-reader-sdk';
import ProgressView from '../components/ProgressView';

export default class DeauthorizingScreen extends Component {
  componentDidMount() {
    window.setTimeout(async () => {
      if (await canDeauthorizeAsync()) {
        try {
          await deauthorizeAsync();
          this.props.navigation.navigate('Splash');
        } catch (ex) {
          let errorMessage = ex.message;
          if (__DEV__) {
            errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
            console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`);
          }
          Alert.alert('Error', errorMessage);
        }
      } else {
        Alert.alert('Unable to deauthorize', 'You cannot deauthorize right now.');
        this.props.navigation.goBack();
      }
    }, 1000);
  }

  render() {
    return (
      <ProgressView />
    );
  }
}

DeauthorizingScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
