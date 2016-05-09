//关乎购买相关，商城相关JS

//0.请求操作Token方法
function RequestZZSCToken(opeType, fnNa, fnNb) {

    var checkKey = '';
    var result = { flag: '', Msg: '' };

    switch (opeType) {
        case 'shopOrder':
            checkKey = 'redrOpohs';
            break;

        case 'beOrder':
            checkKey = 'redrOeb';
            break;
        default:
            result.flag = false;
            result.Msg = 'Check Error!';

            return result;
            break;
    }

    $.get('/WeToken/Token', { r: Math.random(), par1: opeType, par2: checkKey },
        function (data) {
            if (data && data != 'error') {
                result.flag = true;
                result.Msg = data;
                fnNa(data);
                return result;
            }
            result.flag = false;
            result.Msg = 'Check Error!';
            fnNb();
            return result;
        });

    return false;
}

//1.立即购买
function TakeOrderOpe(type, model, funNa) {
    var par1 = type;
    var par2 = model;
    var vsPar2 = JSON.stringify(par2);

    $.post('/WeShop/CommodityInfoOpe', { par1: par1, par2: vsPar2 }, function (data) {
        funNa(data);
    }, 'json');
}

//规格按钮事件绑定
function btnOptionClick(type) {
    var vItem = $(event.target);

    //样式操作
    vItem.addClass('option-cur');
    vItem.siblings('button').removeClass('option-cur');
    //数据赋值操作
    if (type == 'beOrder') { $('#dCommoOptionBeOrder').attr('uid', vItem.attr('uid')).attr('uPrice', vItem.attr('uPrice')); $('#showOrderPrice').text('￥' + vItem.attr('uPrice')); }
    else { $('#dCommoOptionShop').attr('uid', vItem.attr('uid')).attr('uPrice', vItem.attr('uPrice')); $('#showShopPrice').text('￥' + vItem.attr('uPrice')); }
}

//商品个数增减按钮事件实现
function btnCountChangeOpe(opeType, btnCount, showPrice) {
    var orderCount = btnCount.text();

    if (opeType == 'sub' && orderCount == '1') {
        return false;
    }

    var count = parseInt(orderCount);
    var price = parseFloat(showPrice.text().substr(1));
    var orgPrice = price / count;

    if (opeType == 'sub') { count = count - 1; }
    else { count = count + 1; }
    btnCount.text(count);

    price = orgPrice * count;
    showPrice.text('￥' + price);
}

