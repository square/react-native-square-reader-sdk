# React Native Plugin for Reader SDK Quick Start

<img src="./sampleapp-example.png">

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

### Install the required tools

* Install `yarn` from [yarnpkg.com]
* Follow the **Building Projects with Native Code** instructions in the
  [React Native Getting Started] guide to setup your React Native development
  environment.
* Confirm your environment meets the Reader SDK build requirements listed in the
  [root README] for this repo.
* Clone this repo (if you have not already):
  `git clone https://github.com/square/react-native-square-reader-sdk.git`

### Install `react-native-square-reader-sdk`

Change to the quick start sample folder and install the plugin using `yarn`:

```bash
cd <ProjectDir>/reader-sdk-react-native-quickstart
yarn
```

## Step 1: Request Reader SDK credentials

1. Open the [Square Application Dashboard].
2. Create a new Square application.
3. Click on the new application to bring up the Square application settings
   pages.
4. Open the **Reader SDK** page and click "Request Credentials" to generate your
   Reader SDK repository password.
5. You will need the **Application ID** and **Repository password** from the
   **Reader SDK** settings page to configure Reader SDK in the next steps.


## Step 2: Run the React Native sample app for iOS

**NOTE**: XCode 10+ uses a different build system that may cause compile errors.
See the [Troubleshooting guide](../docs/troubleshooting.md) if you run into
problems building the sample app.

1. Change to the `ios` folder under `reader-sdk-react-native-quickstart`.  

2. Link your dependencies with Cocoa Pods:
    ```
    pod install
    ```
3. Install ReaderSDK, replacing `YOUR_SQUARE_READER_APP_ID` and
   `YOUR_SQUARE_READER_REPOSITORY_PASSWORD` with your Reader SDK credentials.
   You can find the minimum supported Reader SDK version for iOS in the
   [root README]for this repo:
    ```bash
    ruby <(curl https://connect.squareup.com/readersdk-installer) install \
    --app-id YOUR_SQUARE_READER_APP_ID                                    \
    --repo-password YOUR_SQUARE_READER_REPOSITORY_PASSWORD
    ```
4. Run the React Native project from the `reader-sdk-react-native-quickstart`
   project folder:
    ```bash
    cd <ProjectDir>/reader-sdk-react-native-quickstart
    react-native run-ios
    ```
5. Go to the **Reader SDK** settings page in your [Square Application Dashboard]
   and generate a new mobile authorization code by clicking
   "Generate Mobile Auth Code".
6. Copy the mobile authorization code string from the Square application
   settings page.
7. Tap "Enter Code Manually" in the sample app and paste the mobile
   authorization code into the field provided.

You can view the [transaction details in Square Dashboard].


## Step 3: Run the React Native sample app for Android

1. Open `<ProjectDir>/reader-sdk-react-native-quickstart/android/gradle.properties`.
2. Set the Reader SDK variables with your Reader SDK credentials:
    ```yaml
    # Set the variables below with your Reader SDK credentials
    SQUARE_READER_SDK_APPLICATION_ID=YOUR_SQUARE_READER_APP_ID
    SQUARE_READER_SDK_REPOSITORY_PASSWORD=YOUR_SQUARE_READER_REPOSITORY_PASSWORD
    ```
3. Open the Android project,
   `<ProjectDir>/reader-sdk-react-native-quickstart/android/` in Android Studio.
4. Confirm you have installed the required Android SDK elements. If you are
   unsure, the Reader SDK build requirements are listed in the [root README] for
   this repo.
5. Configure an Android emulator that runs Android API 26 (Oreo, 8.0),
   or connect your dev machine to an Android device running Android API 26 with
   development mode enabled.
6. Run the React Native project from the `reader-sdk-react-native-quickstart`
   project folder:
    ```bash
    cd <ProjectDir>/reader-sdk-react-native-quickstart
    $ react-native run-android
    ```
7. Go to the **Reader SDK** settings page in your [Square Application Dashboard]
   and generate a new mobile authorization code by clicking
   "Generate Mobile Auth Code".
8. Copy the mobile authorization code string from the Square application
   settings page.
9. Tap "Enter Code Manually" in the sample app and paste the mobile
   authorization code into the field provided.

You can view the [transaction details in Square Dashboard].


[//]: # "Link anchor definitions"
[Reader SDK Overview]: https://developer.squareup.com/docs/reader-sdk/what-it-does
[squareup.com/activate]: https://squareup.com/activate
[Square Application Dashboard]: https://connect.squareup.com/apps/
[React Native Getting Started]: https://facebook.github.io/react-native/docs/getting-started.html
[yarnpkg.com]: https://yarnpkg.com/lang/en/docs/install/
[root README]: ../README.md
[transaction details in Square Dashboard]: https://squareup.com/dashboard/sales/transactions
