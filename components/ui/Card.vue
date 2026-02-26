<template>
    <div :class="cardClasses">
        <slot />
    </div>
</template>

<script setup>
const props = defineProps({
    padding: {
        type: String,
        default: 'md', // sm, md, lg, none
        validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
    },
    hover: {
        type: Boolean,
        default: false
    }
})

const cardClasses = computed(() => {
    const base = 'bg-gh-card border border-gh-border rounded-lg'
    
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    }
    
    const hoverClass = props.hover ? 'hover:border-gh-accent transition-colors cursor-pointer' : ''
    
    return `${base} ${paddings[props.padding]} ${hoverClass}`
})
</script>
