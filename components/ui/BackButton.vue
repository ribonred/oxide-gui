<template>
    <button @click="handleClick" class="p-2 hover:bg-gh-hover rounded-md transition-colors group" :title="title">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-gh-text group-hover:text-gh-accent transition-colors">
            <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>
        </svg>
    </button>
</template>

<script setup>
const props = defineProps({
    to: {
        type: String,
        default: null
    },
    title: {
        type: String,
        default: 'Go back'
    }
})

const router = useRouter()

const handleClick = () => {
    if (props.to) {
        router.push(props.to)
    } else {
        router.back()
    }
}
</script>
