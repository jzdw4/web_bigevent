$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章分类列表
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                var htmlStr = template('tpl_web', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 给弹出层加索引
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 事件委托,代理,为formAdd绑定submit 事件
    $('body').on('submit', '#formAdd', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败!')
                }
                initArtCateList();
                layer.msg('新增分类成功')
                // 根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    //点击修改按钮
    // 通过代理,为编辑按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id')
        // 发起请求获取对应分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    // return layer.msg('获取文章失败')
                }
                // 表单数据填充
                form.val('form-edit', res.data)
            }
        })
    })

    // 为修改类的表单绑定提交事件
    $('body').on('submit', '#formedit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            // serialize 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败!')
                }
                layer.msg('更新分类信息成功')
                layer.close(indexEdit)
                // 刷新表格数据
                initArtCateList();
            }

        })
    })

    // 删除按钮
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 弹出层,提示用户是否删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    layer.close(index);
                    initArtCateList();
                }
            })
            layer.close(index);
        });
    })
})