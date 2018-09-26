# Troubleshooting the Reader SDK React Native plugin

Likely causes and solutions for common problems.

## I get XCode compile errors when building Reader SDK

### The problem

XCode 10 builds projects differently than earlier versions and is not compatible
with the React Native build system.

### Likely cause

You recently downloaded or updated XCode.

### Solution

1. Open `File > Project Settings... > Per-User Project Settings`.
2. Choose `Legacy Build System`
3. Remove `node_modules/react-native/third-party` and
   `node_modules/react-native/third-party-podspecs`
