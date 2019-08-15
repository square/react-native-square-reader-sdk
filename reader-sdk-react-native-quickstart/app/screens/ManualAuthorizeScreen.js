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
  StyleSheet, View, TextInput, Text,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { defaultStyles } from '../styles/common';

export default class ManualAuthorizeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authCode: '',
    };
  }

  async onLogin() {
    this.props.navigation.navigate('Authorizing', { authCode: this.state.authCode });
  }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={defaultStyles.pageContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.titleLabel}>Enter an authorization code.</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={authCode => this.setState({ authCode })}
            value={this.state.authCode}
            autoFocus
            placeholder="Authorization code"
            placeholderTextColor="rgba(255, 255, 255, 0.85)"
            selectionColor="white"
            underlineColorAndroid="transparent"
          />
          <CustomButton
            title="Authorize"
            onPress={() => this.onLogin()
            }
            primary
            disabled={!this.state.authCode}
          />
          <CustomButton
            title="Cancel"
            onPress={() => goBack()
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
  },
  textContainer: {
    alignItems: 'center',
    height: '20%',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#53A6FF',
    borderRadius: 8,
    color: 'white',
    fontSize: 20,
    padding: 15,
  },
  titleLabel: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

ManualAuthorizeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
