# cutphoto

## 模拟微信裁剪头像
 1.    js模拟微信裁剪头像, 支持移动和缩放图片
 2.    利用exif.js解决iphone上图片竖拍的bug(所以可以部分支持旋转)
 3.    这只是一个组件, 核心是src/components/CutPhoto.vue文件. 需要使用时请自行定制
 4.    demo是基于*vue2.0*的, 所以这里的CutPhoto.vue也是基于2.0的. 想要支持1.0, 需要把代码里的*mounted*改为*ready*, 然后往下看
 5.    src/js下的finger2.js是基于[vueFinger](https://github.com/Samlin901211/vuefinger)的扩展, 因为vueFinger暂时不支持vue2.0. 如果想要切换到vue1.0, 请直接使用vueFinger

``` bash
import VueFinger from '../js/finger2.js'
# 改为
import VueFinger from 'vuefinger'

```
 6.    组件里用到了flexible.js, 这*不是*必须的, 如果使用了别的布局方案, 需要使用时还请自行修改源码.
 
## 使用方法
  >   需要给组件传入一个对象:photoOptions, 这个对象包括三个属性
  >   **     photoToCut: 待裁剪图片的url  (注意, 这里不能引用跨域资源)
  >   **     handler: 处理裁剪后得到的*dataURL*数据的回调函数
  >   **     ratio: 裁剪矩阵的高/宽

 
## Demo

### 请用手机浏览器扫描下方二维码(不要用微信, 因为demo最后调用了window.open打开裁剪后的图片, 微信可能会导致不响应)

![](https://github.com/clarkshao/cutphoto/blob/master/qrcode.png)