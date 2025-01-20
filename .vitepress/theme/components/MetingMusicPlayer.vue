<template>
    <div class="music-player min-h-screen bg-black p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
            <div class="text-red-500 mb-4">{{ error }}</div>
            <button @click="initializePlayer"
                class="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
                重试
            </button>
        </div>

        <!-- Player Content -->
        <div v-else class="max-w-xl mx-auto space-y-8">
            <!-- Now Playing -->
            <div class="flex flex-col items-center">
                <div class="w-48 h-48 mb-6">
                    <img :src="currentTrack.pic" :alt="currentTrack.name"
                        class="w-full h-full object-cover rounded-lg shadow-lg" @error="handleImageError"
                        crossorigin="anonymous">
                </div>

                <div class="text-center mb-6">
                    <h2 class="text-xl text-green-400">{{ currentTrack.name}}</h2>
                    <p class="text-green-500/60">{{ currentTrack.artist}}</p>
                </div>

                <!-- Progress Bar -->
                <div class="w-full space-y-1">
                    <div class="relative h-1 bg-green-900/30 rounded-full overflow-hidden">
                        <div class="absolute h-full bg-green-500 rounded-full transition-all duration-300"
                            :style="{ width: `${progress}%` }"></div>
                    </div>
                    <div class="flex justify-between text-xs text-green-500/60">
                        <span>{{ formatTime(currentTime) }}</span>
                        <span>{{ formatTime(duration) }}</span>
                    </div>
                </div>
            </div>

            <!-- Playlist -->
            <div>
                <h3 class="text-green-400 text-lg mb-4">播放列表</h3>
                <div class="space-y-2 max-h-[calc(100vh-480px)] overflow-y-auto custom-scrollbar">
                    <div v-for="(track, index) in playlist" :key="track.id" @click="playTrack(index)"
                        class="flex items-center p-2 rounded cursor-pointer transition-colors"
                        :class="currentTrackIndex === index ? 'bg-green-500/20' : 'hover:bg-green-500/10'">
                        <img :src="track.pic" :alt="track.name" class="w-12 h-12 rounded object-cover mr-3"
                            @error="handleImageError" crossorigin="anonymous">
                        <div class="flex-1 min-w-0">
                            <p class="text-green-400 truncate">{{ track.name }}</p>
                            <p class="text-green-500/60 text-sm truncate">{{ track.artist }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Audio Element -->
        <audio ref="audioPlayer" :src="currentTrack.url" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
            @ended="nextTrack" @error="onAudioError" @canplay="onCanPlay" crossorigin="anonymous"></audio>
    </div>
</template>

<script setup>
// Script section remains the same as previous version
import { ref, computed, onMounted } from 'vue'

const audioPlayer = ref(null)
const loading = ref(true)
const error = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentTrackIndex = ref(0)
const playlist = ref([])
const retryCount = ref(0)
const maxRetries = 3

// API Configuration
const API_BASE = 'https://music.xingji.fun/api'
const DEFAULT_PLAYLIST = '8744445147' // 默认网易云歌单ID
const FALLBACK_IMAGE = '/placeholder.svg?height=400&width=400'

const currentTrack = computed(() => {
    return playlist.value[currentTrackIndex.value] || {
        name: '未在播放',
        artist: '未知艺术家',
        pic: FALLBACK_IMAGE,
        url: ''
    }
})

const progress = computed(() => {
    if (!duration.value) return 0
    return (currentTime.value / duration.value) * 100
})

const fetchPlaylist = async () => {
    try {
        loading.value = true
        error.value = null

        const response = await fetch(`${API_BASE}?server=netease&type=playlist&id=${DEFAULT_PLAYLIST}`, {
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            }
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        if (!Array.isArray(data) || !data.length) throw new Error('Invalid playlist data')

        playlist.value = data.map(track => ({
            ...track,
            pic: track.pic || FALLBACK_IMAGE
        }))

        await playTrack(0)
    } catch (err) {
        console.error('Error fetching playlist:', err)
        error.value = '获取播放列表失败，请稍后重试'
    } finally {
        loading.value = false
    }
}

const playTrack = async (index) => {
    try {
        currentTrackIndex.value = index
        isPlaying.value = true
        retryCount.value = 0

        if (audioPlayer.value) {
            audioPlayer.value.currentTime = 0
            const playPromise = audioPlayer.value.play()

            if (playPromise !== undefined) {
                await playPromise
            }
        }
    } catch (err) {
        console.error('Error playing track:', err)
        handlePlayError()
    }
}

const handlePlayError = async () => {
    if (retryCount.value < maxRetries) {
        retryCount.value++
        console.log(`Retrying playback (${retryCount.value}/${maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        await playTrack(currentTrackIndex.value)
    } else {
        error.value = '播放失败，请稍后重试'
        isPlaying.value = false
    }
}

const onTimeUpdate = () => {
    if (!audioPlayer.value) return
    currentTime.value = audioPlayer.value.currentTime
}

const onLoadedMetadata = () => {
    if (!audioPlayer.value) return
    duration.value = audioPlayer.value.duration
}

const onAudioError = (e) => {
    console.error('Audio error:', e)
    handlePlayError()
}

const onCanPlay = () => {
    error.value = null
}

const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE
}

const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const initializePlayer = () => {
    error.value = null
    retryCount.value = 0
    fetchPlaylist()
}

onMounted(() => {
    initializePlayer()
})
</script>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(74, 222, 128, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(74, 222, 128, 0.3);
    border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(74, 222, 128, 0.5);
}
</style>