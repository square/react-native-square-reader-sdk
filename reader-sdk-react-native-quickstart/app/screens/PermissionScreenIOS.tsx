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
import {View, Text, Alert} from 'react-native';
import CustomButton from '../components/CustomButton';
import {defaultStyles} from '../styles/common';
import SquareLogo from '../components/SquareLogo';
import RNPermissions, {
  RESULTS,
  PERMISSIONS,
  openSettings,
} from 'react-native-permissions';

export function PermissionScreenIOS({navigation}) {
  const [micPermissionButtonLabel, setMicPermissionButtonLabel] = useState('');
  const [micButtonEnabled, setMicButtonEnabled] = useState(true);
  const [micButtonHandler, setMicButtonHandler] = useState(null);
  const [locationPermissionButtonLabel, setLocationPermissionButtonLabel] =
    useState('');
  const [locationButtonEnabled, setLocationButtonEnabled] = useState(true);
  const [locationbuttonHandler, setLocationButtonHandler] = useState(null);

  useEffect(() => {
    checkPermissionsAndNavigateAsync();
  }, []);

  const Locationcheck = React.useCallback(() => {
    RNPermissions.request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      .then(response => updateLocationState(response))
      .catch(error => console.warn(error));
  }, []);

  const Microphonecheck = React.useCallback(() => {
    RNPermissions.request(PERMISSIONS.IOS.MICROPHONE)
      .then(response => updateMicrophoneState(response))
      .catch(error => console.warn(error));
  }, []);

  // ON OPEN SETTINGS FOR PERMISSIONS
  const onOpenSettings = async () => {
    if (!(await checkPermissionsAndNavigateAsync())) {
      openSettings();
    }
  };

  // ENABLE MICROPHONE PERMISSION
  const onEnableMicAccess = async () => {
    try {
      await RNPermissions.request(PERMISSIONS.IOS.MICROPHONE);
      checkPermissionsAndNavigateAsync();
    } catch (ex: any) {
      Alert.alert('Permission Request', ex.message);
    }
  };

  // ENABLE LOCATION PERMISSION
  const onEnableLocationAccess = async () => {
    try {
      await RNPermissions.request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      checkPermissionsAndNavigateAsync();
    } catch (ex: any) {
      Alert.alert('Permission Request', ex.message);
    }
  };

  // CHECK PERMISSIONS AND NAVIGATE SCREEN
  const checkPermissionsAndNavigateAsync = async () => {
    try {
      const permissions = await RNPermissions.checkMultiple([
        PERMISSIONS.IOS.MICROPHONE,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ]);
      if (
        permissions['ios.permission.MICROPHONE'] === RESULTS.GRANTED &&
        permissions['ios.permission.LOCATION_WHEN_IN_USE'] === RESULTS.GRANTED
      ) {
        navigation.navigate('Splash');
        return true;
      }
      Microphonecheck();
      Locationcheck();
      return false;
    } catch (ex: any) {
      Alert.alert('Permission Error', ex.message);
      return true;
    }
  };

  // MICROPHONE PERMISSION
  const updateMicrophoneState = async (state: any) => {
    console.log('Microphone' + state);
    switch (state) {
      case RESULTS.GRANTED:
        setMicPermissionButtonLabel('Microphone Enabled');
        setMicButtonEnabled(false);
        setMicButtonHandler(null);
        checkPermissionsAndNavigateAsync();
        break;
      case RESULTS.DENIED:
        setMicPermissionButtonLabel('Enable Microphone in Settings');
        setMicButtonEnabled(true);
        setMicButtonHandler(onOpenSettings);
        break;
      case RESULTS.LIMITED:
        setMicPermissionButtonLabel('Microphone permission is limited');
        setMicButtonEnabled(true);
        setMicButtonHandler(onEnableMicAccess());
        break;
      case RESULTS.UNAVAILABLE:
        setMicPermissionButtonLabel('Microphone permission is unavailable');
        setMicButtonEnabled(false);
        setMicButtonHandler(null);
        break;
      case RESULTS.BLOCKED:
        setMicPermissionButtonLabel('Microphone permission is block');
        setMicButtonEnabled(true);
        setMicButtonHandler(onOpenSettings);
        break;
      default:
        Alert.alert('Unknown microphone permission');
    }
  };

  // UPDATE LOCATION STATE
  const updateLocationState = async (state: any) => {
    console.log(state);
    switch (state) {
      case RESULTS.GRANTED:
        setLocationPermissionButtonLabel('Location Enabled');
        setLocationButtonEnabled(false);
        setLocationButtonHandler(null);
        checkPermissionsAndNavigateAsync();
        break;
      case RESULTS.DENIED:
        setLocationPermissionButtonLabel('Enable Location in Settings');
        setLocationButtonEnabled(true);
        setLocationButtonHandler(onOpenSettings);
        break;
      case RESULTS.LIMITED:
        setLocationPermissionButtonLabel('Location permission is limited');
        setLocationButtonEnabled(true);
        setLocationButtonHandler(onEnableLocationAccess());
        break;
      case RESULTS.UNAVAILABLE:
        setMicPermissionButtonLabel('Location permission is unavailable');
        setMicButtonEnabled(false);
        setMicButtonHandler(null);
        break;
      case RESULTS.BLOCKED:
        setMicPermissionButtonLabel('Location permission is blocked');
        setMicButtonEnabled(true);
        setMicButtonHandler(openSettings);
        break;
      default:
        Alert.alert('Unknown location permision');
    }
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <View style={defaultStyles.logoContainer}>
        <SquareLogo />
      </View>
      <View style={defaultStyles.descriptionContainer}>
        <Text style={defaultStyles.title}>
          Grant Reader SDK the required permissions.
        </Text>
      </View>
      <View style={defaultStyles.buttonContainer}>
        <CustomButton
          title={micPermissionButtonLabel}
          disabled={!micButtonEnabled}
          onPress={() => micButtonHandler()}
        />
        <CustomButton
          title={locationPermissionButtonLabel}
          disabled={!locationButtonEnabled}
          onPress={() => locationbuttonHandler()}
        />
      </View>
    </View>
  );
}
