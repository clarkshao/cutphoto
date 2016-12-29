/**
 * @Author    tinylin
 * @DateTime  2016-09-12
 * @private
 */
function getTime() {//获取当前时间
	return new Date().getTime();
}
function getDistance(pointA,pointB) {
	return Math.sqrt((pointA.X - pointB.X) * (pointA.X - pointB.X) + (pointA.Y - pointB.Y) * (pointA.Y - pointB.Y));
}
function getVectorDistance(vector) {
	return Math.sqrt(vector.X * vector.X + vector.Y * vector.Y);
}
function getRotateAngle(vectorA,vectorB) {
	var direction = getRotateDirection(vectorA,vectorB);
	var disA = getVectorDistance(vectorA);
	var disB = getVectorDistance(vectorB);
	var mr = disA * disB;
	if(mr === 0) return 0;
	var dot = vectorA.X * vectorB.X + vectorA.Y * vectorB.Y;
	var  r = dot / mr;
	if(r > 1) r = 1;
	if(r < -1) r = -1;
	return Math.acos(r) * direction * 180 / Math.PI;
}
function getRotateDirection(vectorA,vectorB) { //-1:counterclockwise 1 :clockwise
	return vectorA.X * vectorB.Y - vectorB.X * vectorA.Y > 0 ? 1 : -1;
}

class Finger {

	constructor(el, options){
		this.pointA = "";
		this.pointB = "";
		this.pointA_end = "";
		this.pointB_end = "";
		this.DoublePoint = "";
		this.DoubleTapTime = 0;//为2才触发双击
		this.lastTime;//上一次触发开始的时间
		this.longpressInt;//长按间隔
		this.doubleTabInt;//双击自动消除lastpoint
		this.distance;
		this.vector;
		this.el = el;
		this.update(options);
	}

	update (options) {
		const { tap , longpress , doubletap , pinch , rotate , swipe , pressmove , singlestartcallback , singleendcallback , multistartcallback , multiendcallback } = options;

		this.tap = tap || function() {};
		this.longpress = longpress || function() {};
		this.doubletap = doubletap || function() {};
		this.pinch = pinch || function() {};
		this.rotate = rotate || function() {};
		this.swipe = swipe || function() {};
		this.pressmove = pressmove || function() {};
		this.singlestartcallback = singlestartcallback || function() {};
		this.singleendcallback = singleendcallback || function() {};
		this.multistartcallback = multistartcallback || function() {};
		this.multiendcallback = multiendcallback || function() {};
	}

	start (e) {
		this.reset();
		if(e.touches.length == 1) {
			this.singlestartcallback.call(this.el);
			this.pointA = {
				X : e.touches[0].pageX,
				Y : e.touches[0].pageY
			}
			this.longpressInt = setTimeout(this.handleLongPress.bind(this),800);
			if(this.DoublePoint) {
				this.handleDoubleTap();
			}else {
				this.DoublePoint = {
					X : e.touches[0].pageX,
					Y : e.touches[0].pageY
				}
				this.lastTime = getTime();
			}
			this.doubleTabInt = setTimeout(function() {
				this.DoublePoint = "";
				this.DoubleTapTime = 0;
			}.bind(this),300);
		}else if(e.touches.length == 2) {
			this.multistartcallback.call(this.el);
			this.pointA = {
				X : e.touches[0].pageX,
				Y : e.touches[0].pageY
			};
			this.pointB = {
				X : e.touches[1].pageX,
				Y : e.touches[1].pageY
			};
			this.distance = getDistance(this.pointA,this.pointB);
			this.vector = {
				X : this.pointA.X - this.pointB.X,
				Y : this.pointA.Y - this.pointB.Y
			};
		}
	}

