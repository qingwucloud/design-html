<!-- 消息列表为空时，展示 prompt 列表 -->
<template>
  <div class="chat-empty">
    <!-- title -->
    <div class="center-container">
      <div class="title">80度家装 AI</div>
      <div class="role-list">
        <div
          class="role-item"
          v-for="prompt in promptList"
          :key="prompt.prompt"
          @click="handlerPromptClick(prompt)"
        >
          {{ prompt.prompt }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const promptList = [
  {
    prompt: '今天气怎么样?'
  },
  {
    prompt: '写一首好听的诗歌?'
  }
] // prompt 列表

const emits = defineEmits(['onPrompt'])

/** 选中 prompt 点击 */
const handlerPromptClick = async ({ prompt }) => {
  emits('onPrompt', prompt)
}
</script>
<style scoped lang="scss">
.chat-empty {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;

  .center-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      font-size: 28px;
      font-weight: bold;
      text-align: center;
    }

    .role-list {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: center;
      width: 460px;
      margin-top: 20px;

      .role-item {
        display: flex;
        width: 180px;
        margin: 10px;
        line-height: 50px;
        cursor: pointer;
        border: 1px solid #e4e4e4;
        border-radius: 10px;
        justify-content: center;
      }

      .role-item:hover {
        background-color: rgb(243 243 243 / 73%);
      }
    }
  }
}
</style>
