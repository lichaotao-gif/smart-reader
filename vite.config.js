import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  // 读者端 / 作者端 / 出版社端为多套静态页，避免 /creator/ 等被 SPA 回退到读者首页
  appType: 'mpa',
  server: {
    port: 5173,
    open: true,
    watch: {
      // 避免部分环境下 fsevents 异常导致 dev 崩溃
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
