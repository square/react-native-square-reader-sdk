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
import { Alert } from 'react-native';
import { authorizeAsync, AuthorizeErrorNoNetwork, UsageError } from 'react-native-square-reader-sdk';
import ProgressView from '../components/ProgressView';

export default class AuthorizingScreen extends Component {

  componentDidMount() {
    const { navigation } = this.props;
    const authCode = navigation.getParam('authCode', '');
    window.setTimeout(async ()=>{
      if (!authCode) {
        Alert.alert('Error: empty auth code');
        navigation.goBack();
        return;
      }
      try {
        await authorizeAsync(authCode);
        this.props.navigation.navigate('Pay');
      } catch(ex) {
        switch(ex.code) {
          case AuthorizeErrorNoNetwork:
            Alert.alert(ex.code, ex.message);
            // Remind connecting to network
            break;
          case UsageError:
            let errorMessage = ex.message;
            if (__DEV__) {
              errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
              console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
            }
            Alert.alert('Error', errorMessage);
            break;
        }
        navigation.navigate('Authorize');
      }
    }, 1000);
  }

  render() {
    return (
      <ProgressView />
    );
  }
}
