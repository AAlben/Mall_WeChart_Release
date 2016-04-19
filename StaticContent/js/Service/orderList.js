//关于订单列表页面方法的封装

//订单取消按钮事件
function btnCancel(beOrderID) {
    //Init
    var vThis = $(event.currentTarget);
    if (vThis.text() == '已取消') {
        return false;
    }

    //校验
    if (beOrderID == undefined || beOrderID == '') {
        var vMsg = '提交失败！请重新操作！';
        NotifyAlert(vMsg);
        return false;
    }

    //数据提交
    $.get('/WeShop/BeOrderCancel',
        { r: Math.random(), id: beOrderID },
        function (data) {
            if (data && data.Flag) {
                var vMsg = '订单取消成功！';
                NotifyAlert(vMsg);

                vThis.parent().next('h1').show().find('.right-btn').text('已取消');
                vThis.parent().remove();
                //vThis.text('已取消');
                //vThis.unbind();
            }
            else {
                var vMsg = '订单取消失败！请重新操作！';
                NotifyAlert(vMsg);
            }
        },
        'json');
}

//订单付款按钮事件
function btnPayApply(beOrderID) {
    window.location.href = '/WeShop/PayAddressInfo/' + beOrderID;
}

//查询订单物流信息按钮事件
function btnLogistics(beOrderID) {
    window.location.href = '/WeShop/OrderExpressDetail/' + beOrderID;
}

//确认收货按钮事件
function btnAffirmReceive(beOrderID) {

}