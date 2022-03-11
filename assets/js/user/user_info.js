$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) return "昵称长度必须在 1~6 个字符之间!"
        }
    })
    initUserInfo();
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.meg('获取用户信息失败!')
                } else {

                }
                // 调用 layui.form.val() 方法快速取值、赋值
                layui.form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnreset').on('click', function (e) {
        //阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo();
    })

    // 修改用户资料
    $('.layui-form').on('submit', function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // serialize() 函数能快速的拿到表单里的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败!')
                } else {
                    layer.msg('修改用户信息成功!')
                    // 调用副页面中的方法,重新渲染用户的头像和用户的信息
                    // 在子窗口调父窗口的函数
                    window.parent.getUserInfo();
                }
            }
        })
    })


})