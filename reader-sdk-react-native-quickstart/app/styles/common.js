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

import { StyleSheet } from 'react-native';

export const backgroundColor = '#4087E1';

export const defaultStyles = StyleSheet.create({
  pageContainer: {
    backgroundColor,
    padding: 32,
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    flex: 1,
    paddingTop: 64,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 48,
    height: 48,
  },
  descriptionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
});
