$(function () {
    // 点击 "去注册账号" 的链接
    $('#link_reg').on('click', function () {
        $('.login-box').stop().hide();
        $('.reg-box').stop().show();
    })
    // 点击 "去登录" 的链接
    $('#link_login').on('click', function () {
        $('.reg-box').stop().hide();
        $('.login-box').stop().show();
    })
    // 自定义密码格式验证
    //从layui中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })
    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        //发起POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data,
            function (res) {
                if (res.status !== 0) return layer.msg(res.message);
                // console.log(res.message);
                layer.msg(res.message);
                // 注册成功后自动登录
                $('#link_login').click()
            })
    })
    // 监听表单登录提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('登录失败')
                layer.msg('登录成功')
                // 将登录成功得到的 token 字符串保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})