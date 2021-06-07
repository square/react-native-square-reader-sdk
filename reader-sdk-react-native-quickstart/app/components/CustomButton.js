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
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

const CustomButton = (props) => (
  <TouchableOpacity
    style={props.disabled
      ? [styles.button, props.primary
        ? styles.primaryButton : styles.secondaryButton, styles.disabledButton]
      : [styles.button, props.primary
        ? styles.primaryButton : styles.secondaryButton]}
    onPress={props.onPress}
    disabled={props.disabled}
  >
    <Text style={props.disabled
      ? [styles.buttonText, styles.disabledButtonText]
      : styles.buttonText}
    >
      {props.title}
    </Text>
  </TouchableOpacity>
);

CustomButton.defaultProps = {
  disabled: false,
  primary: false,
};

CustomButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  primary: PropTypes.bool,
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    height: 64,
    justifyContent: 'center',
    marginTop: 15,

  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  disabledButton: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  primaryButton: {
    backgroundColor: '#3972B2',
  },
  secondaryButton: {
    borderColor: 'white',
    borderWidth: 1,
  },
});

export default CustomButton;
