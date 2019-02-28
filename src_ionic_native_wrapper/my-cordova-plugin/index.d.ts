import { IonicNativePlugin } from '@ionic-native/core';
/**
 * @name My Cordova Plugin
 * @description
 * This plugin does something
 *
 * @usage
 * ```typescript
 * import { MyCordovaPlugin } from '@ionic-native/my-cordova-plugin';
 *
 *
 * constructor(private myCordovaPlugin: MyCordovaPlugin) { }
 *
 * ...
 *
 *
 * this.myCordovaPlugin.functionName('Hello', 123)
 *   .then((res: any) => console.log(res))
 *   .catch((error: any) => console.error(error));
 *
 * ```
 */
export declare class MyCordovaPlugin extends IonicNativePlugin {
    showNativeAlert(arg0: number): Promise<any>;
}
