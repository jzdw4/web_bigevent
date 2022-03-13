$(function () {
    var layer = layui.layer
    var form = layui.form

    // 获取文章分类
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('初始化文章分类失败!')
            }
            // 调用模板引擎渲染下拉菜单
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 一定要记得重新调用 form.render() 方法重新渲染
            form.render();
        }
    })
    // 初始化富文本编辑器
    initEditor()

    // 裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 更换裁剪的图片

    // 监听 coverFile 的change事件,获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // console.log(e);
        //1.拿到用户选择的文件
        // 获取到文件的列表数组
        var file = e.target.files[0]
        // 判断用户是否选择了文件
        if (file.length == 0) {
            return
        }
        //2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        //3.先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 文章的状态
    var art_state = '已发布'
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '存为草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 基于form表单快速创建FormData 对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态发布到fd中
        fd.append('state', art_state)
        // 将封面裁剪过后的图片,输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob)

                // 发起ajax请求,发送数据
                publishArticle(fd);
            })

    })

    // 发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意: 如果向服务器提交的是FormData 格式的数据,必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }


})