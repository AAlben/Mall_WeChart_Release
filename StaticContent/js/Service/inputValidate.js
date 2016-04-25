//将数据验证js代码封装成类
function InputValidate() {

    //提交数据验证方法
    this.CheckInput = function (InputConfig, vClass) {

        var vFlag = true;
        var vMsg = '';

        $.each(InputConfig, function (index, item) {
            //提取对象
            var vItem = $('#' + index);
            var vVal = vItem.val();

            //验证第一段：为空
            if (item['require']) {
                if (!vVal || vVal.trim() == '') {
                    vMsg = item['name'] + '不能为空！';

                    //错误提示
                    vClass.ErrorTips(vItem, vMsg);

                    vFlag = false;
                    return false;
                }
                else {
                    //隐藏错误提示
                    vClass.ErrorTips(vItem, '', 'hide');
                }
            }

            vVal = vVal.trim();
            vItem.val(vVal);

            //第三段：指定项相同
            if (item['equals']) {
                var vEq = $('#' + item['equals']);
                if (vVal != vEq.val().trim()) {
                    vMsg = TxtFormat('{0}与{1}输入内容不相同！', [item['name'], InputConfig[item['equals'].name]]);

                    //错误提示
                    vClass.ErrorTips(vItem, vMsg);

                    vFlag = false;
                    return false;
                }
                else {
                    //隐藏错误提示
                    vClass.ErrorTips(vItem, '', 'hide');
                }
            }

            //第二段：长度
            if (item['length']) {
                var vLength = item['length'];
                if (vVal.length != vLength) {
                    vMsg = TxtFormat('请输入正确的{0}!', [item['name']]);

                    //错误提示
                    vClass.ErrorTips(vItem, vMsg);

                    vFlag = false;
                    return false;
                }
                else {
                    //隐藏错误提示
                    vClass.ErrorTips(vItem, '', 'hide');
                }
            }
        });

        return vFlag;
    }

    //清空指定Input项
    this.ClearInput = function (InputConfig) {
        $.each(InputConfig, function (index, item) {
            $('#' + index).val('');
        });
    }

    //用户输入异常信息提示
    this.ErrorTips = function (vItem, vMsg, flag) {
        //1.首先判断有没有提示
        var vSpan = vItem.next('span');
        $.each(vSpan, function (index, item) {
            var vItem = $(item);
            if (flag) { vItem.remove(); return false; } //隐藏
            if (vItem.hasClass('errorTips')) {
                vItem.text(vMsg);
                return false;
            }
        });

        //2.没有提示
        if (!flag) {
            var vHtml = '<span class="errorTips">';
            vHtml += vMsg;
            vHtml += '</span>';
            vItem.after(vHtml);
        }
    }
}

function InputValidateCNa() {

    //继承
    InputValidate.apply(this, arguments);

    //用户输入异常信息提示
    this.ErrorTips = function (vItem, vMsg, flag) {
        if (!flag) {
            alert(vMsg);
        }
    }
}
