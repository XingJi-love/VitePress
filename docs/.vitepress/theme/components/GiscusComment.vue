<template>
    <div style="margin-top: 24px">
        <Giscus
            id="R_kgDONs90Yg"
            repo="XingJi-love/VitePress"
            repoid="R_kgDOIN2Meg"
            category="Announcements"
            categoryid="DIC_kwDONs90Ys4CmMcK"
            mapping="pathname"
            term="Welcome to giscus!"
            reactionsenabled="1"
            emitmetadata="0"
            inputposition="top"
            loading="lazy"
            :theme="isDark ? 'dark' : 'light'"
            :key="route.path"
        ></Giscus>
    </div>
</template>

<script setup>
import Giscus from '@giscus/vue';
import { useRoute, useData } from 'vitepress';

const route = useRoute();
const { isDark } = useData();
</script>