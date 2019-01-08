/********* MyCordovaPlugin.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>

@interface MyCordovaPlugin : CDVPlugin {
  // Member variables go here.
}

- (void)coolMethod:(CDVInvokedUrlCommand*)command;

- (void)showNativeAlert:(CDVInvokedUrlCommand*)command;

@end

@implementation MyCordovaPlugin

- (void)coolMethod:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];
    
    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)showNativeAlert:(CDVInvokedUrlCommand*)command
{
    NSTimeInterval delay = [[command.arguments objectAtIndex:0] doubleValue];

    UIViewController* rootViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    UIAlertController* alertController = [UIAlertController alertControllerWithTitle:nil message:@"这是 iOS 原生 Alert" preferredStyle:UIAlertControllerStyleAlert];
    [rootViewController presentViewController:alertController animated:YES completion:^{
        CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"succeed!"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [alertController dismissViewControllerAnimated:YES completion:nil];
    });
}

@end
