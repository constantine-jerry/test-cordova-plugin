### 如何给 `ionic` 自定义一个 `Cordova` 插件

#### 0. 什么是 `Cordova plugins`

在我们准备创建自己的 `Cordova Plugin` 之前, 让我们先说一下什么是 `Cordova plugin`, 还有什么是 `Cordova`. 

`Cordova` 是一个命令行工具的集合; 也是一个 `Plugin Bridge`, 通过这个 `Plugin Bridge` 可以创建 `Native App`. 这些 `Native App` 是建立在一个 `Web View` 上的, 通过 `JavaScript` 可以调用 `Native Code`. 当我们安装 `Cordova` 在我们的电脑上, 我们是安装了一个工具集, 帮助我们打包 `Web Content`, 装进 `Native App` 容器, 部署到设备或模拟器进行测试, 以及构建二进制可执行文件包发布到 `App Store`.

在这个容器内部是一个相对较小的 `Bridge`, 它将我们所做的某些 `JavaScript` 调用传输到相应的 `native code` 中, 使我们的应用能够执行复杂的, 本机的活动 (native things), 而这些活动 (native things) 并没有融入到标准的 `Web APIs` 中.

构建 `Gordova pugin` 意味着我们可以通过写一些 `JavaScript` 代码去调用 `Native Code` (`Obj-c/Swift`, `Java`, etc.), 并返回结果给 `JavaScript`.

总而言之, 当我们想做一些原生的功能而 `Web API` 又做不到时, 我们就可以构建一个 `Cordava plugin`. 例如在 `iOS` 上访问 `HealthKit` 数据或者在 `Android` 上使用指纹识别.

#### 1. 新建一个 `ionic` 测试项目

``` sh
➜  ionic start test-cordova tabs
➜  cd test-cordova
```

#### 2. 新建一个 `Cordova` 插件

为项目添加 `Android` 平台和 `iOS` 平台
``` sh
➜  ionic cordova platform add android
➜  ionic cordova platform add ios
```

这时候目录结构是这样的:

``` sh
➜  test-cordova git:(master) ✗ ll
total 520
-rw-r--r--    1 justin  staff   6.2K  1  3 20:57 config.xml
-rw-r--r--    1 justin  staff    99B  1  3 20:52 ionic.config.json
drwxr-xr-x  524 justin  staff    16K  1  3 20:57 node_modules
-rw-r--r--    1 justin  staff   233K  1  3 20:57 package-lock.json
-rw-r--r--    1 justin  staff   1.7K  1  3 20:57 package.json
drwxr-xr-x    4 justin  staff   128B  1  3 20:57 platforms
drwxr-xr-x   11 justin  staff   352B  1  3 20:57 plugins
drwxr-xr-x    7 justin  staff   224B  1  3 20:52 resources
drwxr-xr-x    9 justin  staff   288B  1  3 20:28 src
-rw-r--r--    1 justin  staff   519B 12 22 04:24 tsconfig.json
-rw-r--r--    1 justin  staff   178B 12 22 04:24 tslint.json
drwxr-xr-x    2 justin  staff    64B  1  3 20:52 www
```

注意要修改 `config.xml`:

``` xml
<widget id="io.ionic.starter" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
```

id 默认为 `io.ionic.starter`, 需要修改为自己的 `id`, 因为这个 `id` 是跟 `Xcode` 项目的 `Bundle ID` 绑定的

安装 `plugman`
``` sh
sudo npm install -g plugman
```

用 `plugman` 创建自定义 `Cordova` 插件:

``` sh
➜  test-cordova git:(master) ✗ mkdir src_plugins
➜  test-cordova git:(master) ✗ cd src_plugins
➜  src_plugins git:(master) ✗ plugman create --name MyCordovaPlugin --plugin_id my-cordova-plugin --plugin_version 0.0.1
➜  src_plugins git:(master) ✗ cd MyCordovaPlugin
➜  MyCordovaPlugin git:(master) ✗ plugman platform add --platform_name android
➜  MyCordovaPlugin git:(master) ✗ plugman platform add --platform_name ios
```

