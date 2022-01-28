module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'vue/multi-word-component-names': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    ElMessage: 'readonly',
    ElForm: 'readonly'
  }
}
