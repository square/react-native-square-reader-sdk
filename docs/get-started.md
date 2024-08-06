# Getting Started with the React Native plugin for Reader SDK

This guide walks you through the process of setting up a new React Native
project with Reader SDK. See the
[React Native Reader SDK Technical Reference](reference.md)
for more detailed information about the methods available.

## Before you start

* You will need a Square account enabled for payment processing. If you have not
  enabled payment processing on your account (or you are not sure), visit
  [squareup.com/activate].
* Install `yarn` from [yarnpkg.com]
* Follow the **Building Projects with Native Code** instructions in the
  [React Native Getting Started] guide to setup your React Native development
  environment.



## Process overview

* [Step 1: Create a React Native project](#step-1-create-a-react-native-project)
* [Step 2: Install Reader SDK for React Native](#step-2-install-reader-sdk-for-react-native)
* [Step 3: Request Reader SDK credentials](#step-3-Request-reader-sdk-credentials)
* [Step 4: Install Reader SDK for Android](#step-4-install-reader-sdk-for-android)
* [Step 5: Install Reader SDK for iOS](#step-5-install-reader-sdk-for-ios)
* [Step 6: Implement Reader SDK authorization](#step-6-implement-reader-sdk-authorization)
* [Step 7: Implement the Checkout flow](#step-7-implement-the-checkout-flow)
* [Step 8. Implement Mobile Authorization](#step-8-implement-mobile-authorization)

Optional steps:

* [Save a card on file](#save-a-card-on-file)
* [Support Contactless Readers](#support-contactless-readers)
* [Support Reader SDK deauthorization](#support-reader-sdk-deauthorization)


## Step 1: Create a React Native project for Reader SDK

The basic command is:

```bash
yarn global add react-native-cli
react-native init myRNReaderSDKSample
```

See [Building Projects with Native Code] guide for more detailed instructions.


## Step 2: Install React Native plugin for Reader SDK and link the plugin

Add the Reader SDK package to `yarn`:
```bash
yarn add react-native-square-reader-sdk
react-native link react-native-square-reader-sdk
```


## Step 3: Request Reader SDK credentials

1. Open the [Square Application Dashboard].
1. Create a new Square application.
1. Click on the new application to bring up the Square application settings
   pages.
1. Open the **Reader SDK** page and click "Request Credentials" to generate your
   Reader SDK repository password.
1. You will need the **Application ID** and **Repository password** from the
   **Reader SDK** settings page to configure Reader SDK in the next steps.


## Step 4: Install Reader SDK for Android

To use the React Native plugin on Android devices, you need to install Reader
SDK for Android so it is available to the React Native library as a resource.
The key installation steps are outlined below. For more information on
installing Reader SDK for Android, see [Reader SDK Android Setup Guide].

1. Change to the Android folder (`android`) at the root of your React Native
   project.
1. Update the `gradle.properties` file in the `android` folder of your project
   to increase the max heap size provided to the Gradle daemon and set variables
   for the Square application ID and repository password:
   ```
    SQUARE_READER_SDK_APPLICATION_ID=YOUR_SQUARE_READER_APP_ID
    SQUARE_READER_SDK_REPOSITORY_PASSWORD=YOUR_SQUARE_READER_REPOSITORY_PASSWORD
    org.gradle.jvmargs=-Xmx4g
   ```
1. Add the Reader SDK variables from your properties file to the `build.gradle`
   file of your `:app module:` and confirm that the Google repository is set
   properly:
    ```gradle
    repositories {
      google()
      maven {
        url "https://sdk.squareup.com/android"
        credentials {
          username SQUARE_READER_SDK_APPLICATION_ID
          password SQUARE_READER_SDK_REPOSITORY_PASSWORD
        }
      }
      jcenter()
    }
    ```
1. Reader SDK and its dependencies contain more than 65k methods, so your build
   script must enable Multidex.

    ```gradle
    android {
      // ...
      defaultConfig {
        minSdkVersion 24
        targetSdkVersion 30
        multiDexEnabled true
      }
    }
    ```
1. Enable compileOptions `JavaVersion.VERSION_1_8`.

    ```gradle
    android {
      // ...
      compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
      }
      // ...
    }
    ```
1. Configure the Multidex options:

    ```gradle
    android {
      // ...
      dexOptions {
        // Ensures incremental builds remain fast
        preDexLibraries true
        // Required to build with Reader SDK
        jumboMode true
        // Required to build with Reader SDK
        keepRuntimeAnnotatedClasses false
      }
      // ...
    }
    ```
1. Open `MainApplication.kt` and add code to Import and initialize Reader SDK:
    ```kotlin
    import com.squareup.sdk.reader.ReaderSdk;

    class MainApplication : Application(), ReactApplication {

    override fun onCreate() {
        super.onCreate()
        ReaderSdk.initialize(this)
      }
    }

    ```

---
**Note:** Reader SDK is guaranteed to work with support library version 28.0.0. If you want to use a higher version of support library, you will need to update build.gradle to add the targeted version of the required libraries (e.g. design, support-v4, recyclerview-v7).

If you use a higher version of the support library, we recommend establishing a resolution strategy in build.gradle to ensure all support library dependencies are on the same version. For example:

```gradle
configurations.all {
  resolutionStrategy {
    eachDependency { details ->
      // Force all primary support libraries to the same version
      if (details.requested.group == 'com.android.support'
        && details.requested.name != 'multidex'
        && details.requested.name != 'multidex-instrumentation') {
        // Force the version that works for you.
        // Square has tested ReaderSDK with 28.0.0
        details.useVersion '28.0.0'
      }
    }
  }
}
```
---
## Step 5: Install Reader SDK for iOS

To use the React Native plugin on iOS devices, you need to install Reader
SDK for iOS so it is available to the React Native library as a resource.
The key installation steps are outlined below. For more information on
installing Reader SDK for iOS, see [Reader SDK iOS Setup Guide].

**TIP**: You can find the minimum supported Reader SDK version for iOS in the
[root README] for this repo.

1. Change to the iOS folder (`ios`) at the root of your React Native project.
1. Download and configure the latest version of `SquareReaderSDK.framework` in
   your project root by replacing `YOUR_SQUARE_READER_APP_ID` and
   `YOUR_SQUARE_READER_REPOSITORY_PASSWORD` with your Reader SDK credentials. **The framework will install in the current `ios` directory**.
    ```bash
    ruby <(curl https://connect.squareup.com/readersdk-installer) install \
    --app-id $YOUR_SQUARE_READER_APP_ID                                    \
    --repo-password $YOUR_SQUARE_READER_REPOSITORY_PASSWORD
    ```
1. Add Reader SDK to your Xcode project:
   * Open the **General** tab for your app target in Xcode.
   * Drag the newly downloaded `SquareReaderSDK.framework` into the
     **Embedded Binaries** section and click "Finish" in the modal that appears.
1. Add a Reader SDK build phase:
   1. Open the Xcode workspace or project for your application.
   1. In the **Build Phases** tab for your application target, click the **+**
      button (at the top of the pane).
   1. Select **New Run Script Phase**.
   1. Paste the following into the editor panel of the new run script:
      ```
      FRAMEWORKS="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}"
      "${FRAMEWORKS}/SquareReaderSDK.framework/setup"
      ```
      **Note**: XCode 10+ uses a different build system that may cause compile
      errors. See the [Troubleshooting guide](troubleshooting.md) if you run
      into problems.
1. Disable Bitcode:
   1. Open the **Build Settings** tab for your application target.
   1. In the top right search field, search for 'bitcode'.
   1. Change the value of **Enable Bitcode** to **NO**.
1. In Xcode, open the **General** tab for your app target and make sure the
   **Landscape Left** and **Landscape Right** device orientations are supported.
1. Update your Info.plist with the following key:value pairs in the **Info** tab
   for your application target to explain why your application requires these
   device permissions:
   * `NSLocationWhenInUseUsageDescription` : "This app integrates with Square
     for card processing. To protect buyers and sellers, Square requires your
     location to process payments."
   * `NSMicrophoneUsageDescription` : "This app integrates with Square for card
     processing. To swipe magnetic cards via the headphone jack, Square requires
     access to the microphone."
   * `NSBluetoothPeripheralUsageDescription` : This app integrates with Square
     for card processing. Square uses Bluetooth to connect your device to
     compatible hardware.
   * `NSCameraUsageDescription` : This app integrates with Square for card
      processing. Upload your account logo, feature photo and product images
      with the photos stored on your mobile device.
   * `NSPhotoLibraryUsageDescription` : This app integrates with Square for card
      processing. Upload your account logo, feature photo and product images
      with the photos stored on your mobile device.

1. Update the `func application` method in your app
   delegate to initialize Reader SDK:
   * Swift - Update `AppDelegate.swift` as follows:
    ```Swift
    import Foundation
    import SquareReaderSDK

    @UIApplicationMain
    class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
    {
    
    //...

     SQRDReaderSDK.initialize(applicationLaunchOptions: launchOptions)
     return true
    }

    ```
   * Objective-C - Update `AppDelegate.mm` as follows:
    ```objective-c
    @import SquareReaderSDK;
    @implementation AppDelegate

    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    {
      //...

      [SQRDReaderSDK initializeWithApplicationLaunchOptions:launchOptions];

      return YES;
    }

    ```
    Note for Objective-C: In order to import correctly, your project will need to enable modules for Objective-C and Objective-C++. To do this you must:
    1. Add the flags `-fmodules` and `-fcxx-modules` to `Other C++ Flags` in your targets build settings.
    2. Update the build setting property `Allow Non-modular Includes in Framework Modules` to `Yes`.


You will also need to add code to your React Native project to request device and
microphone permissions. See the React Native Reader SDK Quick Start Sample App
for an example of how to do this.


## Step 6: Implement Reader SDK authorization

Add code to your React Native project that authorizes Reader SDK:

```javascript
import {
  authorizeAsync,
  AuthorizeErrorNoNetwork,
  UsageError,
} from 'react-native-square-reader-sdk';
...

try {
  // authCode is a mobile authorization code from the Mobile Authorization API
  const authorizedLocation = await authorizeAsync(authCode);
  // Authorized and authorizedLocation is available
} catch(ex) {
  switch(ex.code) {
    case AuthorizeErrorNoNetwork:
      // Remind connecting to network
      break;
    case UsageError:
      let errorMessage = ex.message;
      if (__DEV__) {
        errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
        console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
      }
      Alert.alert('Error', errorMessage);
      break;
  }
}
```


## Step 7: Implement the Checkout flow

Add code to your React Native project that starts the checkout flow and handles
the response. Reader SDK must be authorized before starting the checkout flow
and connecting a Reader is only required for card payments.

**Note**: You cannot start the checkout flow from a modal screen. To start
checkout, you must close the modal before calling `startCheckoutAsync`.

```javascript
import {
  startCheckoutAsync,
  CheckoutErrorCanceled,
  CheckoutErrorSdkNotAuthorized,
  UsageError,
} from 'react-native-square-reader-sdk';

// A checkout parameter is required for this checkout method
const checkoutParams = {
  amountMoney: {
    amount: 100,
    currencyCode: 'USD', // optional, use authorized location's currency code by default
  },
  // Optional for all following configuration
  skipReceipt: false,
  collectSignature: true,
  allowSplitTender: false,
  delayCapture: false,
  note: 'ReaderSDKSample Transaction',
  tipSettings: {
    showCustomTipField: true,
    showSeparateTipScreen: false,
    tipPercentages: [15, 20, 30],
  },
  additionalPaymentTypes: ['cash', 'manual_card_entry', 'other'],
};

try {
  const checkoutResult = await startCheckoutAsync(checkoutParams);
  // checkout finished successfully and checkoutResult is available
} catch(ex) {
  switch(ex.code) {
    case CheckoutErrorCanceled:
      // Handle canceled transaction here
      break;
    case CheckoutErrorSdkNotAuthorized:
      // Handle sdk not authorized
      break;
    default:
      let errorMessage = ex.message;
      if (__DEV__) {
        errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
        console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
      }
      Alert.alert('Error', errorMessage);
      break;
  }
}
```

## Step 8. Implement Mobile Authorization

In the context of Reader SDK, authorization refers to using the SDK with a
mobile authorization code from the [Mobile Authorization API]. Mobile
authorization tokens allow custom mobile apps to process payments on Square
hardware on behalf of a specific Square account for a given location.

For early development, you can also generate a mobile authorization token from
the **Reader SDK** settings page in the [Square Application Dashboard]. See the
[Mobile Authorization API] documentation for help setting up a service to
generate mobile authorization tokens for production use.


## Optional steps

### Save a card on file

You can save cards on file with the Reader SDK Flutter plugin to create a
seamless purchase experience for returning customers and enable recurring
payments with Square APIs. It is important to note that while Reader SDK can
save card information, you must work with the Square Payments API to
[charge a card on file].

The Reader SDK card on file workflow creates a customer card for an **existing**
[Customer profile]. **ALWAYS** ask customers for permission before saving their
card information. For example, include a checkbox in your purchase flow that the
customer can check to specify that they wish to save their card information for
future purchases. Linking cards on file without obtaining customer permission
may result in your application being disabled without notice.

The card on file workflow begins with an asynchronous call to Square servers,
which could be slow depending on network conditions. We recommend displaying a
spinner or loading indicator before starting the card on file workflow and
clearing it when you receive the result (success or failure) so users know that
work is being done in the background.

```javascript
import {
  startStoreCardAsync,
  StoreCustomerCardCancelled,
  StoreCustomerCardInvalidCustomerId,
  StoreCustomerCardSdkNotAuthorized,
  StoreCustomerCardNoNetwork,
} from 'react-native-square-reader-sdk';
...
// Get customer Id from Connect Customers API
const customerId = 'DRYKVK5Y6H5R4JH9ZPQB3XPZQC';

try {
  const cardInfo = await startStoreCardAsync(customerId);
  Alert.alert(JSON.stringify(cardInfo));
} catch (ex) {
  let errorMessage = ex.message;
  switch (ex.code) {
    case StoreCustomerCardCancelled:
      // Handle canceled here
      console.log('transaction canceled.');
      break;
    case StoreCustomerCardInvalidCustomerId:
      // Handle invalid customer id error
      break;
    case StoreCustomerCardNoNetwork:
      // Handle no network error
      break;
    case StoreCustomerCardSdkNotAuthorized:
      // Handle sdk not authorized
      break;
    default:
      if (__DEV__) {
        errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
        console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`);
      }
      Alert.alert('Error', errorMessage);
      break;
  }
}
```


### Support Contactless Readers

You do not need to write explicit code to take payment with a Magstripe Reader.

To take payments with a Contactless + Chip Reader, you must add code to your
React Native project that starts the Reader SDK settings flow to pair the Reader.

```javascript
import {
  startReaderSettingsAsync,
  ReaderSettingsErrorSdkNotAuthorized,
  UsageError,
} from 'react-native-square-reader-sdk';
...

try {
  await startReaderSettingsAsync();
} catch (ex) {
  switch(ex.code) {
    case ReaderSettingsErrorSdkNotAuthorized:
      // Handle reader settings not authorized
      break;
    case UsageError:
      let errorMessage = ex.message;
      if (__DEV__) {
        errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
        console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
      }
      Alert.alert('Error', errorMessage);
      break;
  }
}
```

### Support Reader SDK deauthorization

To switch Square locations or to deauthorize the current location, you must add
code to your React Native project that deauthorizes Reader SDK.

```javascript
import { deauthorizeAsync, canDeauthorizeAsync } from 'react-native-square-reader-sdk';
...

if (await canDeauthorizeAsync()) {
  try {
    await deauthorizeAsync();
    // Deauthorize finished successfully
  } catch(ex) {
    let errorMessage = ex.message;
    if (__DEV__) {
      errorMessage += `\n\nDebug Message: ${ex.debugMessage}`;
      console.log(`${ex.code}:${ex.debugCode}:${ex.debugMessage}`)
    }
    Alert.alert('Error', errorMessage);
  }
} else {
  Alert.alert('Unable to deauthorize', 'You cannot deauthorize right now.');
}
```



[//]: # "Link anchor definitions"
[Mobile Authorization API]: https://developer.squareup.com/docs/mobile-authz/build-with-mobile-authz
[Reader SDK]: https://developer.squareup.com/docs/reader-sdk/what-it-does
[Square Dashboard]: https://squareup.com/dashboard/
[update policy for Reader SDK]: https://developer.squareup.com/docs/reader-sdk/what-it-does#readersdkupdatepolicy
[Testing Mobile Apps]: https://developer.squareup.com/docs/testing/mobile
[squareup.com/activate]: https://squareup.com/activate
[Building Projects with Native Code]: https://facebook.github.io/react-native/docs/getting-started.html
[Square Application Dashboard]: https://connect.squareup.com/apps/
[Reader SDK Android Setup Guide]: https://developer.squareup.com/docs/reader-sdk/build-on-android
[Reader SDK iOS Setup Guide]: https://developer.squareup.com/docs/reader-sdk/build-on-ios
[root README]: ../README.md
[yarnpkg.com]: https://yarnpkg.com/lang/en/docs/install/
[React Native Getting Started]: https://facebook.github.io/react-native/docs/getting-started.html
[Customer profile]: https://developer.squareup.com/docs/customers-api/build-with-customers
[charge a card on file]: https://developer.squareup.com/docs/payments-api/take-payments#take-a-payment-using-a-card-on-file
