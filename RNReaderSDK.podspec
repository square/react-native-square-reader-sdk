
Pod::Spec.new do |s|
  s.name         = "RNReaderSDK"
  s.version      = "1.1.5"
  s.summary      = "A React Native plugin for Square Reader SDK"
  s.description  = <<-DESC
                  A React Native plugin for Square Reader SDK
                   DESC
  s.homepage     = "https://github.com/square/react-native-square-reader-sdk"
  s.license      = { :file => 'LICENSE' }
  s.author       = { "Square, Inc." => "xiao@squareup.com" }
  s.platform     = :ios, "11.1"
  s.source       = { :path => 'ios' }
  s.source_files  = "ios/**/*.{h,m}"
  s.public_header_files = 'ios/**/*.h'
  s.requires_arc = true
  s.frameworks   = 'SquareReaderSDK'
  s.xcconfig = {
    'ENABLE_BITCODE' => 'NO',
    'FRAMEWORK_SEARCH_PATHS[sdk=iphoneos*]' => '$(inherited) $(PROJECT_DIR)/../SquareReaderSDK.xcframework/ios-arm64',
    'FRAMEWORK_SEARCH_PATHS[sdk=iphonesimulator*]' => '$(inherited) $(PROJECT_DIR)/../SquareReaderSDK.xcframework/ios-arm64_x86_64-simulator'
  }

  s.dependency "React"
end
