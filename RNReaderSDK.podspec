
Pod::Spec.new do |s|
  s.name         = "RNReaderSDK"
  s.version      = "1.1.4"
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
  s.xcconfig     = { 'FRAMEWORK_SEARCH_PATHS' => '$(PROJECT_DIR)/../' }

  s.dependency "React"
end
