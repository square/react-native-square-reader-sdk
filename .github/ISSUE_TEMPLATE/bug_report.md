---
name: 🐛 Issue report
about: I hit an error when I tried to use this plugin.
---

### Describe the issue
<!--
  A clear and concise description of what the issue is.

  For example - When I try to authorize my Reader with a valid location and
  OAuth access token, the plugin returns an exception with message
  "Cannot read property 'authorize' of undefined."

  Error log details:
  ```
  // paste your error log here
  ```
-->

### To Reproduce
<!--
  Steps to reproduce the issue.

  For example - 
  1. Initialize the SDK
  1. Get a valid authz code
  1. Call `await RNReaderSDKAuthorization.authorize(authCode);` and failed

  Here the piece of code that reproduce the issue.

  ```javascript
  const { RNReaderSDKAuthorization, RNReaderSDKCheckout, RNReaderSDKReaderSettings } = NativeModules;

  export async function authorizeAsync(authCode) {
    try {
      // it looks like that RNReaderSDKAuthorization is undefined
      return await RNReaderSDKAuthorization.authorize(authCode);
    } catch (ex) {
      throw createReaderSDKError(ex);
    }
  }
  ```
-->

### Expected behavior
<!--
  A clear and concise description of what you expected to happen.

  For example - The authorization should complete successfully with my valid authz token.
-->


**Environment (please complete the following information):**
<!--
  - platform: [e.g. iOS or Android]
  - OS and version: [e.g. iOS8.1]
  - dev environment: [e.g. MacOS or Windows]
  - Reader SDK version: [e.g. 1.1.1]

  In addition: Run `react-native info` in your terminal and copy the results here.
-->

### Screenshots
<!-- If applicable, add screenshots to help explain your problem. -->

### Additional context
<!-- Add any other context about the problem here. -->
