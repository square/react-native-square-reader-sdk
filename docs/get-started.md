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

* [Support Contactless Readers](#support-contactless-readers)
* [Support Reader SDK deauthorization](#support-reader-sdk-deauthorization)


## Step 1: Create a React Native project for Reader SDK

The basic command is:

```bash
yarn global add react-native-cli
react-native init myRNReaderSDKSample
```

See [Building Projects with Native Code] guide for more detailed instructions.


## Step 2: Install Reader SDK for React Native

Add the Reader SDK package to `yarn`:
```bash
yarn add react-native-square-reader-sdk
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
installing Reader SDK for Android, see the [Reader SDK Android Setup Guide] at
[docs.connect.squareup.com].

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
    ```
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
   script must enable Multidex. If your `minSdkVersion` is less than **21**, you
   also need to include the `multidex` dependency:
    ```
    android {
      defaultConfig {
        minSdkVersion 19
        targetSdkVersion 26
        multiDexEnabled true
      }
    }

    dependencies {
      // Add this dependency if your minSdkVersion < 21
      implementation 'com.android.support:multidex:1.0.3'
      // ...
    }
    ```
1. Configure the Multidex options:
    ```
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
1. Extend the Android Application class (`android.app.Application`) and add code
   to Import and initialize Reader SDK:
    ```
    import com.squareup.sdk.reader.ReaderSdk;

    public class ExampleApplication extends Application {

      @Override public void onCreate() {
        super.onCreate();
        ReaderSdk.initialize(this);
      }

      @Override protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        // Required if minSdkVersion < 21
        MultiDex.install(this);
      }
    }
    ```


## Step 5: Install Reader SDK for iOS

To use the React Native plugin on iOS devices, you need to install Reader
SDK for iOS so it is available to the React Native library as a resource.
The key installation steps are outlined below. For more information on
installing Reader SDK for iOS, see the [Reader SDK iOS Setup Guide] at
[docs.connect.squareup.com].

**TIP**: You can find the minimum supported Reader SDK version for iOS in the
[root README] for this repo.

1. Change to the iOS folder (`ios`) at the root of your React Native project.
1. Download and configure the latest version of `SquareReaderSDK.framework` in
   your project root by replacing `YOUR_SQUARE_READER_APP_ID` and
   `YOUR_SQUARE_READER_REPOSITORY_PASSWORD` with your Reader SDK credentials and
   `READER_SDK_VERSION` with the Reader SDK version you are using in the code
   below. **The framework will install in the current directory**.
    ```bash
    ruby <(curl https://connect.squareup.com/readersdk-installer) install \
    --version READER_SDK_VERSION                                          \
    --app-id YOUR_SQUARE_READER_APP_ID                                    \
    --repo-password YOUR_SQUARE_READER_REPOSITORY_PASSWORD
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
1. Update the `application:didFinishLaunchingWithOptions:` method in your app
   delegate to initialize Reader SDK:
    ```
    #import "AppDelegate.h"

    #import <React/RCTBundleURLProvider.h>
    #import <React/RCTRootView.h>

    @import SquareReaderSDK;

    @implementation AppDelegate

    (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    {

    // ...

    [SQRDReaderSDK initializeWithApplicationLaunchOptions:launchOptions];
    return YES;
    }

    @end
    ```

You will also need to add code to your React Native project to request device and
microphone permissions. See the React Native Reader SDK Quick Start Sample App
for an example of how to do this.


## Step 6: Implement Reader SDK authorization

Add code to your React Native project that authorizes Reader SDK:

```javascript
import {
  authorizeAsync,
  AuthorizeErrorNoNetowrk,
  UsageError,
} from 'react-native-square-reader-sdk';
...

try {
  // authCode is a mobile authorization code from the Mobile Authorization API
  const authorizedLocation = await authorizeAsync(authCode);
  // Authorized and authorizedLocation is available
} catch(ex) {
  switch(ex.code) {
    case AuthorizeErrorNoNetowrk:
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

```javascript
import {
  startCheckoutAsync,
  CheckoutErrorCancelled,
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
  alwaysRequireSignature: true,
  allowSplitTender: false,
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
[docs.connect.squareup.com]: https://docs.connect.squareup.com
[Mobile Authorization API]: https://docs.connect.squareup.com/payments/readersdk/mobile-authz-guide
[Reader SDK]: https://docs.connect.squareup.com/payments/readersdk/overview
[Square Dashboard]: https://squareup.com/dashboard/
[update policy for Reader SDK]: https://docs.connect.squareup.com/payments/readersdk/overview#readersdkupdatepolicy
[Testing Mobile Apps]: https://docs.connect.squareup.com/testing/mobile
[squareup.com/activate]: https://squareup.com/activate
[Building Projects with Native Code]: https://facebook.github.io/react-native/docs/getting-started.html
[Square Application Dashboard]: https://connect.squareup.com/apps/
[Reader SDK Android Setup Guide]: https://docs.connect.squareup.com/payments/readersdk/setup-android
[Reader SDK iOS Setup Guide]: https://docs.connect.squareup.com/payments/readersdk/setup-ios
[root README]: ../README.md
[yarnpkg.com]: https://yarnpkg.com/lang/en/docs/install/
[React Native Getting Started]: https://facebook.github.io/react-native/docs/getting-started.html
