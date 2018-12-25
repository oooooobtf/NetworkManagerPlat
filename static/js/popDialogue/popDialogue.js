/*
* 有操作的弹窗提示，比如需要确定
* 使用方法：
* $('body').createDialogue({
        hintText:'确定要删除？',
        theme:'red' 
        //弹窗主题颜色
        backFn:function (className) {
        //返回的是容器的类名 用来移除
           $('.'+className).remove();
            console.log(className);
        }
    })
* */
(function($) {

	var ms = {
		init: function(obj, args) {
			return(function() {
				ms.fillHtml(obj, args);
				ms.bindEvent(obj, args);
			})();
		},
		fillHtml: function(obj, args) {
			return(function() {
				var html = [];
				html.push('<div class="pop-dialogue-windows">');
				html.push('<div class="dialogue-shadow-window"></div>');
				switch(args.theme) {
					case 'red':
						html.push('<div class="vertical-center red-theme">');
						html.push('<div class="dialogue-title">');
						html.push('<span class="icon wb-bell "></span>');
						html.push('<span class="dialogue-hint">' + args.hintText + '</span>');
						html.push('<span class="icon wb-close dialogue-close"></span>');
						html.push('</div>');
						html.push('<div class="dialogue-button">');
						html.push('<span class="dialogue-confirm-btn">确定</span>');
						html.push('<span class="dialogue-cancle-btn">取消</span>');
						html.push('</div>');
						html.push('</div>');
						html.push('</div>');
						break;
					case 'yellow':
						html.push('<div class="vertical-center yellow-theme">');
						html.push('<div class="dialogue-title">');
						html.push('<span class="icon wb-bell "></span>');
						html.push('<span class="dialogue-hint">' + args.hintText + '</span>');
						html.push('<span class="icon wb-close dialogue-close"></span>');
						html.push('</div>');
						html.push('<div class="dialogue-button">');
						html.push('<span class="dialogue-confirm-btn">确定</span>');
						html.push('<span class="dialogue-cancle-btn">取消</span>');
						html.push('</div>');
						html.push('</div>');
						html.push('</div>');
				}

				$('body').append(html.join(''));
			})();
		},
		bindEvent: function(obj, args) {
			return(function() {
				$('.dialogue-shadow-window').on('click', function() {
					$('div.pop-dialogue-windows').remove();
				})
				$('.dialogue-cancle-btn').on('click', function() {
					$('div.pop-dialogue-windows').remove();
				})
				$('.dialogue-close').on('click', function() {
					$('div.pop-dialogue-windows').remove();
				})
				$('.dialogue-confirm-btn').on('click', function() {
					if(typeof(args.backFn) == "function") {
						args.backFn('pop-dialogue-windows');
					}
				})
			})();
		}
	}

	$.fn.createDialogue = function(options) {
		var args = $.extend({
			hintText: '',
			theme: '',
			backFn: function() {}
		}, options);
		ms.init(this, args)
	}

})(jQuery);