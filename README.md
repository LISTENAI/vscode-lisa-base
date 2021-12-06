# 核心插件lisa-base readme





lisa-base是LISTENAI官方发布的IDE基础插件。



### lisa-base 主要特性

1. 支持通过界面快捷键创建工程
2. 支持通过界面快捷键进行编译、烧录操作
3. 支持通过lisa快捷菜单快速执行lisa命令



### 使用指引

#### 安装工具

- Visual Studio Code

Visual Studio Code(VSC)是一款广泛使用的IDE工具，请在VSC官网根据操作系统下载适配的版本并安装。



 - 安装LISA环境

LISA是LISTENAI官方提供的包管理服务框架，请参考： [搭建lisa本地环境](https://docs.listenai.com/tools/LISA_LPM/installation)



 - 安装插件

运行Visual Studio Code，在插件市场搜索lisa，点击[安装]对插件进行安装，如图：



![clip_image001](https://cdn.iflyos.cn/public/studio_assets/images/clip_image001.png)


安装完成后，可观察到状态后有三个快捷按钮，点击左侧lisa插件图标，可唤出[工程&lisa快捷菜单]，如图：

![clip_image003](https://cdn.iflyos.cn/public/studio_assets/images/clip_image003.png)

为方便后续的功能使用，建议根据提示进行登录操作，如图：

![clip_image005](https://cdn.iflyos.cn/public/studio_assets/images/clip_image005.png)

![clip_image007](https://cdn.iflyos.cn/public/studio_assets/images/clip_image007.png)

#### 新建工程
插件支持通过工程快捷菜单或状态栏快捷键对工程进行创建

- 选择工程目录

点击工程快捷栏的[新建工程]或状态栏的[＋]按钮，可弹出新建工程目录选择选项，点击[浏览]进行工程目录的选择，如图：

![clip_image009](https://cdn.iflyos.cn/public/studio_assets/images/clip_image009.png)

- 工程创建与配置

根据命令行终端的提示输入工程名称，并选择工程类型、其他工程参数，完成工程创建，如图：

![clip_image011](https://cdn.iflyos.cn/public/studio_assets/images/clip_image011.png)

工程创建完毕后，会自动在新窗口打开新的工程。



#### 打开已有工程

若要打开已有工程，可依次选择[文件->打开文件夹->选择工程目录]进行打开。




#### 编译与烧录工程
插件支持通过工程快捷菜单或状态栏快捷键对工程代码进行编译与烧录，如图：

![clip_image012](https://cdn.iflyos.cn/public/studio_assets/images/clip_image012.png)