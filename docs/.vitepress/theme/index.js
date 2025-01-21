// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './style/index.css'
import Mycomponent from "./components/Mycomponent.vue"
import Linkcard from "./components/Linkcard.vue"
import confetti from "./components/confetti.vue"
import xgplayer from "./components/xgplayer.vue"
import update from "./components/update.vue"
import backtotop from "./components/backtotop.vue"
import HomeUnderline from "./components/HomeUnderline.vue"
import { inBrowser } from "vitepress";
import busuanzi from "busuanzi.pure.js";
import DataPanel from "./components/DataPanel.vue";
import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import 'virtual:group-icons.css' //代码组图标样式
import "vitepress-markdown-timeline/dist/theme/index.css";
import { DocBox, DocLinks, DocBoxCube } from '@theojs/lumen'; // 链接卡片组件
import vitepressMusic from 'vitepress-plugin-music' // 音乐播放器组件
import 'vitepress-plugin-music/lib/css/index.css' // 音乐播放器样式

import { NProgress } from 'nprogress-v2/dist/index.js' // 进度条组件
import 'nprogress-v2/dist/index.css' // 进度条样式

import FriendsLinks from './components/FriendsLinks.vue' // 友链组件

import giscusTalk from 'vitepress-plugin-comment-with-giscus'
import { useData, useRoute } from 'vitepress' // 评论组件


const playlist = [
  {
    name: '白鸽乌鸦相爱的戏码-潘成（皮卡潘）',
    author: '潘成(皮卡潘)',
    file: '/mp3/白鸽乌鸦相爱的戏码-潘成（皮卡潘）.mp3',
  },
  {
    name: '春娇与志明-街道办GDC&欧阳耀莹',
    author: '街道办GDC&欧阳耀莹',
    file: '/mp3/春娇与志明-街道办GDC&欧阳耀莹.mp3',
  },
  {
    name: '最后一页',
    author: '最后一页',
    file: '/mp3/最后一页.mp3',
  },
  {
    name: '起风了-买辣椒也用券',
    author: '买辣椒也用券',
    file: '/mp3/起风了-买辣椒也用券.mp3',
  },
  {
    name: '平凡之路',
    author: '平凡之路',
    file: '/mp3/平凡之路.mp3',
  },
  {
    name: '光辉岁月-Beyond',
    author: 'Beyond',
    file: '/mp3/光辉岁月-Beyond.mp3',
  },
  {
    name: '白鸽乌鸦相爱的戏码-潘成（皮卡潘）',
    author: '潘成(皮卡潘)',
    file: 'https://dlink.host/musics/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VaMVFFdmE1OEZCRXBad2F4YUltWGJFQnlwM3htQjlZZ2tQVTNMZU5Tenoya1E.mp3',
  },
  {
    name: '春娇与志明-街道办GDC&欧阳耀莹',
    author: '街道办GDC&欧阳耀莹',
    file: 'https://dlink.host/musics/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VXcjhTbE8xbVdOR3NYUVZ0MWhxRzBvQkdmMllsZFpIclJhMDJ4cnJ0NndNclE.mp3',
  },
  {
    name: '最后一页',
    author: '最后一页',
    file: 'https://dlink.host/musics/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VXWTlMRmJha1hkTXFYUzlnN0pmcEJzQlJpN05NME5TWVFLbkVSaGYxellZSHc.mp3',
  },
  {
    name: '起风了-买辣椒也用券',
    author: '买辣椒也用券',
    file: 'https://dlink.host/musics/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VkZjZxenFyOWtSUHVpS3RPU0NzZVlNQmNvSzljSXF4ZGstSk96aUZGbVZPX1E.mp3',
  },
  {
    name: '平凡之路',
    author: '平凡之路',
    file: 'https://dlink.host/musics/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VkTzVsT2VLYXpkQmctY3BLYjFhWHhnQnlCZ3Jxc1VmYUQ4WHRVWHlZQlBvdWc.mp3',
  },
  {
    name: '光辉岁月-Beyond',
    author: 'Beyond',
    file: 'https://dlink.host/musics/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VkZVdzWnNsU2FoTmp2b3BIbW5TbGtBQnFFZ2ZuQ1NsMHY3Y2k3NUZibUwwR0E.mp3',
  },
]


/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,

  Layout: () => { // 返回顶部
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'doc-footer-before': () => h(backtotop), // 使用doc-footer-before插槽
    })
  },

  setup() { // 图片放大功能初始化
    const { frontmatter } = useData();
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom(".main img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );

    // giscus配置
    // Obtain configuration from: https://giscus.app/
    giscusTalk({
        repo: 'XingJi-love/VitePress', //仓库
        repoId: 'R_kgDONs90Yg', //仓库ID
        category: 'Announcements', // 讨论分类
        categoryId: 'DIC_kwDONs90Ys4CmMcK', //讨论分类ID
        mapping: 'pathname', // default: `pathname`
        inputPosition: 'top', // default: `top`
        lang: 'en', // default: `zh-CN`
        lightTheme: 'light', // default: `light`
        darkTheme: 'transparent_dark', // default: `transparent_dark`
        // ...
    },
    {
      frontmatter, route
      },
      // Whether to activate the comment area on all pages.
      // The default is true, which means enabled, this parameter can be ignored;
      // If it is false, it means it is not enabled.
      // You can use `comment: true` preface to enable it separately on the page.
      true
    );
  },
  /*
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },*/
  enhanceApp({ app, router, siteData, ctx }) {
    // ...
    app.component('Mycomponent', Mycomponent)
    app.component('Linkcard', Linkcard)
    app.component('confetti', confetti)
    app.component('xgplayer', xgplayer)
    app.component('update', update)
    app.component('HomeUnderline', HomeUnderline)
    app.component("DataPanel", DataPanel);//注册全局组件
    app.component('Box', DocBox) // 注册链接卡片组件
    app.component('Links', DocLinks)
    app.component('BoxCube', DocBoxCube)
    app.component('FriendsLinks', FriendsLinks) // 注册友链组件
    vitepressMusic(playlist) // 注册音乐播放器组件
    if (inBrowser) {
      NProgress.configure({ showSpinner: false })
      router.onBeforeRouteChange = () => {
        NProgress.start() // 开始进度条
      }
      router.onAfterRouteChanged = () => {
        busuanzi.fetch()
        NProgress.done() // 停止进度条
      }
    }
  },
};
