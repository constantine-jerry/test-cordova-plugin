var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Cordova, IonicNativePlugin, Plugin } from '@ionic-native/core';
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
var MyCordovaPlugin = (function (_super) {
    __extends(MyCordovaPlugin, _super);
    function MyCordovaPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyCordovaPlugin.prototype.showNativeAlert = function (arg0) {
        return;
    };
    MyCordovaPlugin.decorators = [
        { type: Injectable },
    ];
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", Promise)
    ], MyCordovaPlugin.prototype, "showNativeAlert", null);
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
    MyCordovaPlugin = __decorate([
        Plugin({
            pluginName: 'MyCordovaPlugin',
            plugin: 'my-cordova-plugin',
            // npm package name, example: cordova-plugin-camera
            pluginRef: 'cordova.plugins.MyCordovaPlugin',
            // the variable reference to call the plugin, example: navigator.geolocation
            repo: '',
            // the github repository URL for the plugin
            install: '',
            // OPTIONAL install command, in case the plugin requires variables
            installVariables: [],
            // OPTIONAL the plugin requires variables
            platforms: ['Android', 'iOS'] // Array of platforms supported, example: ['Android', 'iOS']
        })
    ], MyCordovaPlugin);
    return MyCordovaPlugin;
}(IonicNativePlugin));
export { MyCordovaPlugin };
//# sourceMappingURL=index.js.map