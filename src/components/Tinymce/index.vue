<template>
  <textarea
    v-if="!initOptions.inline"
    :id="tinymceId"
    ref="elRef"
    :style="{ visibility: 'hidden' }"
  ></textarea>
  <slot v-else></slot>
</template>

<script lang="ts">
import type { Editor, RawEditorSettings } from 'tinymce'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'

import {
  defineComponent,
  computed,
  nextTick,
  ref,
  unref,
  watch,
  onDeactivated,
  onBeforeUnmount
} from 'vue'
import { toolbar, plugins } from './tinymce'
import { bindHandlers } from './helper'
import { isNumber } from 'lodash-es'
import { onMountedOrActivated } from '@/hooks/web/onMountedOrActivated'
import { buildShortUUID } from '@/utils/uuid'

const tinymceProps = {
  options: {
    type: Object as PropType<Partial<RawEditorSettings>>,
    default: () => ({})
  },
  value: {
    type: String
  },
  toolbar: {
    type: Array as PropType<string[]>,
    default: toolbar
  },
  plugins: {
    type: Array as PropType<string[]>,
    default: plugins
  },
  modelValue: {
    type: String
  },
  height: {
    type: [Number, String] as PropType<string | number>,
    required: false,
    default: 400
  },
  width: {
    type: [Number, String] as PropType<string | number>,
    required: false,
    default: 'auto'
  }
}

export default defineComponent({
  name: 'Tinymce',
  inheritAttrs: false,
  props: tinymceProps,
  emits: ['change', 'update:modelValue', 'inited', 'init-error'],
  setup(props, { emit, attrs }) {
    const editorRef = ref<Nullable<Editor>>(null)
    const fullscreen = ref(false)
    const tinymceId = ref<string>(buildShortUUID('tiny-vue'))
    const elRef = ref<Nullable<HTMLElement>>(null)

    const tinymceContent = computed(() => props.modelValue)

    const containerWidth = computed(() => {
      const width = props.width
      if (isNumber(width)) {
        return `${width}px`
      }
      return width
    })

    const skinName = ref('oxide')

    const initOptions = computed((): RawEditorSettings => {
      const { height, options, toolbar, plugins } = props
      const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/'
      return {
        selector: `#${unref(tinymceId)}`,
        height,
        toolbar,
        menubar: 'file edit insert view format table',
        plugins,
        language_url: publicPath + 'resource/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        branding: false,
        default_link_target: '_blank',
        link_title: false,
        object_resizing: false,
        auto_focus: true,
        skin: skinName.value,
        skin_url: publicPath + 'resource/tinymce/skins/ui/' + skinName.value,
        content_css:
          publicPath + 'resource/tinymce/skins/ui/' + skinName.value + '/content.min.css',
        ...options,
        setup: (editor: Editor) => {
          editorRef.value = editor
          editor.on('init', (e: any) => initSetup(e))
        }
      }
    })

    const disabled = computed(() => {
      const { options } = props
      const getDisabled = options && Reflect.get(options, 'readonly')
      const editor = unref(editorRef)
      if (editor) {
        editor.setMode(getDisabled ? 'readonly' : 'design')
      }
      return getDisabled ?? false
    })

    watch(
      () => attrs.disabled,
      () => {
        const editor = unref(editorRef)
        if (!editor) {
          return
        }
        editor.setMode(attrs.disabled ? 'readonly' : 'design')
      }
    )

    // watch(isDark, () => {
    //   initEditor()
    // })

    onMountedOrActivated(() => {
      if (!initOptions.value.inline) {
        tinymceId.value = buildShortUUID('tiny-vue')
      }
      nextTick(() => {
        setTimeout(() => {
          initEditor()
        }, 30)
      })
    })

    onBeforeUnmount(() => {
      destroy()
    })

    onDeactivated(() => {
      destroy()
    })

    function destroy() {
      if (tinymce !== null) {
        tinymce?.remove?.(unref(initOptions).selector!)
      }
    }

    function initEditor() {
      destroy()
      const el = unref(elRef)
      if (el) {
        el.style.visibility = ''
      }
      tinymce
        .init(unref(initOptions))
        .then((editor: any) => {
          emit('inited', editor)
        })
        .catch((err: any) => {
          emit('init-error', err)
        })
    }

    function initSetup(e: any) {
      const editor = unref(editorRef)
      if (!editor) {
        return
      }
      const value = props.modelValue || ''

      editor.setContent(value)
      bindModelHandlers(editor)
      bindHandlers(e, attrs, unref(editorRef))
    }

    function setValue(editor: Record<string, any>, val: string, prevVal?: string) {
      if (
        editor &&
        typeof val === 'string' &&
        val !== prevVal &&
        val !== editor.getContent({ format: attrs.outputFormat })
      ) {
        editor.setContent(val)
      }
    }

    function bindModelHandlers(editor: any) {
      const modelEvents = attrs.modelEvents ? attrs.modelEvents : null
      const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents

      watch(
        () => props.modelValue,
        (val: any, prevVal: any) => {
          setValue(editor, val, prevVal)
        }
      )

      watch(
        () => props.value,
        (val: any, prevVal: any) => {
          setValue(editor, val, prevVal)
        },
        {
          immediate: true
        }
      )

      editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
        const content = editor.getContent({ format: attrs.outputFormat })
        emit('update:modelValue', content)
        emit('change', content)
      })

      editor.on('FullscreenStateChanged', (e: any) => {
        fullscreen.value = e.state
      })
    }

    return {
      containerWidth,
      initOptions,
      tinymceContent,
      elRef,
      tinymceId,
      editorRef,
      fullscreen,
      disabled
    }
  }
})
</script>

<style scoped lang="scss">
.tinymce-container {
  position: relative;
  line-height: normal;

  textarea {
    z-index: -1;
    visibility: hidden;
  }
}
</style>
