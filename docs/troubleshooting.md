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

## I get Android crashes when using the Reader SDK

### The problem

When there are different versions of Google Play Services, crashes can occur like
`java.lang.NoClassDefFoundError: Failed resolution of: Lcom/google/android/gms/common/api/Api$zzf;`

### Likely cause

You are using other libraries that use `googlePlayServicesVersion` at something other than "12.0.1"

### Solution

Set `googlePlayServicesVersion = "12.0.1"` in your `android/build.gradle` file. 
