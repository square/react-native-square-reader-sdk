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
import {View, Text, Alert, Platform} from 'react-native';
import RNPermissions, {
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import CustomButton from '../components/CustomButton';
import SquareLogo from '../components/SquareLogo';
import {defaultStyles} from '../styles/common';

export function ChooseAuthorizeScreen({navigation}) {
  // CHECK PERMISSION AND SCAN QRCODE
  const goToQRAuthorize = async () => {
    try {
      let cameraPermission;
      if (Platform.OS === 'ios') {
        cameraPermission = await RNPermissions.check(PERMISSIONS.IOS.CAMERA);
      } else {
        cameraPermission = await RNPermissions.check(
          PERMISSIONS.ANDROID.CAMERA,
        );
      }

      console.log(cameraPermission);

      if (cameraPermission === RESULTS.GRANTED) {
        navigation.navigate('QRAuthorize');
      } else if (cameraPermission === RESULTS.DENIED) {
        let userResponse;
        if (Platform.OS === 'ios') {
          userResponse = await RNPermissions.request(PERMISSIONS.IOS.CAMERA);
        } else {
          userResponse = await RNPermissions.request(
            PERMISSIONS.ANDROID.CAMERA,
          );
        }
        if (userResponse === RESULTS.GRANTED) {
          navigation.navigate('QRAuthorize');
        }
      } else if (cameraPermission === RESULTS.UNAVAILABLE) {
        let userResponse;
        if (Platform.OS === 'ios') {
          userResponse = await RNPermissions.request(
            PERMISSIONS.IOS.MICROPHONE,
          );
        } else {
          userResponse = await RNPermissions.request(
            PERMISSIONS.ANDROID.CAMERA,
          );
        }
        if (userResponse === RESULTS.GRANTED) {
          navigation.navigate('QRAuthorize');
        }
      } else if (cameraPermission === RESULTS.BLOCKED) {
        let userResponse;
        if (Platform.OS === 'ios') {
          userResponse = await openSettings();
        } else {
          userResponse = await RNPermissions.request(
            PERMISSIONS.ANDROID.CAMERA,
          );
        }
        if (userResponse === RESULTS.GRANTED) {
          navigation.navigate('QRAuthorize');
        }
      } else {
        Alert.alert('Please enable camera permission in settings.');
      }
    } catch (ex: any) {
      Alert.alert('Permission Error', ex.message);
    }
  };

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
          onPress={() => goToQRAuthorize()}
          primary
        />
        <CustomButton
          title="Manually Enter Code"
          onPress={() => navigation.navigate('ManualAuthorize')}
        />
      </View>
    </View>
  );
}
