(function (window) {

    window.$inkey = window.$inkey || {
        /**
         * 初始化
         */
        init: function () {
            /*加载配置文件*/
            this.config = $c = $c.test;

            /*加载公共方法*/
            this.common = $p;

            /*初始化公共方法*/
            this.common.load();
        }
    };

    /***********************环境配置***************************/
    window.$c = window.$c || {
        /**
         * 开发环境
         * ip            API请求地址
         * alipayIp      支付宝请求地址
         * down          分享下载地址
         */

        develop: {
            Ip: 'http://192.168.0.171:8321',
            AliPay: 'http://113.204.182.194:8100',
            Down: 'http://down.inkey.com/sa/'
        },

        /**
         * 测试环境
         * ip            API请求地址
         * alipayIp      支付宝请求地址
         * down          分享下载地址
         */
        test: {
            Ip: 'http://192.168.0.201:8321',
            AliPay: 'http://113.204.182.194:8003',
            Down: 'http://down.inkey.com/sa/'
        },

        /**
         * 预发布环境
         * ip            API请求地址
         * alipayIp      支付宝请求地址
         * down          分享下载地址
         */
        preProduction: {
            Ip: 'http://service.four.inkey.com',
            AliPay: 'http://luck.ready.inkey.com',
            Down: 'http://down.ready.inkey.com/sa/'
        },

        /**
         * 上线环境
         * ip            API请求地址
         * alipayIp      支付宝请求地址
         * down          分享下载地址
         */
        production: {
            Ip: 'http://service.inkey.com',
            AliPay: 'http://luck.inkey.com',
            Down: 'http://down.inkey.com/sa/'
        }
    };

    /***********************公共方法***************************/
    window.$p = window.$p || {
        load: function () {
            /*初始化token*/
            this.token = this.getToken() || this.getCookie('utoken');
            this.clearCookie().setCookie('utoken', this.token);

            /*初始化meta标签*/
            this.initMeta();
        },

        /**
         * 初始化meta标签
         */
        initMeta: function () {
            var scale = [1, 0.5, 0.3333333333333333], n = this.getDevicesCode(),
                ms = [
                    {name: 'apple-mobile-web-app-status-bar-style', content: 'black'},
                    {name: 'format-detection', content: 'telephone=no, email=no'},
                    {name: 'apple-mobile-web-app-capable', content: 'yes'},
                    /*{
                     name: 'viewport',
                     content: 'user-scalable=no, width=device-width, maximum-scale=' + scale[n] + ', minimum-scale=' + scale[n] + ' initial-scale=' + scale[n] + ''
                     },*/
                    {'http-equiv': 'X-UA-Compatible', content: 'IE=edge'}
                ];
            for (var i = 0; i < ms.length; i++) this.setMeta(ms[i]);
        },

        /**
         * 设置meta标签
         * json          meta对象
         */
        setMeta: function (json) {
            var meta = document.createElement('meta');
            for (var k in json) meta.setAttribute(k, json[k]);
            document.getElementsByTagName('head')[0].insertBefore(meta, document.getElementsByTagName('meta')[0]);
        },

        /**
         * 禁止页面滚动
         */
        disableScroll: function () {
            $(window).bind("touchmove", function (e) {
                e.preventDefault();
            });
        },

        /**
         * 允许页面滚动
         */
        allowScroll: function () {
            $(window).unbind("touchmove");
        },

        /**
         * 获取Token
         * @rteurn {String}
         */
        getToken: function () {
            var token = this.getQueryString('token'), meta = document.getElementsByTagName('meta')['token'];
            if (!token && undefined !== meta) return meta.content; else return token || '';
        },

        /**
         * 获取URL参数
         * @param name 参数名
         * @rteurn {String}
         */
        getQueryString: function (name) {
            if (!name)return null;
            var reg = new RegExp('(^|&|\\?)' + name + '=([^&]*)(&|$)'), array = location.search.match(reg);
            return array ? decodeURIComponent(array[2]) : null;
        },

        /**
         * 获取cookie
         * @param {String} key 键
         * @return {String}
         */
        getCookie: function (key) {
            if (!key)return null;
            var reg = new RegExp('(?:; )?' + key + '=([^;]*);?');
            return reg.test(document.cookie) ? decodeURIComponent(RegExp['$1']) : null;
        },

        /**
         * 设置cookie
         * @param {String} key 键
         * @param {String} value 值
         * @param {Int} hours 过期时间(小时),默认3小时
         */
        setCookie: function (key, value, hours) {
            hours = hours || 3;
            if (key && value) {
                var expireTime = new Date();
                expireTime.setTime(expireTime.getTime() + Number(hours) * 3600 * 1000);
                document.cookie = key + '=' + value + '; path=/;expires = ' + expireTime.toGMTString();
            } else {
                return 'no key or value';
            }
        },

        /**
         * 删除cookie
         * @param key 键
         */
        removeCookie: function (key) {
            var expireTime = new Date();
            expireTime.setTime(expireTime.getTime() - 1);
            var value = this.getCookie(key);
            if (value) {
                document.cookie = key + '=' + value + ';path=/;expires=' + expireTime.toGMTString();
            }
        },

        /**
         * 清除所有cookie
         */
        clearCookie: function () {
            var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;)
                    document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
            }
            return this;
        },

        /**
         * 判断设备
         * @return {Int} Return 0 = IOS, 1 = Android, -1 = 未匹配
         */
        getDevicesCode: function () {
            var sUserAgent = navigator.userAgent.toLowerCase(),
                isIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
                isAndroid = sUserAgent.match(/android/i) == "android",
                w = window.screen.width;
            /*var isIpad = sUserAgent.match(/ipad/i) == "ipad";
             var isCE = sUserAgent.match(/windows ce/i) == "windows ce";
             var isWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
             var isMidp = sUserAgent.match(/midp/i) == "midp";
             var isUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
             var isUc = sUserAgent.match(/ucweb/i) == "ucweb";*/
            if (isIphoneOs) {
                var Iphone4s = sUserAgent.match(/6_1_2/i) == "6_1_2";
                //判断plus
                if (w == 414) {
                    return 2;
                    //设置scale = 1
                } else if (Iphone4s) {
                    return 0;
                } else {
                    return 1;
                }

            } else if (isAndroid) {
                return 0;
            }
        }
    };
    window.$inkey.init();
})(window);