	move (e) {
		clearTimeout(this.longpressInt);
		if(e.touches.length == 1) {
			this.pointA_end = {
				X : e.touches[0].pageX,
				Y : e.touches[0].pageY
			}
			this.handlePressMove();
		}else if(e.touches.length == 2) {
			this.pointA_end = {
				X : e.touches[0].pageX,
				Y : e.touches[0].pageY
			};
			this.pointB_end = {
				X : e.touches[1].pageX,
				Y : e.touches[1].pageY
			};
			//pinch
			if(this.distance) {
				var distance = getDistance(this.pointA_end,this.pointB_end);
				this.handlePinch(distance/this.distance);
			}
			//rotate
			if(this.vector) {
				var vector = {
					X : this.pointA_end.X - this.pointB_end.X,
					Y : this.pointA_end.Y - this.pointB_end.Y
				}
				var rotate = getRotateAngle(this.vector,vector);
				this.handleRotate(rotate);
			}
		}
	}

	end (e) {
		clearTimeout(this.longpressInt);
		if(this.pointA && !this.pointB) {
			if(this.DoublePoint && this.DoubleTapTime == 1) {//确保双击事件是在第二次tap结束时触发
				this.handleDoubleTap();
			}else {
				var isTap = this.handleTap();
				!isTap && this.handleSwipe();
			}
			this.singleendcallback.call(this.el);
		}
		if(this.pointA && this.pointB && e.touches.length == 0) {
			this.multiendcallback.call(this.el);
		}
	}

	reset () {
		this.pointA = "";
		this.pointB = "";
	}

	handleTap() {
		var now = getTime();
		if(now - this.lastTime < 500 && !this.pointA_end || Math.abs(this.pointA.X - this.pointA_end.X) < 10 &&　Math.abs(this.pointA.Y - this.pointA_end.Y) < 10) {
			this.tap.call(this.el);
			return true;
		}
		return false;
	}

	handleLongPress() {
		this.longpress.call(this.el);
	}

	handleDoubleTap() {
		var now = getTime();
		if(now - this.lastTime < 300 && Math.abs(this.pointA.X - this.DoublePoint.X) < 10 &&　Math.abs(this.pointA.Y - this.DoublePoint.Y) < 10){
			this.doubletap.call(this.el);
		}
	}

	handlePinch(scale) {
		var evt = {};
		evt.scale = scale;
		this.pinch.call(this.el,evt);
	}

	handleRotate(rotate) {
		var evt = {};
		evt.rotate = rotate;
		this.rotate.call(this.el,evt);
	}

	handleSwipe() {
		var now = getTime();
		if(now - this.lastTime < 500) {
			var evt = {};
			var isHorizental = Math.abs(this.pointA_end.Y - this.pointA.Y) < 30;
			var isVertical = Math.abs(this.pointA_end.X - this.pointA.X) < 30;
			var isRight = this.pointA_end.X - this.pointA.X > 0;
			var isTop = this.pointA_end.Y - this.pointA.Y > 0;

			if(isHorizental && isRight) {
				evt.direction = "right";
			}else if(isHorizental && !isRight) {
				evt.direction = "left";
			}else if(isVertical && isTop) {
				evt.direction = "down";
			}else if(isVertical && !isTop) {
				evt.direction = "up";
			}
			evt.direction && this.swipe.call(this.el,evt);
		}
		this.pointA = "";
		this.pointA_end = "";
	}
	handlePressMove() {
		var evt = {
			disX : this.pointA_end.X - this.pointA.X,
			disY : this.pointA_end.Y - this.pointA.Y
		};
		this.pressmove.call(this.el,evt);
	}
}

import transform from "./transform"

export default {
	install (Vue) {
		Vue.directive('finger', {
			bind (el, binding, vnode) {
				transform(el);


				var fingerInstance = new Finger(el, binding.value);

				el.addEventListener("touchstart",fingerInstance.start.bind(fingerInstance));
				el.addEventListener("touchmove",fingerInstance.move.bind(fingerInstance));
				el.addEventListener("touchend",fingerInstance.end.bind(fingerInstance));
			}
		})
	}
}