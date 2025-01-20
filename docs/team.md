---
layout: page
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://i.p-i.vip/47/20241024-67192acae3bb8.png',
    name: 'XINGJI',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/XingJi-love' },
      { icon: 'youtube', link: 'https://www.youtube.com'}
    ],
  },
  {
    avatar: 'https://i.p-i.vip/47/20241024-67192acae3bb8.png',
    name: 'XINGJI',
    title: 'Developer',
    links: [
      { icon: 'github', link: 'https://github.com/XingJi-love' },
      { icon: 'youtube', link: 'https://www.youtube.com' },
    ],
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>
    <template #lead>
      The development of VitePress is guided by an international
      team, some of whom have chosen to be featured below.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="members" />
</VPTeamPage>