创建 `package.json` 文件

``` sh
➜  MyCordovaPlugin git:(master) ✗ plugman createpackagejson .
name: (my-cordova-plugin) MyCordovaPlugin
version: (0.0.1)
description: test
git repository:
author: Justin Liang
license: (ISC)
About to write to /Users/justin/dev/learn/ionic-angular/test-cordova/plugins/MyCordovaPlugin/package.json:

{
  "name": "MyCordovaPlugin",
  "version": "0.0.1",
  "description": "test",
  "cordova": {
    "id": "my-cordova-plugin",
    "platforms": [
      "android",
      "ios"
    ]
  },
  "keywords": [
    "ecosystem:cordova",
    "cordova-android",
    "cordova-ios"
  ],
  "author": "Justin Liang",
  "license": "ISC"
}


Is this OK? (yes)
```

新建的插件的目录结构是这样的:

``` sh
➜  MyCordovaPlugin git:(master) ✗ tree .
.
├── package.json
├── plugin.xml
├── src
│   ├── android
│   │   └── MyCordovaPlugin.java
│   └── ios
│       └── MyCordovaPlugin.m
└── www
    └── MyCordovaPlugin.js

4 directories, 5 files
```

为 `ionic` 项目添加插件:
``` sh
➜  test-cordova git:(master) ✗ ionic cordova plugin add src_plugins/MyCordovaPlugin
```

#### 3. 在 `ionic` 调用插件

让我们看看 `plugman` 创建好的模板代码

`test-cordova/plugins/MyCordovaPlugin/www/MyCordovaPlugin.js`:

``` js
var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'MyCordovaPlugin', 'coolMethod', [arg0]);
};
```

`test-cordova/plugins/MyCordovaPlugin/src/android/MyCordovaPlugin.java`:

``` java 
package my-cordova-plugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class echoes a string called from JavaScript.
 */
public class MyCordovaPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("coolMethod")) {
            String message = args.getString(0);
            this.coolMethod(message, callbackContext);
            return true;
        }
        return false;
    }

    private void coolMethod(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }
}
```

`test-cordova/plugins/MyCordovaPlugin/src/ios/MyCordovaPlugin.m`:

``` Objc
/********* MyCordovaPlugin.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>

@interface MyCordovaPlugin : CDVPlugin {
  // Member variables go here.
}

- (void)coolMethod:(CDVInvokedUrlCommand*)command;
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

@end

```

从上面的文件中, 我们可以很容易找到规律, `MyCordovaPlugin.js` 里面的方法跟各个平台的代码的方法对应, `Android` 的代码是 `MyCordovaPlugin.java`, `iOS` 的代码是 `MyCordovaPlugin.m`. 我们要实现的具体逻辑就在各个平台的代码文件里实现.

`plugman` 为我们创建好的这三个文件里, 默认生成了一个名为 `coolMethod` 的方法, 我们参照它来新增一个方法 `showNativeAlert`. 该方法的作用是: 传入一个 `delay` 参数, 弹出原生的 `Alert` 窗口, 并根据 `delay` 的值自动消失.

首先, 我们修改 `test-cordova/plugins/my-cordova-plugin/www/MyCordovaPlugin.js`, 添加一个方法 `showNativeAlert`:

``` js
exports.showNativeAlert = function (arg0, success, error) {
    exec(success, error, 'MyCordovaPlugin', 'showNativeAlert', [arg0]);
};
```

修改 `test-cordova/src/pages/home/home.html`, 在首页添加一个按钮:
``` html
<ion-header>
  <ion-navbar>
    <ion-title>Home</ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>
  <h2>Welcome to Ionic!</h2>
  <p>
    This starter project comes with simple tabs-based layout for apps
    that are going to primarily use a Tabbed UI.
  </p>
  <p>
    Take a look at the <code>src/pages/</code> directory to add or change tabs,
    update any existing page or create new pages.
  </p>
  <button ion-button (click)="testCordovaPlugin()">
    测试 cordova plugin
  </button>
</ion-content>
```

