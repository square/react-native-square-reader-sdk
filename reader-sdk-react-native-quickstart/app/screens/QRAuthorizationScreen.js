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
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { backgroundColor } from '../styles/common';

export default class QRAuthorizationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedCode: false,
    };
  }

  async onSuccess(e) {
    if (this.state.receivedCode) return;
    this.setState({ receivedCode: true });
    this.props.navigation.navigate('Authorizing', { authCode: e.nativeEvent.codeStringValue });
  }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <CameraKitCameraScreen
        actions={{ leftButtonText: 'Cancel' }}
        onBottomButtonPressed={() => goBack()}
        showFrame
        colorForScannerFrame={backgroundColor}
        scanBarcode
        onReadCode={(e) => this.onSuccess(e)}
        hideControls={false}
        heightForScannerFrame={300}
        cameraOptions={{
          flashMode: 'auto',
          focusMode: 'on',
          zoomMode: 'off',
        }}
      />
    );
  }
}

QRAuthorizationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
