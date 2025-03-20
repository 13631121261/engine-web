import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// @ts-ignore
import type { UserConfig, ConfigEnv, ProxyOptions } from 'vite'
// @ts-ignore
import { isProd, loadEnv } from '/@/utils/vite'
// @ts-ignore
import { svgBuilder } from '/@/components/icon/svg/index'

const pathResolve = (dir: string): any => {
    return resolve(__dirname, '.', dir)
}
// https://vitejs.cn/config/
const viteConfig = ({ mode }: ConfigEnv): UserConfig => {
    const { VITE_PORT, VITE_OPEN, VITE_BASE_PATH, VITE_OUT_DIR, VITE_PROXY_URL } = loadEnv(mode)
    const alias: Record<string, string> = {
        '/@': pathResolve('./src/'),
        assets: pathResolve('./src/assets'),
        'vue-i18n': isProd(mode) ? 'vue-i18n/dist/vue-i18n.cjs.prod.js' : 'vue-i18n/dist/vue-i18n.cjs.js',
    }
    return {
        plugins: [vue(), svgBuilder('./src/assets/icons/')],
        root: process.cwd(),
        resolve: { alias },
        server: {
            host: '0.0.0.0',
            port: 80,
            open: false,
            proxy:{
                '/userApi': {
                   // target: 'http://www.baidu.com/',
                    target: 'http://127.0.0.1:7001/',
                    // true 代表跨域
                    changOrigin: true

                },
                '/upload': {
                    // target: 'http://www.baidu.com/',
                    target: 'http://127.0.0.1:7001/',
                    // true 代表跨域
                    changOrigin: true
                }
            },
        },
        build: {
            cssCodeSplit: false,
            sourcemap: false,
            outDir: VITE_OUT_DIR,
            emptyOutDir: true,
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                output: {
                    manualChunks: {
                        // 分包配置，配置完成自动按需加载
                        vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', 'element-plus'],
                        echarts: ['echarts'],
                    },
                },
            },
        },
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule: { name: string; remove: () => void }) => {
                                if (atRule.name === 'charset') {
                                    atRule.remove()
                                }
                            },
                        },
                    },
                ],
            },
        },
    }
}

export default viteConfig
