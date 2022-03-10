// 注意: 每次调用 $.get() 或 $.post() 或 $.ajax 的时候,会先调用ajaxPrefilter 这个函数, 在这个函数中,可以拿ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    // 在发起真正的 ajax 请求之前,统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // /my开头才需要headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token' || '')
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        console.log(res);
        if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
            // 强制清空 token
            localStorage.removeItem('token');
            // 强制跳转到登录页
            location.href = '/login.html'
        }
    }
})