//初始化上传按钮
function InitUploadControl() {
    //Config
    var vConfig = UploadInfoConfig('multi');

    //Function
    vConfig.onUploadSuccess = function (file, data, respose) {
        var obj = jQuery.parseJSON(data); //把返回的数据序列化为Obj对象

        if (obj.ret) {
            UploadImgAppend(obj.FilePath)
        }
        else {
            alert(obj.message);
        }
    }

    //Init
    $("#img_add").uploadify(vConfig);
}

//动态加载图片
function UploadImgAppend(vPath) {
    //Item
    var vItem = $('#uPhotoList');

    var vHtml = '';

    //hidden
    var vLiPhotoIndex = $('#hLPhotoIndex');
    var vIndex = parseInt(vLiPhotoIndex.val());
    vLiPhotoIndex.val(vIndex + 1);

    var vTxt = '';

    switch (vIndex) {
        case 0:
            vTxt = '商品封面图';
            break;

        default:
            vTxt = '商品滚动图';
            break;
    }

    vHtml += TxtFormat('<li uPath="{0}">', [vPath]);
    vHtml += '<figure class="uk-overlay">';
    vHtml += TxtFormat('<img src="/{0}" />', [vPath]);
    vHtml += '<figcaption class="uk-overlay-panel uk-overlay-background uk-overlay-bottom">';
    vHtml += TxtFormat('<h2>{0}</h2>', [vTxt]);
    //vHtml += TxtFormat('<p class="uk-grid"><a class="uk-width-1-1 font-white" onclick="PhotoDelete();">删除</a></p>', [vLiPhotoIndex, vLiPhotoIndex]);
    vHtml += '<p class="uk-grid"><a class="uk-width-1-2 uk-text-center font-white txt-nowrap" onclick="SetInfoPhoto();">设为封面</a><a class="uk-width-1-2 uk-text-center font-white txt-nowrap" onclick="PhotoDelete();">删除</a></p>';
    vHtml += '</figcaption>';
    vHtml += '</figure>';
    vHtml += '</li>';

    vItem.append(vHtml);
}

//上传的图片，指定一个为封面图
function SetInfoPhoto() {
    //Init
    var vEvent = event.currentTarget;
    var vUl = $('#uPhotoList');

    //筛选
    var vLi = $(vEvent).parentsUntil('li');
    vLi = vLi.parent('li');

    $('li:first h2', vUl).text('商品滚动图');

    //变动
    $('h2', vLi).text('商品封面图');
    vUl.prepend(vLi);
}

//删除指定上传的图片
function PhotoDelete() {
    //Init
    var vEvent = event.currentTarget;

    $(vEvent).parentsUntil('li').parent('li').remove();
}

//删除商品规格：单行
function btnDeleteOption() {
    //Init
    var vEvent = event.currentTarget;

    var vLi = $(vEvent).parentsUntil('li').parent('li');

    if (vLi.parent('ul').find('li').length <= 2) {
        $('#hCommOptionFlag').val('0');
    }

    vLi.remove();
}

//增加一行商品规格：单行
function btnAddOption() {
    $('#hCommOptionFlag').val('1');//更改标识

    var vHtml = '';

    vHtml += '<li class="sku_li" uId="undefined">';
    vHtml += '<div class="sku_item_b">';
    vHtml += '<input type="text" class="sku_item_m_input input input_y block wrap c_txt">';
    vHtml += '</div>';
    vHtml += '<div class="sku_item_b"><input type="text" class="sku_item_b_input input input_y block wrap c_txt"></div>';
    vHtml += '<div class="sku_item_d"><a class="del_sku red_txt pointer block" onclick="btnDeleteOption();">删除</a></div>';
    vHtml += '</li>';

    $('#sku_ul').append(vHtml);
}

//商品规格初始化
function InitOptionData(vOptionList) {

    var vHtml = '';

    $.each(vOptionList, function (index, item) {
        vHtml += TxtFormat('<li class="sku_li" uId="{0}">', [item.ID]);
        vHtml += '<div class="sku_item_b">';
        vHtml += TxtFormat('<input type="text" class="sku_item_m_input input input_y block wrap c_txt" value="{0}">', [item.Name]);
        vHtml += '</div>';
        vHtml += TxtFormat('<div class="sku_item_b"><input type="text" class="sku_item_b_input input input_y block wrap c_txt" value="{0}"></div>', [item.Price]);
        vHtml += '<div class="sku_item_d"><a class="del_sku red_txt pointer block" onclick="btnDeleteOption();">删除</a></div>';
        vHtml += '</li>';
    });

    $('#sku_ul').append(vHtml);
}

//商品添加页面输入项配置
function GetInputConfig() {
    //输入项相关配置
    var InputConfig = {
        '#uPhotoList li': { itemLength: { '>=': 2 }, name: '商品相关图片' },
        '#txtTitle': { require: true, name: '商品名称' },
        '#txtPrice': { require: true, name: '商品价格' },
        '#selModule': { require: true, name: '类别' },
        '#txtStock': { require: true, name: '库存' },
        '#hCommIntro': { require: true, name: '商品介绍' }
    };

    //1.根据快递方式：0：免邮、1：自定义费用
    var vPostFlag = $('#hPostFlag').val();

    //2.根据有无商品规格：0：无规格、1：有规格
    var vOptionFlag = $('#hCommOptionFlag').val();

    //判断
    if (vPostFlag == '1') {
        InputConfig['#txtPostPrice'] = { require: true, name: '快递指定费用' };
    }

    if (vOptionFlag == '1') {
        InputConfig['.sku_li div input'] = { dataType: 'list', require: true, name: '商品规格相关内容' };
    }

    return InputConfig;
}

//事件绑定方法公共
function BindEventCommon() {
    //2.取消按钮事件
    $('#btnCancel').click(function () {
        window.location.href = '/Admin/CommodityList';
        return false;
    });

    //3.运费计算方式更改
    $('#ckPostType').on('click', function () {
        var vThis = $(this);

        var vInput = $('#txtPostPrice');

        if (this.checked) {
            //置灰 + 给hidden赋值
            $('#hPostFlag').val('0');
            vInput.attr('disabled', 'disabled');

        }
        else {
            $('#hPostFlag').val('1');
            vInput.removeAttr('disabled');
        }
    });
}

//初始化展示数据公共
function InitDataCommon() {
    //1.商品类别数据加载
    $.get('/RequestData/ShopModuleList',
        { r: Math.random() },
        function (data) {
            if (data) {
                var vHtml = '';
                $.each(data, function (index, item) {
                    vHtml += TxtFormat('<option value="{1}">{0}</option>', [item.Text, item.Value]);
                });
                $('#selModule').append(vHtml);
            }
        },
        'json');
}