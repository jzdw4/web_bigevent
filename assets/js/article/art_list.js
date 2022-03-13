$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象,将来请求数据的时候,需要将请求参数对象发生到服务器
    var q = {
        // 页码值,默认第一页
        pagenum: 1,
        // 	每页显示多少条数据
        pagesize: 2,
        // 文章分类的 Id
        cate_id: "",
        // 文章的状态，可选值有：已发布、草稿
        state: ""
    }

    initTable();
    initCate();

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 渲染模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 重新渲染表单
                form.render();
            }
        })
    }

    // 为筛选表单绑定submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q 赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件,重新渲染表格的数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', // 分页容器id
            count: total, // 总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, // 起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候,触发jump 回调
            // 触发jump的方式有两种: 1.点击页码;2.只要调用了laypage.render()方法
            jump: function (obj, first) { //first 是布尔类型
                // 通过first 的值,来判断是哪种方式触发jump回调的,如果first 的值为true,证明是方式2触发的, 否则是方式1触发的
                // 把最新的页码值,赋值到这个查询参数对象中
                q.pagenum = obj.curr;
                // console.log(obj.curr);
                // 把最新的条目数给q重新上传渲染
                q.pagesize = obj.limit;
                // 根据最新的q 获取对应的数据列表,并渲染表格
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 通过代理,为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮在当前页面的个数
        var len = $('.btn-delete').length
        // console.log(len);
        // 通过自定义属性获取文章id
        id = $(this).attr('data-id')
        // 弹出层,询问用户是否要删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    // 当数据删除完成后,需要判断这一页中,是否还有剩余的数据,如果没有剩余的数据,则让页码值-1,再调用initTable 方法
                    if (len === 1) {
                        // 删除完毕之后,页面没有数据
                        // 页码值必须最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            // layer.close(index);
        });
    })

})