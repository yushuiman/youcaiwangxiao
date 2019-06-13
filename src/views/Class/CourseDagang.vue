<template>
  <div>
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside width="550px" style="background-color:#FAFAFA">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <hr  style="background-color: #F0F0F0">
            <el-menu-item-group>
              <template slot="title">分组一</template>

            </el-menu-item-group>
            <el-menu-item-group title="分组2">

            </el-menu-item-group>

          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>

            </el-menu-item-group>
            <el-menu-item-group title="分组2">

            </el-menu-item-group>

          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>导航三</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>

            </el-menu-item-group>
            <el-menu-item-group title="分组2">

            </el-menu-item-group>

          </el-submenu>
        </el-menu>
      </el-aside>

    </el-container>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  .menu {
    width: 100%;
    background-color: red;
  }
</style>
