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

import React from 'react';
import { FormattedProvider } from 'react-native-globalize';
import {
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import ChooseAuthorizeScreen from './app/screens/ChooseAuthorizeScreen';
import ManualAuthorizeScreen from './app/screens/ManualAuthorizeScreen';
import * as PayScreen from './app/screens/PayScreen';
import * as SettingScreen from './app/screens/SettingScreen';
import * as SplashScreen from './app/screens/SplashScreen';
import * as PermissionScreenIOS from './app/screens/PermissionScreenIOS';
import * as QRAuthorizationScreen from './app/screens/QRAuthorizationScreen';
import AuthorizingScreen from './app/screens/AuthorizingScreen';
import DeauthorizingScreen from './app/screens/DeauthorizingScreen';

const AuthStack = createStackNavigator({
  Authorize: {
    screen: ChooseAuthorizeScreen,
  },
  QRAuthorize: QRAuthorizationScreen,
  ManualAuthorize: ManualAuthorizeScreen,
  Authorizing: AuthorizingScreen,
}, {
  headerMode: 'none',
});

const PaymentStack = createStackNavigator({
  Pay: PayScreen,
  Setting: SettingScreen,
  Deauthorizing: DeauthorizingScreen,
}, {
  headerMode: 'none',
});

const RootStack = createSwitchNavigator({
  Splash: SplashScreen,
  PermissionSettings: PermissionScreenIOS,
  Auth: AuthStack,
  Pay: PaymentStack,
}, {
  initialRouteName: 'Splash',
});

const App = () => (
  <FormattedProvider locale="en">
    <RootStack />
  </FormattedProvider>
);

export default App;
