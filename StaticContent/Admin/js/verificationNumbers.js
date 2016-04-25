function LoginValidate() {

    this.code = '';

    this.showCheck = function (a) {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 1000, 1000);
        ctx.font = "80px 'Microsoft Yahei'";
        ctx.fillText(a, 0, 100);
        ctx.fillStyle = "white";
    }

    this.createCode = function () {
        code = "";
        var codeLength = 4;
        var selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        for (var i = 0; i < codeLength; i++) {
            var charIndex = Math.floor(Math.random() * 60);
            code += selectChar[charIndex];
        }
        if (code.length != codeLength) {
            this.createCode();
        }
        this.showCheck(code);
    }

    this.validate = function () {
        var inputCode = document.getElementById("J_codetext").value.toUpperCase();
        var codeToUp = code.toUpperCase();
        if (inputCode.length <= 0) {
            document.getElementById("J_codetext").setAttribute("placeholder", "输入验证码");
            this.createCode();
            return false;
        }
        else if (inputCode != codeToUp) {
            document.getElementById("J_codetext").value = "";
            document.getElementById("J_codetext").setAttribute("placeholder", "验证码错误");
            this.createCode();
            return false;
        }
        else {
            window.open(document.getElementById("J_down").getAttribute("data-link"));
            document.getElementById("J_codetext").value = "";
            this.createCode();
            return true;
        }
    }
}

function LoginValidateNa() {
    LoginValidate.apply(this, arguments);

    //重写验证码校验方法 - 去掉找不到的元素
    this.validate = function () {
        var inputCode = document.getElementById("J_codetext").value.toUpperCase();
        var codeToUp = code.toUpperCase();
        if (inputCode.length <= 0) {
            document.getElementById("J_codetext").setAttribute("placeholder", "输入验证码");
            this.createCode();
            return false;
        }
        else if (inputCode != codeToUp) {
            document.getElementById("J_codetext").value = "";
            document.getElementById("J_codetext").setAttribute("placeholder", "验证码错误");
            this.createCode();
            return false;
        }
        else {
            //window.open(document.getElementById("J_down").getAttribute("data-link"));
            document.getElementById("J_codetext").value = "";
            this.createCode();
            return true;
        }
    }
}