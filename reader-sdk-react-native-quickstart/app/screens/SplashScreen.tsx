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
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import {isAuthorizedAsync} from 'react-native-square-reader-sdk';
import SquareLogo from '../components/SquareLogo';
import {backgroundColor} from '../styles/common';

export default function SplashScreen({navigation}) {
  const [logoTranslateY] = useState(new Animated.Value(0));

  // USEFFECT METHOD
  useEffect(() => {
    Animated.timing(logoTranslateY, {
      toValue: -(Dimensions.get('window').height / 2 - 120), // Calculate the position of icon after tanslate
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      duration: 1500,
      useNativeDriver: true,
    }).start();

    window.setTimeout(async () => {
      try {
        const permissions = await Permissions.checkMultiple([
          PERMISSIONS.IOS.MICROPHONE,
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        ]);
        if (
          Platform.OS === 'ios' && // Android doesn't need to handle permission explicitly
          (permissions['ios.permission.MICROPHONE'] !== RESULTS.GRANTED ||
            permissions['ios.permission.LOCATION_WHEN_IN_USE'] !==
              RESULTS.GRANTED)
        ) {
          navigation.navigate('PermissionSettings');
          return;
        }
        const isAuthorized = await isAuthorizedAsync();
        if (!isAuthorized) {
          navigation.navigate('Auth');
          return;
        }
        // Permission has been granted (for iOS only) and readerSDK has been authorized
        navigation.navigate('Checkout');
      } catch (ex: any) {
        Alert.alert('Navigation Error', ex.message);
      }
    }, 1600);
  });

  return (
    <View style={styles.container}>
      <SquareLogo style={{transform: [{translateY: logoTranslateY}]}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor,
    flex: 1,
    justifyContent: 'center',
  },
});
