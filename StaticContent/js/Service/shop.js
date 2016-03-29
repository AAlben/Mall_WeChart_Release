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


//2.加入购物车

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