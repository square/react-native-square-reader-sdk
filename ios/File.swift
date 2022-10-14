import Foundation
import SquareReaderSDK

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
   var bridge: RCTBridge!

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
     let jsCodeLocation: URL

     jsCodeLocation = RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource:nil)
     let rootView = RCTRootView(bundleURL: jsCodeLocation, moduleName: "RNReaderSDK", initialProperties: nil, launchOptions: launchOptions)
     let rootViewController = UIViewController()
     rootViewController.view = rootView

     self.window = UIWindow(frame: UIScreen.main.bounds)
     self.window?.rootViewController = rootViewController
     self.window?.makeKeyAndVisible()
     SQRDReaderSDK.initialize(applicationLaunchOptions: launchOptions)

     return true
   }
}