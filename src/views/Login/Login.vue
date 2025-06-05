<template>
  <div :class="prefixCls" class="relative h-[100%]">
    <div class="relative mx-auto h-full flex">
      <div
        class="relative flex flex-col flex-1 p-30px dark:bg-[var(--login-bg-color)] lt-sm:p-10px overflow-x-hidden overflow-y-auto"
      >
        <!-- 右上角的主题、语言选择 -->
        <div
          class="flex items-center justify-between at-2xl:justify-end at-xl:justify-end"
          style="color: var(--el-text-color-primary)"
        >
          <div class="flex items-center at-2xl:hidden at-xl:hidden">
            <!--            <img alt="" class="mr-10px h-48px w-48px" src="@/assets/imgs/logo.png" />-->
            <!--            <span class="text-20px font-bold" >{{ underlineToHump(appStore.getTitle) }}</span>-->
          </div>
          <div class="flex items-center justify-end space-x-10px h-48px">
            <!--            <ThemeSwitch />-->
            <!--            <LocaleDropdown />-->
          </div>
        </div>
        <!-- 右边的登录界面 -->
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div class="flex items-center justify-center flex-1">
            <!-- 账号登录 -->
            <LoginForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
            <!-- 手机登录 -->
            <MobileForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" />
          </div>
        </Transition>
        <div class="copyright"
          ><a href="https://beian.miit.gov.cn/" target="”_blank”"
            >80duycsj.com 版权所有@2025 湘ICP备2025122206号-2</a
          ></div
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { underlineToHump } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'

import { LoginForm, MobileForm } from './components'

defineOptions({ name: 'Login' })

const { t } = useI18n()
const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;
  background-image: url('@/assets/imgs/login-bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
</style>

<style lang="scss">
.dark .login-form {
  .el-divider__text {
    background-color: var(--login-bg-color);
  }

  .el-card {
    background-color: var(--login-bg-color);
  }
}

.copyright {
  text-align: center;

  a {
    font-size: 13px;
    color: #999;
    text-decoration: none;
  }
}
</style>
