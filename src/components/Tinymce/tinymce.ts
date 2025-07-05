// Any plugins you want to setting has to be imported
// Detail plugins list see https://www.tinymce.com/docs/plugins/
// Custom builds see https://www.tinymce.com/download/custom-builds/
// colorpicker/contextmenu/textcolor plugin is now built in to the core editor, please remove it from your editor configuration

export const plugins = [
  'advlist anchor autolink autosave code codesample directionality fullscreen hr insertdatetime link lists image media nonbreaking noneditable pagebreak paste preview print save searchreplace table tabfocus template textpattern visualblocks visualchars wordcount'
]

export const toolbar = [
  'fontsizeselect lineheight searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript code codesample',
  'hr bullist numlist link preview anchor pagebreak insertdatetime image media forecolor backcolor fullscreen'
]

export const simplePlugins = [
  'advlist anchor autolink autosave directionality fullscreen hr insertdatetime lists image nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus template textpattern visualblocks visualchars wordcount textcolor'
]

export const simpleToolbar = [
  'lineheight bold italic underline fontsizeselect bullist numlist image fullscreen forecolor backcolor undo redo aligncenter '
]
