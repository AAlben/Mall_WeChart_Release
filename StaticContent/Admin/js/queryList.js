//页面初始化
function InitCommon_QueryList() {
    //日期控件
    var startDate = $('#startdate');
    var endDate = $('#enddate');

    //计算初始日期
    var vDateNa = DateOperate(-7);
    var vDateNb = DateOperate(0);

    //给元素赋值属性
    startDate.attr('data-date', vDateNa);
    endDate.attr('data-date', vDateNb);

    //定时器
    setTimeout(function () {
        //1.赋予指定日期
        startDate.prev('span').text(vDateNa);
        endDate.prev('span').text(vDateNb);
    }, 500);

}

//日期操作函数
function DateOperate(n) {
    var uom = new Date(new Date() - 0 + n * 86400000);
    uom = uom.getFullYear() + "-" + (uom.getMonth() + 1) + "-" + uom.getDate();
    return uom;
}

//翻页相关

//1.上一页
function PreviousPage() {
    var vItem = $('#hPageIndex');
    var vIndex = parseInt(vItem.val());

    if (vIndex == 1) {
        alert('当前为第一页！');
        return false;
    }
    else {
        vIndex -= 1;
        vItem.val(vIndex);
        $('#btnQuery').click();
    }
}

//2.下一页
function NextPage() {
    var vPageA = $('.paging a').eq(1);
    if (vPageA.attr('disabled') == 'disabled') {
        alert('当前是最后一页！');
        return false;
    }

    var vItem = $('#hPageIndex');
    var vIndex = parseInt($('#hPageIndex').val());

    vIndex += 1;
    vItem.val(vIndex);
    $('#btnQuery').click();
}

//3.最后一页标识
function LastPageFlag(flag) {
    var vPageA = $('.paging a').eq(1);

    if (flag) { vPageA.attr('disabled', 'disabled'); }
    else { vPageA.removeAttr('disabled'); }
}

//功能方法能否执行验证
function FuncCanOpeCheck(vEvent, vArguments) {
    //当前State
    var vState = $(vEvent.currentTarget).attr('uState');
    //当前方法名
    var vFunName = vArguments.callee.name;

    //校验
    if (vStateFunctionConfig[vState].indexOf(vFunName) != -1) {
        return true;
    }
    return false;
}

//绑定事件
function BindEventCommon_QueryList() {
    $('.order-type li').on('click', function () {
        //样式变换
        var vThis = $(this);
        vThis.addClass('cur').siblings().removeClass('cur');

        var vState = vThis.attr('uState');
        $('#hState').val(vState);

        //查询
        $('#btnQuery').click();
    });
}