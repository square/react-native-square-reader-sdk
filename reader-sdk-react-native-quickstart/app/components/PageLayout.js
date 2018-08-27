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
import { StyleSheet, View } from 'react-native';

const PageLayout = ({children, ...props}) => (
  <View style={defaultStyles.container}>
    <View style={styles.imageContainer}>
      <Image style={styles.logo} source={require('./img/ic_jewel.png')} />
    </View>
    <View style={defaultStyles.descriptionContainer}>
      <Text style={styles.titleLabel}>Authorize Reader SDK.</Text>
      <Text style={styles.subtitleLabel}>Generate an authorization code{"\n"}in the Reader SDK tab{"\n"}of the Developer Portal.</Text>
    </View>
    <View style={defaultStyles.logoContainer}>
      <CustomButton
        title="Scan QR Code"
        onPress={()=> navigate('QRAuthorize')}
        primary={true}
      />
      <CustomButton
        title="Manually Enter Code"
        onPress={() => navigate('ManualAuthorize')}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: backgroundColor,
    padding: 20,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleLabel: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
  logo: {
    width: 60,
    height: 60,
  }
});

export default PageLayout;
