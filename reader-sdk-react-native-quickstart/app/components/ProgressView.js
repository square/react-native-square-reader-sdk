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
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { defaultStyles } from '../styles/common';

const ProgressView = () => (
  <View style={defaultStyles.pageContainer}>
    <View style={styles.indicatorContainer}>
      <ActivityIndicator style={styles.activityIndicator} size="large" color="#ffffff" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
  },
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
  },
});


export default ProgressView;
