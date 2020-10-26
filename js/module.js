$(function(){
	var phoHtml = '<div class="a-item">'+
				'<div class="a-tip"></div>'+
				'<div class="a-input">'+
					'<div class="relative">'+
						'<input type="text" placeholder="图片素材">'+
						'<a href="javascript:" class="js-pho a-add"><div class="i-img"></div></a>'+
					'</div>'+
					'<div class="a-del js-del"><div class="i-img"></div></div>'+
				'</div>'+
			'</div>';

	var vPHtml = '<div class="a-input"><div class="relative"><input placeholder="视频类图片素材" type="text"> <a href="javascript:" class="js-pho a-add" data-show="2"><div class="i-img"></div></a></div> <div class="a-del js-del"><div class="i-img"></div></div></div>';
   // 添加图片
   $('#js-p').bind('click',function(){
       if($('.a-list .a-item').length == 4){
            layer.msg('最多可以添加4张图片');
            return false;
         }
   		$('.a-list').append(phoHtml);
   		serialNum();
   })

   // 视频类图片
   $(document).on('click','.add-pho-btn',function(){
	    if($('#a-box .a-input').length == 6){
	         layer.msg('最多可以添加5张图片');
	         return false;
	      }
		$(this).prev().prev().after(vPHtml);
	})
   //删除
   $(document).on('click','.js-del',function(){
   		var that = $(this),p = that.parent().parent();
   		if(p.hasClass('a-item')){
   			p.remove();
   		}else if(that.parent().index() == 0){
   			p.parent().remove();
   		}else{
   			that.parent().remove();
   		}
   		serialNum();
   })
  // 图片素材对应显示
   function showPho(index){
      $('.fl4 .switch-pho a').removeClass('active').eq(index).addClass('active');
      $('.fl4 .hide-ul ul').eq(index).show().siblings().hide();
   }
   //图片弹出层
   $(document).on('click','.js-pho',function(){
      showPho($(this).attr('data-show')-1);
		$('.fl4').show();
	})

   $(document).on('focus','.relative input',function(){
		$(this).blur();
	})
   function serialNum(){
   		$('.a-list .a-item').each(function(i,v){
   			var that = $(this);
   			i++;
   			if(i < 10){ i = '0' + i;}
   			that.children('.a-tip').text(i);
   		})
   }
})
