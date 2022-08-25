import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const rootPath = path.resolve(__dirname, './src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
      dts: path.resolve(rootPath, 'auto-imports.d.ts')
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: path.resolve(rootPath, 'components.d.ts')
    })
  ],
  resolve: {
    alias: {
      '@': rootPath
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";'
      }
    }
  }
  // server: {
  //   host: '0.0.0.0',
  //   port: 5000
  // }
})
