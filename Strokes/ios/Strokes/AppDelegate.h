#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <Expo/Expo.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : EXAppDelegateWrapper <UNUserNotificationCenterDelegate> // Conform to the UNUserNotificationCenterDelegate protocol

@end
