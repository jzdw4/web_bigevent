$(function () {
    var form = layui.form;

    // 表单验证
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name = oldpwd]').val()) {
                return '新旧密码不能相同!'
            }
            /* else if (value !== $('[name=repwd]').val()) {
                           return '两次密码输入不一致!'
                       } */
        },
        rePwd: function (value) {
            if (value !== $('[name=newpwd]').val()) {
                return '两次密码输入不一致!'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: 'http://www.liulongbin.top:3007/my/updatepwd',
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token' || '')
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('重置密码失败!')
                } else {
                    layui.layer.msg('重置密码成功')
                    //然后重置表单(先jquery转换成DOM元素)
                    $('.layui-form')[0].reset();
                }
            }
        })
    })
})