并修改 `test-cordova/src/pages/home/home.ts`, 创建一个按钮的点击事件方法:

``` js
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

declare const cordova;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  private testCordovaPlugin() {
    cordova.plugins.MyCordovaPlugin.showNativeAlert(2, (result)=> {
      console.log(result);
    }, (err) => {
      console.error(err)
    });
  }
}
```

接下来我们修改一下 `iOS` 平台的代码(`MyCordovaPlugin.m`), 对应 `JavaScript` 代码新增一个 `- (void)showNativeAlert:(CDVInvokedUrlCommand*)command` 方法: 

``` objc
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
```

到这里, 我们已经完成新增一个自定义的方法了. 下面编译前端的代码并部署到 iOS 工程:

``` sh
➜  test-cordova git:(master) ✗ ionic cordova prepare ios
```

> 注意: 
> 上面我们修改了 `MyCordovaPlugin.m`, 并执行了 `ionic cordova prepare ios` 命令, 本来期望 `Xcode` 工程的 `MyCordovaPlugin.m` 也会修改, 但实际上是没有的. 我们暂时手动修改 `Xcode` 工程的 `MyCordovaPlugin.m`, 这样做比较麻烦, 后面再研究怎么解决.
> (以我的环境, Xcode 工程 `MyCordovaPlugin.m` 的文件路径是: `test-cordova/platforms/ios/MyApp/Plugins/my-cordova-plugin/MyCordovaPlugin.m`)

接下来, 我们打开 `Xcode` 工程 (`test-cordova/platforms/ios/MyApp.xcworkspace`), 在模拟器上运行, 在首页可以看到一个 `测试 cordova plugin` 的按钮, 点击后会弹出 `iOS` 原生 `Alert`, 2 秒后自动消失. 如图:

<img width="50%" height="50%" src="https://github.com/constantine-jerry/readme-pic/raw/master/images/test-cordova-plugin/ios_implement_without_ionic_native.jpg"/>

至此, 我们已经能够成功的利用 `Cordova` 插件来调用原生平台的功能了.

### 4. 使用 `ionic native` 来封装 `Cordova` 插件

虽然我们能够调用原生的功能了, 但是不够优雅. 目前在 `JavaScript` 端是这么调用插件接口的:

``` js
declare const cordova;

...

private testCordovaPlugin() {
    cordova.plugins.MyCordovaPlugin.showNativeAlert(2, (result)=> {
      console.log(result);
    }, (err) => {
      console.error(err)
    });
}
```

这样做的确可以工作, 但是有以下缺点:
- 没有类型类型声明, 插件调用者无法知道插件里有什么接口
- 不安全, 无法在编译的时候发现一些语法错误, 如调用插件的接口时写错了方法名
- 插件接口用的是回调 (`callback`) 参数, 并不是 `Promises` 或者 `Observables`, 如果回调多了不易于代码阅读
- 直接的插件调用使测试变得困难, 因为它们不容易被 `mock` 替换

因此, 我们可以用 `ionic native wrapper` 来封装我们的插件, 解决上述的缺点.

首先, 克隆 `ionic native` 项目并初始化:

``` sh
➜  test-cordova git:(master) ✗ cd /tmp
➜  /tmp git clone https://github.com/ionic-team/ionic-native/
➜  /tmp cd ionic-native
➜  ionic-native git:(master) npm install
➜  ionic-native git:(master) ✗ npm install @ionic-native/core --save
```

安装 gulp-cli 工具, 用来脚手架我们的 `ionic native wrapper`:

``` sh
➜  ionic-native git:(master) ✗ npm install --global gulp-cli
```

用 `gulp` 脚手架 `ionic native wrapper`:

``` sh
➜  /tmp cd ionic-native 
➜  ionic-native git:(master) ✗ gulp plugin:create -n MyCordovaPlugin  
```

