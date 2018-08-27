# Reader SDK for React Native Quick Start

## Assumptions and prerequisites

This quick start guide makes the following assumptions:

* You have read the [Reader SDK Overview]. This quick start focuses on getting
  the sample app installed and running to demonstrate how the React Native
  client works.
* You have a Square account enabled for payment processing. If you have not
  enabled payment processing on your account (or you are not sure), visit
  [squareup.com/activate].
* You are familiar with basic React Native development.

## Before you start

### Install the required command line tools

* `yarn`
* `react-native-cli`: `npm install -g react-native-cli`

### Request Reader SDK credentials

1. Open the [Square Application Dashboard].
1. Create a new Square application.
1. Click on the new application to bring up the Square application settings
   pages.
1. Open the **Reader SDK** page and click "Request Credentials" to generate your
   Reader SDK repository password.
1. You will need the **Application ID** and **Repository password** from the
   **Reader SDK** settings page to configure Reader SDK in the next steps.

### Link `react-native-square-reader-sdk`

1. In the project root folder, run: `$ yarn link`
2. `cd` to the sample folder and link the module:
    ```bash
    $ cd reader-sdk-react-native-quickstart
    $ yarn install
    $ yarn link react-native-square-reader-sdk
    ```

## Run the React Native sample app for iOS

1. Change to the `ios` folder under `reader-sdk-react-native-quickstart`.
2. Install ReaderSDK, replacing `YOUR_SQUARE_READER_APP_ID` and
   `YOUR_SQUARE_READER_REPOSITORY_PASSWORD` with your Reader SDK credentials
   and `READER_SDK_VERSION` with the Reader SDK version you are using:
    ```bash
    ruby <(curl https://connect.squareup.com/readersdk-installer) install
    --version READER_SDK_VERSION
    --app-id YOUR_SQUARE_READER_APP_ID
    --repo-password YOUR_SQUARE_READER_REPOSITORY_PASSWORD
    ```
3. In XCode, open `<ProjectDir>/reader-sdk-react-native-quickstart/ios/RNReaderSDKSample.xcodeproj`.
4. Build and run `RNReaderSDKSample`.


## Run the React Native sample app for Android

1. Open `<ProjectDir>/reader-sdk-react-native-quickstart/android/gradle.properties`.
1. Set the Reader SDK variables with your Reader SDK credentials:
    ```yaml
    # Set the variables below with your Reader SDK credentials
    SQUARE_READER_SDK_APPLICATION_ID=YOUR_SQUARE_READER_APP_ID
    SQUARE_READER_SDK_REPOSITORY_PASSWORD=YOUR_SQUARE_READER_REPOSITORY_PASSWORD
    ```
1. Open the Android project,
   `<ProjectDir>/reader-sdk-react-native-quickstart/android/` in Android Studio.
1. Confirm you have installed the required Android SDK elements based on
   the `build.gradle` requirements:
    ```javascript
    // in file android/build.gradle
    ext {
      buildToolsVersion = "27.0.3"
      minSdkVersion = 19
      compileSdkVersion = 26 // must be 26 or lower
      targetSdkVersion = 25
      supportLibVersion = "26.0.2"
    }
    ````
1. Configure an Android emulator that runs Android API 26 (Oreo, 8.0) or lower,
   or connect your dev machine to an Android device with development mode
   enabled.
1. Run the React Native project from the `android` project folder:
    ```bash
    $ react-native run-android
    ```

[//]: # "Link anchor definitions"
[Reader SDK Overview]: https://docs.connect.squareup.com/payments/readersdk/overview
[squareup.com/activate]: https://squareup.com/activate
[Square Application Dashboard]: https://connect.squareup.com/apps/
