$(function () {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();

    var layer = layui.layer;

    // 绑定点击退出按钮事件
    $('#btnLogout').on('click', function () {
        layer.open({
            content: '确认退出？',
            icon: 3,
            btn: ['确认', '取消'],
            yes: function (index, layero) {
                //按钮【确认】的回调,清空本地存储的数据,并返回登陆页面
                localStorage.removeItem('token');
                location.href = '/login.html'
            },
            btn2: function (index, layero) {
                //按钮【取消】的回调 
                layer.close(index);
            }
        });
    })
})

// 获取用用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // header 就是请求头配置对象
        /* headers: {
            Authorization: localStorage.getItem('token' || '')
        }, */
        success: function (res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
            // 成功之后渲染头像
            renderAvatar(res.data);
        },
        // 无论成功还是失败,都会调用complete 函数
        /*  complete: function (res) {
             console.log(res);
             if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
                 // 强制清空 token
                 localStorage.removeItem('token');
                 // 强制跳转到登录页
                 location.href = '/login.html'
             }
         } */
    })
}

// 渲染用户头像
function renderAvatar(user) {
    //1. 获取用户名称
    var name = user.nickname || user.username;
    //2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    //3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 用户定义了头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 用户没有定义头像
        $('.layui-nav-img').hide();
        // 获取第一个字符转成大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();
    }
}