这时候会在 `/tmp/ionic-native/src/@ionic-native/plugins` 下生成一个新的文件夹 `my-cordova-plugin`, `my-cordova-plugin` 文件夹里面有一个文件 `index.ts`, 我们先修改注解 `@Plugin`:

``` ts
@Plugin({
  pluginName: 'MyCordovaPlugin',
  plugin: 'my-cordova-plugin', // npm package name, example: cordova-plugin-camera
  pluginRef: 'cordova.plugins.MyCordovaPlugin', // the variable reference to call the plugin, example: navigator.geolocation
  repo: '', // the github repository URL for the plugin
  install: '', // OPTIONAL install command, in case the plugin requires variables
  installVariables: [], // OPTIONAL the plugin requires variables
  platforms: ['Android', 'iOS'] // Array of platforms supported, example: ['Android', 'iOS']
})
```

这里说一下几个重要的参数, `pluginName` 需要跟 `class name` 一致; `plugin` 是插件的 id, 需要跟 `/Users/justin/dev/learn/ionic-angular/test-cordova/plugins/MyCordovaPlugin/package.json` 里的 `id` 一致; `pluginRef` 这里一定要写对了, 前面是 `cordova.plugins.`, 后面跟着 `class name` (`MyCordovaPlugin`), 细心的同学应该发现 `cordova.plugins.MyCordovaPlugin` 跟上面的代码是一样的:

``` ts
declare const cordova;

...

private testCordovaPlugin() {
    cordova.plugins.MyCordovaPlugin.showNativeAlert(2, (result)=> {
      console.log(result);
    }, (err) => {
      console.error(err)
    });
}
```

然后我们要给 `class MyCordovaPlugin` 添加新的方法 `showNativeAlert`:

``` ts
import { Injectable } from '@angular/core';
import { Cordova, CordovaInstance, CordovaProperty, InstanceProperty, IonicNativePlugin, Plugin } from '@ionic-native/core';
import { Observable } from 'rxjs/Observable';

@Plugin({
  pluginName: 'MyCordovaPlugin',
  plugin: 'my-cordova-plugin', // npm package name, example: cordova-plugin-camera
  pluginRef: 'cordova.plugins.MyCordovaPlugin', // the variable reference to call the plugin, example: navigator.geolocation
  repo: '', // the github repository URL for the plugin
  install: '', // OPTIONAL install command, in case the plugin requires variables
  installVariables: [], // OPTIONAL the plugin requires variables
  platforms: ['Android', 'iOS'] // Array of platforms supported, example: ['Android', 'iOS']
})
@Injectable()
export class MyCordovaPlugin extends IonicNativePlugin {

  @Cordova()
  showNativeAlert(arg0: number): Promise<any> {
    return;
  }
}
```

修改完 `index.ts` 文件后, 执行命令:

``` sh
➜  ionic-native git:(master) ✗ npm run build my-cordova-plugin
```

然后我们可以看到 `ionic-native/dist/@ionic-native/my-cordova-plugin` 文件夹, 这就是编译生成的 `ionic native wrapper` 代码. 接着把 `my-cordova-plugin` 直接 `copy` 到 `test-cordova` 项目下的 `src_ionic_native_wrapper`(新建) 文件夹下. 

``` sh
➜  test-cordova git:(master) mkdir src_ionic_native_wrapper
➜  ionic-native git:(master) ✗ cp -r dist/@ionic-native/my-cordova-plugin ~/dev/learn/ionic-angular/test-cordova/src_ionic_native_wrapper
```

运行命令安装 `wrapper` 包:

``` sh
➜  test-cordova git:(master) npm install src_ionic_native_wrapper/ygsoft-qrcode-scan
```

现在, 我们可以使用 `ionic native wrapper` 的代码来调用我们的插件接口了.
我们回到 `test-cordova` 项目, 先修改 `test-cordova/src/app/app.module.ts` 文件, 导入 `MyCordovaPlugin`:

``` ts
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyCordovaPlugin } from '@ionic-native/my-cordova-plugin';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MyCordovaPlugin
  ]
})
export class AppModule {}

```

