## Changelog

### v1.3.1 January 8, 2020

* Bumped Nested handlebars dependency from 4.2.0 to 4.5.3
* Removed last mention of android.support syntax

### v1.3.0 Oct 22, 2019

* Update Square Reader SDK minimum supported version to 1.3.3 in order to support iOS 13
* Now requires Xcode 10.2+

### v1.2.3 September 12, 2019

* Add delay capture support

### v1.2.2 September 10, 2019

* Update to be compatible with Android Reader SDK 1.3.1, and now supports AndroidX
  but the new feature "delay capture" hasn't been supported yet.

### v1.2.1 May 29, 2019

* Update to be compatible with Android Reader SDK 1.3.0,
  but the new feature "delay capture" hasn't been supported yet.

### v1.2.0 Mar 28, 2019

* Support Android Reader SDK 1.2.1.

### v1.1.4 Mar 22, 2019

* Add podspec to support cocoapods ios project.

### v1.1.3 Mar 21, 2019

* fix "tipPercentages" setting doesn't work with react-native 0.58.0+ on iOS.

### v1.1.2 Mar 13, 2019

* add **store customer card** suport.

### v1.1.1 Mar 5, 2019

* fix missing `collectSignature` for android checkout parameter.

### v1.1.0 Mar 3, 2019

* remove `alwaysRequireSignature` and add `collectSignature` to checkout configuration.
* bump the minimum dependency to Reader SDK 1.1.1(iOS)/1.1.3(Android).
* this change **does NOT** include all new features introduced in Reader SDK 1.1.* such as **Store customer card**, see reader SDK [Change Log](https://docs.connect.squareup.com/changelog/mobile-logs/2019-02-13) for details.

### v1.0.3 Oct 9, 2018

* fixed iOS threading issue.

### v1.0.2 Oct 4, 2018

* fixed Android plugin compile regression.

### v1.0.1 Oct 4, 2018

* fixed iOS `location.currencyCode` conversion bug, change int to string (ISOCurrencyCode)
* fixed Android checkout parameter currencyCode validation

### v1.0.0 Sep 27, 2018

* Initial release.
