require.config({
        baseUrl: window.location.href.indexOf('http') != -1 ? '/adm_public/mobile/js/' : '../js',
        paths: {
            'jquery': 'jquery-1.11.3.min',
            'vue': ['vue.min'],
            'layer': ['layer/layer'], //弹出层
            'date': ['jquery.date'], //日历
            'clipboard': ['clipboard.min'], //复制
            'nativeShare': ['nativeShare'], //分享
            'module1': ['module'],
            'lrz': ['ResizeIMG/dist/lrz.bundle'], //图片压缩
            'swiper': ['swiper/js/swiper-3.3.1.min'],
			'vueTap': ['vue-tap'],
			'jsTap':['tap'],
			'fastclick':['fastclick'],
            'wx':'https://res.wx.qq.com/open/js/jweixin-1.0.0',
			'debugvue':['vue']
        },
        urlArgs: "v=2"
    })
//返回顶部 定义模块
define('toAop', ['jquery'], function($) {
    $(function(){
         $(window).scroll(function() {
            var t = $(window).scrollTop();
            if (t > 200) {
                $('#to-top').fadeIn(500);
            } else {
                $('#to-top').fadeOut(500);
            }
        });
        $('#to-top').bind('click', function() {
            $('html,body').animate({ scrollTop: '0' }, 600);
        })
    })
})
require(['toAop']);
//原生ajax 不用jquery时可使用
define('ajax',function(){
    window.Ajax={
        get: function(url, fn) {
            var obj = new XMLHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据          
            obj.open('GET', url, true);
            obj.onreadystatechange = function() {
                if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState == 4说明请求已完成
                    fn.call(this, obj.responseText);  //从服务器获得数据
                }
            };
            obj.send();
        },
        post: function (url, data, fn, type) {         // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
            var obj = new XMLHttpRequest();
            obj.open("POST", url, true);
            obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  // 添加http头，发送信息至服务器时内容编码类型
            obj.onreadystatechange = function() {
                if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
                    fn.call(this, type == 'json'? JSON.parse(obj.responseText) : obj.responseText);
                }
            };
            obj.send(data);
        }
    }
})
//fastclick方式消除点击延迟 建议的替换tap的解决方案**
define('fclick',['fastclick'],function(FastClick){
	window.addEventListener( "load", function() {
        FastClick.attach( document.body );
    }, false );
})

// 移动端tap事件 使用fclick，这里做代理商兼容保留，后续可删除
define('tap',['jquery'],function($){
    $.fn.tap = function(fn){
    var collection = this,
        isTouch = "ontouchend" in document ? true : false;
    collection.each(function(){
        var i = {};
        i.target = this;
        if(isTouch){
           $(i.target).on("touchstart",function(e){
                var e = e.originalEvent;
                e.preventDefault();
                var p = e.touches[0];
                i.startX = p.clientX;
                i.startY = p.clientY;
                i.endX = p.clientX;
                i.endY = p.clientY;
                i.startTime = + new Date;
           });
            $(i.target).on('touchmove',function(e){
                var e = e.originalEvent;
                e.preventDefault();
                var p = e.touches[0];
                i.endX = p.clientX;
                i.endY = p.clientY;
            });
            $(i.target).on('touchend',function(e){
                var e = e.originalEvent;
                e.preventDefault();
                if((+ new Date)-i.startTime<300){
                    if(Math.abs(i.endX-i.startX)+Math.abs(i.endY-i.startY)<20){
                        fn.call(i.target);
                    }
                }
                i.startTime = undefined;
                i.startX = undefined;
                i.startY = undefined;
                i.endX = undefined;
                i.endY = undefined;
            }); 
        }else{
            $(i.target).on('click',function(e){
                fn.call(i.target);
            })
        }

    });
    return collection;
}
})
// 成功提示
function success(str, time) {
    time = time || 2000;
    require(['jquery'], function() {
        var tip = $('.succeed-tip');
        if (tip.length == 1) {
            tip.show();
            $('.succeed-tip span').text(str);
        } else {
            $('body').append('<div class="succeed-tip"><img src="/adm_public/mobile/images/succeed_02.png">' + str + '</div>');
            tip = $('.succeed-tip');
            tip.show();
        }
        setTimeout(function() { tip.hide(); }, time);
    });

}
// swiper 滑动
function swiper() {
    $(window).on('resize', function() {
        setTimeout(function() {
            $.each(mySwiper, function() {
                this.onResize()
            });
        }, 50);
    })
    window.mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        resistanceRatio: 0
    });
}

// 正则
var phoneReg = /^1[345789]\d{9}$/;

//webview
var isWebView = typeof Login != 'undefined';

function showLogin(openid){
    require(['jquery'],function(){
        $.get('/adm/appsite/applogin',{openid:openid},function(data){
            if(data.success){
                window.location.href = '/adm'
            }else{
                alert(data.msg);
            }
        },'json')
    })
}

//rem
function isPc() {
    var uaInfo = navigator.userAgent;
    var agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for ( var i = 0; i < agents.length; i++ ) {
      if (uaInfo.indexOf(agents[i]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }
if(isPc()){
    var $html = document.getElementsByTagName('html');
    $html[0].style.maxWidth = '1036px';
    $html[0].style.margin = '0 auto';
}
//rem在body内执行，因为在head中部分浏览器获取屏幕宽度异常
!function(win, option) {
    var count = 0, 
        designWidth = option.designWidth, 
        designHeight = option.designHeight || 0, 
        designFontSize = option.designFontSize || 20, 
        callback = option.callback || null,
        root = document.documentElement,
        body = document.body,
        rootWidth, newSize, t, self;
        //root.style.width = '100%';
    //返回root元素字体计算结果
    
    function _getNewFontSize() {
      var scale = designHeight !== 0 ? Math.min(win.innerWidth / designWidth, win.innerHeight / designHeight) : win.innerWidth / designWidth;
      return parseInt( scale * 10000 * designFontSize ) / 10000;
    }
    !function () {
      rootWidth = root.getBoundingClientRect().width;
      self = self ? self : arguments.callee;
      //如果此时屏幕宽度不准确，就尝试再次获取分辨率，只尝试20次，否则使用win.innerWidth计算
      if( rootWidth !== win.innerWidth &&  count < 20 ) {
        win.setTimeout(function () {
          count++;
          self();
        }, 0);
      } else {
        newSize = _getNewFontSize();
        //如果css已经兼容当前分辨率就不管了
        if( newSize + 'px' !== getComputedStyle(root)['font-size'] ) {
          root.style.fontSize = Math.round(newSize) + "px";
          if(isPc() && window.innerWidth > 1036){
             var px = Math.round(newSize)>20?20:Math.round(newSize);
             root.style.fontSize = px + "px"; 
          }
          return callback && callback(newSize);
        };
      };
    }();
    //横竖屏切换的时候改变fontSize，根据需要选择使用
    win.addEventListener("resize", function() {
      clearTimeout(t);
      t = setTimeout(function () {
        self();
      }, 50);
    }, false);
    }(window, {
    designWidth: 750, 
    designFontSize: 20
});
//帮助手册中都是大图，不允许点击预览
var href = window.location.href;
if(href.indexOf('adm_public') != -1){
	define('img', ['jquery'], function($) {
		$(function(){
			$('img').bind('click',function(){
				return false;
			})
		})
	})
	require(['img']);
}
