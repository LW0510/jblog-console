<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="作者昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入作者昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入文章标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章标签" prop="tags">
        <el-input
          v-model="queryParams.tags"
          placeholder="请输入文章标签"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="articleList">
      <el-table-column type="index" width="55" align="center" />
      <el-table-column label="作者" align="center" prop="nickName" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="摘要" align="center" prop="summary" />
      <el-table-column label="标签" align="center" prop="tags2" />
      <el-table-column label="浏览量" align="center" prop="viewNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['system:article:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handlePass(scope.row)"
            v-hasPermi="['system:article:remove']"
          >通过</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleRefuse(scope.row)"
            v-hasPermi="['system:article:remove']"
          >拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看详情弹框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
 <el-form ref="form" :model="form" :rules="rules" label-width="150px" size="mini">
        <el-form-item label="标题："><div v-cloak>{{ form.title }}</div></el-form-item>
        <el-form-item label="摘要：">{{ form.summary}}</el-form-item>
        <el-form-item label="分类：">{{ form.category}}</el-form-item>
        <el-form-item label="标签：">{{ form.tags}}</el-form-item>
        <el-form-item label="内容：">
                  <quill-editor
                class="quill-editor_wrapper"
                v-model="form.content"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
              ></quill-editor>
        </el-form-item>
      </el-form>
     
    </el-dialog>
  </div>
</template>

<script>
import { listArticle, getArticle, delArticle, addArticle, auditArticle, exportArticle } from "@/api/blog/article";

export default {
  name: "Article",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 文章表格数据
      articleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        nickName: undefined,
        title: undefined,
        summary: undefined,
        content: undefined,
        contentHtml: undefined,
        viewNum: undefined,
        commentNum: undefined,
        weight: undefined,
        tags: undefined,
        categoryId: undefined,
        status: 0
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "作者昵称不能为空", trigger: "blur" }
        ],
        weight: [
          { required: true, message: "权重不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文章列表 */
    getList() {
      this.loading = true;
      listArticle(this.queryParams).then(response => {
        this.articleList = response.rows;
        this.total = response.totalCount;
        this.loading = false;
      });
    },
    /** 查看详情操作 */
    handleView(row){
      this.reset();
      getArticle(row.id).then(response => {
        this.form = response.data;
        let that = this.form;
        that.category = that.category.categoryName;

        //tags格式化
        let tags = [];
        that.tags.map((item,i) => {
          tags.push(item.tagName);
        });
         this.form.tags = tags.join(",");
      });
    
      this.open = true;
      this.title = "文章详情";
    },

    handlePass(row){
      let data = {
        id: row.id,
        status: "1"
      }
       this.$confirm('是否确认审核通过文章编号为"' + row.id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return auditArticle(data);
        }).then(() => {
          this.getList();
          this.msgSuccess("审核通过成功");
        }).catch(function() {});
    },
    handleRefuse(row){
     let data = {
        id: row.id,
        status: 2
      }
       this.$confirm('是否确认审核拒绝文章编号为"' + row.id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return auditArticle(data);
        }).then(() => {
          this.getList();
          this.msgSuccess("审核拒绝成功");
        }).catch(function() {});
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        userId: undefined,
        nickName: undefined,
        title: undefined,
        summary: undefined,
        content: undefined,
        contentHtml: undefined,
        viewNum: undefined,
        commentNum: undefined,
        weight: undefined,
        tags: undefined,
        categoryId: undefined,
        createTime: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getArticle(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文章";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            auditArticle(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addArticle(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除文章编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delArticle(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有文章数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportArticle(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //富文本禁止编辑
    onEditorFocus(event) { 
        event.enable(false);
    }, // 获得焦点事件
  }
};
</script>