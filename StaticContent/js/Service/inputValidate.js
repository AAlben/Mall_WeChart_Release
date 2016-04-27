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

//用户输入错误提示用Alert来进行
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

//此版本支持元素数组对象
function InputValidateCNb() {

    //继承
    InputValidateCNa.apply(this, arguments);

    //提交数据验证方法
    this.CheckInput = function (InputConfig, vClass) {
        //Result
        var vFlag = true;

        $.each(InputConfig, function (index, item) {
            //提取对象
            var vItem = $(index);

            //判断数据类型：是否需要循环
            if (item["dataType"]) {
                var vDataType = item["dataType"];

                switch (vDataType) {
                    case 'list': //元素数组
                        $.each(vItem, function (cIndex, cItem) {
                            if (!vClass.CkeckInputOpe(item, $(cItem), vClass)) {
                                vFlag = false;
                                return false;
                            }
                        });
                        break;

                    default:
                        break;
                }
            }
            else {
                var vResult = vClass.CkeckInputOpe(item, vItem, vClass);

                if (!vResult) {
                    vFlag = false;
                    return false;
                }
            }
        });

        return vFlag;
    }

    //进一步封装：支持数组元素对象
    this.CkeckInputOpe = function (item, vItem, vClass) {
        //Init
        var vFlag = true;
        var vMsg = '';
        var vVal = vItem.val();

        //验证第一段：为空
        if (item['require']) {
            if (!vVal || vVal.trim() == '') {
                vMsg = item['name'] + '不能为空！';

                //错误提示
                vClass.ErrorTips(vItem, vMsg);

                vFlag = false;
                return vFlag;
            }
            else {
                //隐藏错误提示
                vClass.ErrorTips(vItem, '', 'hide');
            }

            vVal = vVal.trim();
            vItem.val(vVal);
        }

        //第三段：指定项相同
        if (item['equals']) {
            var vEq = $('#' + item['equals']);
            if (vVal != vEq.val().trim()) {
                vMsg = TxtFormat('{0}与{1}输入内容不相同！', [item['name'], InputConfig[item['equals'].name]]);

                //错误提示
                vClass.ErrorTips(vItem, vMsg);

                vFlag = false;
                return vFlag;
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
                return vFlag;
            }
            else {
                //隐藏错误提示
                vClass.ErrorTips(vItem, '', 'hide');
            }
        }

        if (item['itemLength']) {
            //Init
            var vLengthConfig = item['itemLength'];
            var vItemLength = vItem.length;

            $.each(vLengthConfig, function (cIndex, cItem) {
                switch (cIndex) {
                    case '>=':
                        if (!(vItemLength >= cItem)) {
                            //错误提示
                            vMsg = TxtFormat('{0}个数请多于{1}!', [item['name'], cItem]);
                            vClass.ErrorTips(vItem, vMsg);

                            vFlag = false;
                            return vFlag;
                        }
                        else {
                            //隐藏错误提示
                            vClass.ErrorTips(vItem, '', 'hide');
                        }
                        break;

                    default:
                        break;
                }
            });
        }
        return vFlag;
    }
}