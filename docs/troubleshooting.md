# Troubleshooting the Reader SDK React Native plugin

Likely causes and solutions for common problems.

## I get XCode compile errors when building Reader SDK

### The problem

Xcode 10 builds projects differently than earlier versions and is not compatible
with the React Native build system.

### Likely cause

You recently downloaded or updated XCode.

### Solution

1. Open `File > Project Settings... > Per-User Project Settings`
2. Choose `Legacy Build System`
3. Remove `node_modules/react-native/third-party` and
   `node_modules/react-native/third-party-podspecs`

## On iOS, authorizeAsync throws error "RNReaderSDKAuthorization is undefined"

### The problem

libRNReaderSDK.a is not added to your project's `Build Phases > Link Binary With Libraries`.

### Likely cause

You failed to run `react-native link react-native-square-reader-sdk` or you are using CocoaPods to link libraries.

### Solution

1. In Xcode, click your project and go to `Build Phases > Link Binary With Libraries`
2. In project navigator, expand `[project root] > Libraries > RNReaderSDK.xcodeproj > Products` and drag `libRNReaderSDK.a` into `Link Binary With Libraries`