修改 `test-cordova/src/pages/home/home.ts`: 

``` ts
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MyCordovaPlugin } from '@ionic-native/my-cordova-plugin';

// declare const cordova;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private myCordovaPlugin: MyCordovaPlugin
    ) {

  }

  private testCordovaPlugin() {
    // cordova.plugins.MyCordovaPlugin.showNativeAlert(2, (result)=> {
    //   console.log(result);
    // }, (err) => {
    //   console.error(err)
    // });
    this.myCordovaPlugin.showNativeAlert(3)
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.error(err);
    })
  }
}

```

到此, 一切准备就绪! 我们继续在 `iOS` 平台测试, 编译部署代码到 `iOS` 平台:

``` sh
➜  home git:(master) ✗ ionic cordova prepare ios
```

然后用 `Xcode` 打开 `test-cordova/platforms/ios/MyApp.xcworkspace`, 在模拟器上运行, 我们可以看到跟 `第2章节` 一样的效果:

<img width="50%" height="50%" src="https://github.com/constantine-jerry/readme-pic/raw/master/images/test-cordova-plugin/ios_implement_with_ionic_native.jpg"/>

至此, 我们已经完成给 ionic 自定义一个 Cordova 插件的工作了. 🎉

#### 5. 补充

上面的教程只是创建了一个简单的插件, 插件只有一个接口, 就是显示原生系统的 `Alert` 窗口.

我们只实现了 `iOS` 平台的. 对应 `Android` 平台要实现同样效果, 需要修改 `test-cordova/plugins/MyCordovaPlugin/src/android/MyCordovaPlugin.java` 文件, 具体如何实现这里就不再赘述.

另外, 就某一个平台来说, 我们只引入了一个原生平台的源代码文件, 见 `test-cordova/plugins/my-cordova-plugin/plugin.xml`, 如 `iOS` 平台我们只引入了 `MyCordovaPlugin.m` 文件. 如果想实现更复杂的功能引入更多的文件, 需要编辑 `plugin.xml`. 这个文件比较重要, 想了解更多可以查看 [Cordova 官方文档](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html).

我们创建好 `ionic native wrapper` 后, 只是简单的 copy 到 `test-cordova/node_modules/@ionic-native` 文件夹下. 可以把 `ionic native wrapper` 的代码放到代码托管服务, 需要修改相应的 `package.json` 等配置文件, 想了解更多请自行查找相关文献.

个人认为, 写一个 `Cordova` 插件是一件很繁琐的事情. 需要写 `JavaScript` 接口代码, 写各个平台的原生实现代码, 还需要写 `ionic native wrapper`. 这些工作很多都跟业务无关的, 而且这过程中还用到很多脚手架工具. 所以如果不是很必要, 尽量在 H5 上实现功能.

Demo 地址: [https://github.com/constantine-jerry/test-cordova-plugin](https://github.com/constantine-jerry/test-cordova-plugin)

> 该教程是在 `macOS` 平台环境下调试的, `Windows` 的同学可以参照着做, 原理是一样的, 或者在 `Linux` 环境下调试.

#### 6. TODO

- [ ] 直接可用的 `Demo`, `github` 上的项目还不能直接运行
- [ ] 支持安卓平台
- [X] 支持 iOS 平台
- [ ] 更复杂的插件

#### 7. 参考文献

- [Cordova Docs](https://cordova.apache.org/docs/en/latest/guide/overview/index.html)
- [Build your first Cordova plugin for Ionic Native](https://medium.com/@sangkhim/build-your-first-cordova-plugin-for-ionic-native-38d29a170145)
- [How to write Cordova Plugins](https://medium.com/ionic-and-the-mobile-web/how-to-write-cordova-plugins-864e40025f2)
- [Ionic Native Developer Guide](https://github.com/ionic-team/ionic-native/blob/master/DEVELOPER.md)
- [使用 Ionic Native 集成自定义插件](https://blog.csdn.net/u012125121/article/details/78997866)

