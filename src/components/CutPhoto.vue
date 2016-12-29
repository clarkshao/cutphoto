<template>
    <div>
        <h1>
            <div @click="getImage">使用</div>
        </h1>
        <div>
            <canvas id="canvas" style="z-index: 9999;" :width="canvasWidth" :height="canvasHeight"
                    v-finger:options="options" @touchend="reset"></canvas>
            <div class="mask" :style="{
        width:  cutWidth+'px',
        height:  cutHeight+'px',
        borderWidth: rectY +'px ' + rectX +'px'
        }"></div>
        </div>
        <div style="display: none;">
            <canvas id="canvas_dp" style="z-index: 100; " :height="cutHeight" :width="cutWidth"></canvas>
        </div>
    </div>

</template>

<script type="text/ecmascript-6">

    import Vue from 'vue'
    import VueFinger from '../js/finger2.js'
    import EXIF from '../js/exif.js'


    Vue.use(VueFinger)

    const canvasWidth = document.documentElement.clientWidth
    const canvasHeight = document.documentElement.clientHeight

    const isIOS = /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)

    console.log(`canvasWidth:${canvasWidth}`)

    function preventDef (ev) {
        ev.preventDefault();
    }

    export default {
        /**
         * photoOptions: @object
         *   -   photoToCut: 待裁剪图片的url  (注意, 这里不能引用跨域资源)
         *   -   handler: 裁剪后得到的dataURL数据的处理函数
         *   -   ratio: 裁剪矩阵的高/宽
         */
        props:['photoOptions'],
        data () {
        return {
            options: {
                pinch:function(evt) {
                    this.bgscale = evt.scale
                    requestAnimationFrame(function(){
                        this.utilFuncs.drawBackgroundImage()
                    }.bind(this))
                }.bind(this),
                pressmove: function(evt){
                    this.curX = +evt.disX
                    this.curY = +evt.disY
                    requestAnimationFrame(function(){
                        this.utilFuncs.drawBackgroundImage()
                    }.bind(this))
                }.bind(this)
            },
            imageOriginWidth: 0,
            imageOriginHeight: 0,
            image: new Image(),
            scale: 1,
            bgscale: 1,
            baseX: 0,
            baseY: 0,
            curX: 0,
            curY: 0,
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            isUploading: false,
            context2: null,
            canvas2: null,
            imageData: null,
            //旋转步数
            step: 0,
            utilFuncs:{}
        }
    },
    methods:{
        reset: function(){
            this.imageOriginWidth = this.image.width
            this.imageOriginHeight = this.image.height
            this.scale *= this.bgscale
            this.bgscale = 1
            this.baseX += this.curX
            this.baseY += this.curY
            this.curX = 0
            this.curY = 0
        },
        getImage: function(){
            this.context2.clearRect(0, 0, this.canvas2.width, this.canvas2.height)
            this.context2.putImageData(this.imageData, 0, 0)
            var im = document.getElementById('canvas_dp').toDataURL('image/jpeg')
            this.photoOptions.handler(im)
        }
    },
    computed:{
        //裁剪矩阵的宽度
        cutWidth(){
            return (this.canvasWidth - 40*dpr)
        },
        //裁剪矩阵的高度
        cutHeight(){
            return (this.photoOptions.ratio||1)*(this.canvasWidth - 40*dpr)
        },
        //裁剪矩阵初始x坐标
        rectX: function(){
            return (canvasWidth - this.cutWidth)/2
        },
        //裁剪矩阵初始y坐标
        rectY(){
            return (canvasHeight - this.cutHeight)/2
        }
    },
        //"ready" when use vue 1.0
    mounted(){
        (function(){
            document.querySelector('body').addEventListener('touchmove', preventDef)
        })()

        var _this = this
        const cutWidth = this.cutWidth, cutHeight = this.cutHeight, image = this.image
        var canvas = document.getElementById('canvas'), context = canvas.getContext('2d')
        this.canvas2 = document.getElementById('canvas_dp')
        this.context2 = this.canvas2.getContext('2d')

        function drawBackgroundImage(){

            image.width = this.imageOriginWidth * this.bgscale
            image.height = this.imageOriginHeight * this.bgscale
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'rgba(0, 0, 0,.9)';
            context.fillRect(0,0,canvas.width,canvas.height);

            var degree = this.step * 90 * Math.PI / 180;
            switch (this.step) {
                case 0:
                    context.drawImage(image, (this.curX + this.baseX), (this.curY + this.baseY), image.width, image.height);
                    break;
                case 1:
                    context.rotate(degree);
                    context.drawImage(image, (this.curY + this.baseY), -(canvasWidth + this.curX + this.baseX), image.width, image.height);
                    context.rotate(-degree);
                    break;
                case 2:
                    context.rotate(degree);
                    context.drawImage(image, -(canvasWidth + this.curX + this.baseX), -(canvasHeight + this.curY + this.baseY), image.width, image.height);
                    context.rotate(-degree);
                    break;
                case 3:
                    context.rotate(degree);
                    context.drawImage(image, -(canvasWidth +this.curY + this.baseY), ( this.curX + this.baseX), image.width, image.height);
                    context.rotate(-degree);
                    break;
            }
            this.imageData = context.getImageData(this.rectX, this.rectY, cutWidth, cutHeight);
        }

        this.utilFuncs.drawBackgroundImage = drawBackgroundImage.bind(this)

        image.src = this.photoOptions.photoToCut;


        image.crossOrigin = "Anonymous"
        image.onload = function () {
            if(isIOS){
                EXIF.getData(image, function() {
                    let Orientation = EXIF.getTag(this, 'Orientation');
                    //如果方向角不为1，都需要进行旋转
                    if(Orientation != "" && Orientation != 1){
                        switch(Orientation){
                            case 6://需要顺时针（向左）90度旋转
                                _this.step = 1
                                break;
                            case 8://需要逆时针（向右）90度旋转
                                _this.step = 3
                                break;
                            case 3://需要180度旋转
                                _this.step = 2
                                break;
                        }
                    }
                    onLoadCallback.call(_this)
                });
            } else{
                onLoadCallback.call(_this)
            }
        };

        function onLoadCallback(){
            var sc = image.width/canvas.width
            image.width = canvas.width
            image.height = image.height / sc
            setTimeout(function(){
                this.imageOriginWidth = image.width
                this.imageOriginHeight = image.height
                switch(this.step){
                    case 0:
                        this.baseY = (canvas.height - image.height)/2
                        break;
                    case 1:
                        this.baseY = (canvas.height - image.width)/2
                        this.baseX = -(canvas.width - image.height)/2
                        break;
                    case 2:
                        this.baseY = -(canvas.height - image.height)/2
                        break;
                    case 3:
                        this.baseY = (canvas.height - image.width)/2
                        this.baseX = (canvas.width - image.height)/2
                        break;
                }
                drawBackgroundImage.apply(this);
            }.bind(this))
        }
    },
    destroyed(){
        document.querySelector('body').removeEventListener('touchmove', preventDef)
    }
}

</script>
<style scoped>
    h1{
        width: 100%;
        height: .8rem;
        position: fixed;
        top: 0;
        z-index: 100;
        background: rgba(100,100,100,.2);
        color: white;
        margin: 0;
    }

    h1 div{
        background: #06dc3f;
        width: 1rem;
        position: absolute;
        right: 0;
        height: .7rem;
        line-height: .7rem;
        font-size: .32rem;
        top: .05rem;
        text-align: center;
        border-radius: 2px;
        box-shadow: 3px 2px 10px rgba(0, 0, 0, 0.29);
    }

    .mask{
        position: absolute;
        box-sizing: content-box;
        left: 0;
        top: 0;
        pointer-events: none;
        border-style: solid;
        border-color: rgba(0,0,0,.3);
    }
</style>