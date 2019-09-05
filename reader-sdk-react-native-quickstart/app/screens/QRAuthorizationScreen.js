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
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { backgroundColor } from '../styles/common';

export default class QRAuthorizationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedCode: false,
    };

    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess(scanResult) {
    if (this.state.receivedCode) return;
    this.setState({ receivedCode: true });
    this.props.navigation.navigate('Authorizing', { authCode: scanResult.data });
  }

  render() {
    const { goBack } = this.props.navigation;
    console.log('hello');
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onBarCodeRead={this.onSuccess}
        />
        <View style={styles.button}>
          <TouchableOpacity onPress={() => goBack()} style={styles.capture}>
            <Text style={styles.textSize}> Cancel </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  capture: {
    alignSelf: 'center',
    backgroundColor,
    borderRadius: 5,
    flex: 0,
    margin: 20,
    padding: 15,
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  textSize: {
    fontSize: 14,
  },
});

QRAuthorizationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