//商品数量增减按钮事件绑定
function btnCountChangeBindEvent() {
    //加入购物车 - Count相关按钮事件
    $('#btnShopCountSub').click(function () {
        var btnCount = $('#btnShopCount');
        var showPrice = $('#showShopPrice');

        btnCountChangeOpe('sub', btnCount, showPrice);
    });

    //加入购物车 - Count相关按钮事件
    $('#btnShopCountPlus').click(function () {
        var btnCount = $('#btnShopCount');
        var showPrice = $('#showShopPrice');

        btnCountChangeOpe('plus', btnCount, showPrice);
    });

    //加入购物车 - 业务提交按钮事件
    $('#btnAddShop').click(function () {
        //Check Post Value
        var vCheckOpeC = new CommotidtyShopOpeNa();
        if (!vCheckOpeC.CheckOpeBtn($('#dCommoOptionShop'))) { return false; }

        var token = '';
        var tokenResult = RequestZZSCToken('shopOrder',
            function (token) { //校验成功
                var par = {};
                par.Count = $('#btnShopCount').text();
                par.CommodityID = vCommodityID;
                par.StoreID = $('#hStoreID').val();

                var vdCommodityOption = $('#dCommoOptionShop');
                if (vdCommodityOption && vdCommodityOption.find('button').length > 0) {
                    par.CommodityOptionID = vdCommodityOption.attr('uid');
                    par.Price = vdCommodityOption.attr('uPrice');
                    par.RealPrice = vdCommodityOption.attr('uPrice');
                }
                else {
                    par.Price = $('#showShopPrice').text().substr(1);
                    par.RealPrice = par.Price;
                }

                TakeOrderOpe('addShop', par, function (vResult) {
                    if (vResult && vResult.Flag) {

                        NotifyAlert('加入购物车成功！');

                        var modal = UIkit.modal("#modalAddShop");
                        modal.hide();

                        //var vBeOrderID = vResult.BeOrderID;
                        //window.location.href = '/WeShop/PayAddressInfo/' + vBeOrderID;
                        return false;
                    }
                    else {
                        NotifyAlert('提交失败！请重新操作！');
                        //alert();
                    }
                });
            },
            function () { //失败
                NotifyAlert('提交失败！请重新操作！');
                //alert('提交失败！请重新操作！');
                window.location.href = '/WeShop/Main';
            });
    });

    //购物车按钮事件绑定
    $('.main-cart').click(function () {
        //1.数据加载
        var vItem = $(event.currentTarget);
        var vID = vItem.attr('uId');
        vCommodityID = vID;

        //历史数据初始化
        $('#btnShopCount').text('1');

        $.get('/WeShop/CommodityInfoContent',
            { r: Math.random(), par1: vID },
            function (data) {
                if (data && data.Item) {
                    //Init
                    var vItem = data.Item;
                    var vDCommOption = $('#dModalCommOption');

                    $('#modalCommImg').attr('src', '/' + vItem.SCommodityInfo.Photo);
                    $('#modalCommTitle').text(vItem.SCommodityInfo.Title);
                    $('#showShopPrice').text('￥' + vItem.SCommodityPriceInterVal);

                    if (vItem.SCommdityOptionInfo.length > 0) { //有规格
                        var vHtml = '';
                        $.each(vItem.SCommdityOptionInfo, function (index, item) {
                            vHtml += TxtFormat('<button class="uk-button commodity-type" uId="{0}" uPrice="{1}" onclick="btnOptionClick(\'shop\');" >{2}</button>', [item.ID, item.Price, item.Name])
                        });
                        $('#dCommoOptionShop').html(vHtml);
                        vDCommOption.show().css('display', 'block').attr('uFlag', 'HasOption');
                    }
                    else { //无规格
                        $('#dCommoOptionShop').empty();
                        vDCommOption.hide().attr('uFlag', 'NoOption');
                    }

                    //赋值StoreID
                    $('#hStoreID').val(vItem.SCommodityInfo.StoreID);

                    //2.modal 初始化
                    var modal = UIkit.modal("#modalAddShop");
                    modal.show();
                }
                else {
                    NotifyAlert('加入购物车失败！请您稍后再试！');

                    window.location.href = '/WeShop/Main';
                }
            },
            'json');
    });
}

//封装 立即购买 + 加入购物车 校验方法
function CommotidtyShopOpe() {
    //校验 - 立即购买按钮，内容
    this.CheckOpeBtn = function (itemOptionBtn) {
        if (itemOptionBtn.length != 0) { //存在商品规格
            var uid = itemOptionBtn.attr('uid');
            if (uid) {
                return uid;
            }
            else {
                NotifyAlert('请选择规格！');
                //alert('请选择规格！');
                return false;
            }
        }
        return true;
    }
}

//继承上面类，进行重写
function CommotidtyShopOpeNa() {
    //继承
    CommotidtyShopOpe.apply(this, arguments);

    //校验 - 立即购买按钮，内容
    this.CheckOpeBtn = function (itemOptionBtn) {
        //添加一层判断语句：Main页面使用
        var vItem = $('#dModalCommOption');

        if (vItem && vItem.length > 0) {
            var vFlag = vItem.attr('uFlag') == 'HasOption';

            if (vFlag && itemOptionBtn.length != 0) { //存在商品规格
                var uid = itemOptionBtn.attr('uid');
                if (uid) {
                    return uid;
                }
                else {
                    NotifyAlert('请选择规格！');
                    //alert('请选择规格！');
                    return false;
                }
            }
        }
        else { //需要调用原版本
            return new CommotidtyShopOpe().CheckOpeBtn(itemOptionBtn);
        }
        return true;
    }
}
/*
*************************************公共工具方法*************************************
*/

/*
  模仿 String.Format() 方法
* add by Lcg 2015-03-19
*/
function TxtFormat(text, parameter) {
    //判断 { } 个数是否相同
    var arr_1 = text.split('{');
    var arr_2 = text.split('}');
    //检验
    if (arr_1.length != arr_2.length) {
        return undefined;
    }
    else {
        //获取占位符个数
        var num = arr_1.length;
        //进行替换则可吧
        for (var i = 0; i < num; i++) {
            text = text.replace('{' + i + '}', parameter[i]);
        }
    } // end else
    //返回结果集
    return text;
}

//提示框弹出
function NotifyAlert(txtMsg, time) {
    var timeOut = 1500;
    if (time) {
        timeOut = time;
    }
    UIkit.notify(txtMsg, { timeout: timeOut });
}