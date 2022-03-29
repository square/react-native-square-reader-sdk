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


import React, {useState,useEffect} from 'react';
import { View, Text, Alert } from 'react-native';
//import Permissions, { openSettings } from 'react-native-permissions';
import CustomButton from '../components/CustomButton';
import { defaultStyles } from '../styles/common';
import SquareLogo from '../components/SquareLogo';
import {PERMISSIONS, checkMultiple,RESULTS} from 'react-native-permissions';

export function PermissionScreenIOS({ navigation, props, route }) {
  const [micPermissionButtonLabel, setMicPermissionButtonLabel] = useState('');
  const [micButtonEnabled, setMicButtonEnabled] = useState(true);
  const [micButtonHandler, setMicButtonHandler] = useState(null);
  const [locationPermissionButtonLabel, setLocationPermissionButtonLabel] = useState('');
  const [locationButtonEnabled, setLocationButtonEnabled] = useState(true);
  const [locationbuttonHandler, setLocationButtonHandler] = useState(null);

  useEffect(() => {
    checkPermissionsAndNavigateAsync();
  });
  
  const updateMicrophoneState = async (state) => {
    switch (state) {
      case RESULTS.GRANTED:
        setMicPermissionButtonLabel( 'Microphone Enabled');
        setMicButtonEnabled(false);
        setMicButtonHandler(null);
        break;
      case RESULTS.DENIED:
        setMicPermissionButtonLabel( 'Enable Microphone in Settings');
        setMicButtonEnabled(true);
        setMicButtonHandler(onOpenSettings);
        break;
      case RESULTS.LIMITED:
        setMicPermissionButtonLabel( 'Microphone permission is limited');
        setMicButtonEnabled(true);
        setMicButtonHandler(onEnableMicAccess());
        break;
      case RESULTS.UNAVAILABLE:
        setMicPermissionButtonLabel( 'Microphone permission is unavailable');
        setMicButtonEnabled(false);
        setMicButtonHandler(null);
      default:
        Alert.alert('Unknown microphone permission');
    }
  };
  const onEnableMicAccess=async () =>{
    try {
      await Permissions.request('ios.permission.MICROPHONE');
      checkPermissionsAndNavigateAsync();
    } catch (ex) {
      Alert.alert('Permission Request', ex.message);
    }
  }
  const onOpenSettings = async () => {
    if (!await checkPermissionsAndNavigateAsync()) {
      openSettings();
    }
  };

  const checkPermissionsAndNavigateAsync = async () => {
    try {
      const permissions = await checkMultiple([PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]);
      if (permissions['ios.permission.MICROPHONE'] === RESULTS.GRANTED && permissions['ios.permission.LOCATION_WHEN_IN_USE'] === RESULTS.GRANTED) {
        navigation.navigate('Splash');
        return true;
      }
      updateMicrophoneState(permissions['ios.permission.MICROPHONE']);
      updateLocationState(permissions['ios.permission.LOCATION_WHEN_IN_USE']);
      return false;
    } catch (ex) {
      Alert.alert('Permission Error', ex.message);
      return true;
    }
  };
  const updateLocationState = async (state) => {
    switch (state) {
      case RESULTS.GRANTED:
        setLocationPermissionButtonLabel('Location Enabled');
        setLocationButtonEnabled(false);
        setLocationButtonHandler(null);
        break;
      case RESULTS.DENIED:
        setLocationPermissionButtonLabel('Enable Location in Settings');
        setLocationButtonEnabled(true);
        setLocationButtonHandler(onOpenSettings);
        break;
      case RESULTS.LIMITED:
        setLocationPermissionButtonLabel('Location permission is limited');
        setLocationButtonEnabled(true);
        setLocationButtonHandler(onOpenSettings);
        break;
      case RESULTS.UNAVAILABLE:
        setMicPermissionButtonLabel( 'Location permission is unavailable');
        setMicButtonEnabled(false);
        setMicButtonHandler(null);
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
        <Text style={defaultStyles.title}>Grant Reader SDK the required permissions.</Text>
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
};
