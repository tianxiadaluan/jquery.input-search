;(function ($) {
    $.fn.extend({
        "inputSearch": function (options,callback) {
            var ops = $.extend(defaluts,options);
            if(ops.url === undefined){
                console.log('没有设置URL参数');
            }

            $(this).css('position','relative');
            var thisId = $(this).attr('id');
            var thisInput = "#" + thisId + " input";
            var thisUl = "#" + thisId + " ul.inputSearchList";
            var thisLi = thisUl + " li";

            var inithtml ='<style>#'+thisId+' ul.inputSearchList{position: absolute; top: 44px; max-height: 370px; overflow-y: auto; left: 0;z-index: 9999999;border: 1px solid #ccc; min-width: 100px; line-height: 44px; border-radius: 3px;}ul.inputSearchList li+li{border-top:1px solid #ddd;}ul.inputSearchList li{padding: 0 10px; cursor: pointer;white-space: nowrap; }ul.inputSearchList li:hover{background: #DDD;}ul.inputSearchList li small{float:right; color: #0bb20c;}</style>';
            $(this).html('<input type="text" class="'+ ops.inputClassName +'" placeholder="输入店铺关键词"><ul class="inputSearchList" style="display: none;"></ul>'+inithtml);

            var timer;
            $(document).on('input propertychange', thisInput, function(){
                clearTimeout(timer);
               var key = $(this).val();
               timer = setTimeout(function () {
                   $.ajax({
                       type: 'POST',
                       data:{key:key},
                       url: ops.url,
                       success:function(response){
                           setUlList(response.data)
                           $(thisUl).css('min-width',$(thisInput).outerWidth()-2+'px').show();
                       }
                   })
               },200)
            })

            $(document).on('click focus', thisInput, function(e){
                stopPropagation(e);
                if($(this).val() !== ''){
                    $(thisUl).show();
                }
            })

            $(document).on('click', thisLi, function(e){
                stopPropagation(e);
                var chooseId = $(this).attr('data-id');
                var chooseVal = $(this).find('span').text();
                if(ops.closeChange){
                    $(thisUl).hide();
                }
                if(ops.fillInput){
                    $(thisInput).val(chooseVal)
                }
                callback({id: chooseId, name: chooseVal})
            })

            $(document).on('click', function () {
                $(thisUl).hide();
            })

        }
    });
    //默认参数
    var defaluts = {
        closeChange: true, //默认选择不自动关闭
        fillInput: true,
        inputClassName: 'layui-input'
    };

    /**
     * 渲染待选择列表
     * @param data
     */
    function setUlList(data) {
        var html = '';
        if(data instanceof Array && data.length > 0){
            $.each(data, function (index,item) {
                html += '<li data-id="'+item.id+'"><small>选择</small><span>'+ item.name +'</span></li>';
            })
        }else{
            html += '<li data-id="">无搜索结果</li>';
        }
        $(".inputSearchList").html(html)
    }

    /**
     * 阻止事件冒泡
     * @param e
     */
    function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }

})(window.jQuery);
