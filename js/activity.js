/*平安信用卡弹出活动
*e键云通首页 e键刷 e键广告 代理商都使用此js
*/
(function(){
	var tool = {
		test:function(){//是否为测试环境
			return window.location.href.indexOf('ejianyuntong') == -1;
		},
		dom:function(){//dom
			var str = '<div class="credit-card-layer"><span><img src="&img" alt=""><a href="&a" class="c-btn"></a><a href="javascript:" class="c-close"></a></span></div>',
				img = tool.test() ? 'http://qiye.huabaoruanjian.com/adm_public/mobile/images/bg.png':'http://qiye.ejianyuntong.com/adm_public/mobile/images/bg.png',
				a = tool.test() ? 'http://qiye.huabaoruanjian.com/pinanxinyongka/refer/activity':'http://qiye.ejianyuntong.com/pinanxinyongka/refer/activity';
			return str.replace('&img',img).replace('&a',a);
		},
		css:function(){
			return '<style type="text/css">.credit-card-layer{position: fixed;width: 100%;min-height: 100%;left: 0;top: 0;background: rgba(0,0,0,.6);z-index: 10;text-align: center;}.credit-card-layer img{width: 100%;}.credit-card-layer span{position: relative;display: inline-block;width: 70.6666666%;}.credit-card-layer .c-close{position: absolute;width: 13%;height: 9%;left: 50%;bottom: 0;margin-left: -6.5%;}.credit-card-layer .c-btn{position: absolute;width: 50%;height: 12%;left: 50%;bottom: 15%;margin-left: -25%;}</style>';
		},
		cookie:function(fun){  //获取cookie
			var pluses = /\+/g;
			function encode(s) {
				return config.raw ? s : encodeURIComponent(s);
			}
			function decode(s) {
				return config.raw ? s : decodeURIComponent(s);
			}
			function stringifyCookieValue(value) {
				return encode(config.json ? JSON.stringify(value) : String(value));
			}
			function parseCookieValue(s) {
				if (s.indexOf('"') === 0) {
					// This is a quoted cookie as according to RFC2068, unescape...
					s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
				}

				try {
					// Replace server-side written pluses with spaces.
					// If we can't decode the cookie, ignore it, it's unusable.
					// If we can't parse the cookie, ignore it, it's unusable.
					s = decodeURIComponent(s.replace(pluses, ' '));
					return config.json ? JSON.parse(s) : s;
				} catch(e) {}
			}

			function read(s, converter) {
				var value = config.raw ? s : parseCookieValue(s);
				return $.isFunction(converter) ? converter(value) : value;
			}

			var config = $.cookie = function (key, value, options) {

				// Write

				if (value !== undefined && !$.isFunction(value)) {
					options = $.extend({}, config.defaults, options);

					if (typeof options.expires === 'number') {
						var days = options.expires, t = options.expires = new Date();
						t.setTime(+t + days * 864e+5);
					}

					return (document.cookie = [
						encode(key), '=', stringifyCookieValue(value),
						options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
						options.path    ? '; path=' + options.path : '',
						options.domain  ? '; domain=' + options.domain : '',
						options.secure  ? '; secure' : ''
					].join(''));
				}

				// Read

				var result = key ? undefined : {};

				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling $.cookie().
				var cookies = document.cookie ? document.cookie.split('; ') : [];

				for (var i = 0, l = cookies.length; i < l; i++) {
					var parts = cookies[i].split('=');
					var name = decode(parts.shift());
					var cookie = parts.join('=');

					if (key && key === name) {
						// If second argument (value) is a function it's a converter...
						result = read(cookie, value);
						break;
					}

					// Prevent storing a cookie that we couldn't decode.
					if (!key && (cookie = read(cookie)) !== undefined) {
						result[name] = cookie;
					}
				}

				return result;
			};

			config.defaults = {};

			$.removeCookie = function (key, options) {
				if ($.cookie(key) === undefined) {
					return false;
				}
				// Must not alter options, thus extending a fresh object...
				$.cookie(key, '', $.extend({}, options, { expires: -1 }));
				return !$.cookie(key);
			};
			fun();
		},
		setDom:function(){
			var that = this;
			$('body').append(that.css()).append(that.dom());
			that.cookie(function(){
				//if(!$.cookie('act_time')){
					var el = $('.credit-card-layer');
					el.find('img').bind('load',function(){
						if($(window).height()>el.children().height()){
							el.children().css('margin-top',($(window).height()-el.children().height())/2+'px');
						}
						el.show();
					})
					var d = new Date();
            		d.setTime(d.getTime() + (120*60*1000));
            		$.cookie('act_time', true , { expires: d , path: '/' });

            		var t = 6;
					var time = setInterval(function(){
						t--;
						if(t == 0){
							el.hide();
							window.clearInterval(time);
						}
					},1000)
					$('.c-close').bind('click',function(){
						el.hide();
					})
				//}
			})
		}
	}
	if(typeof require != 'undefined'){
		require(['jquery'],function(){
			$(function(){
				tool.setDom();
			})
		})
	}else{
		$(function(){
			tool.setDom();
		})
	}
})()