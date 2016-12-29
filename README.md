# cutphoto

## cut photo like weixin
 1.    js模拟微信裁剪头像, 支持移动和缩放图片
 2.    利用exif.js解决iphone上图片竖拍的bug(所以可以部分支持旋转)
 3.    这只是一个组件, 核心是src/components/CutPhoto.vue文件. 需要使用时请自行定制
 4.    demo是基于vue2.0的, 所以这里的CutPhoto.vue也是基于2.0的. 想要支持1.0, 需要把代码里的mounted改为ready, 然后往下看
 5.    src/js下的finger2.js是基于[vueFinger](https://github.com/Samlin901211/vuefinger), 因为vueFinger暂时不支持vue2.0. 如果想要切换到vue1.0, 请直接使用vueFinger

``` bash
import VueFinger from '../js/finger2.js'
# 改为
import VueFinger from 'vuefinger'

```

## Demo

## 请用手机浏览器扫描下方二维码(不要用微信, 因为demo最后调用了window.open打开裁剪后的图片, 微信可能会导致不响应)

![](https://github.com/clarkshao/cutphoto/blob/master/qrcode.png)