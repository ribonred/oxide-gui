<template>
    <NuxtLink v-if="to" :to="to" :class="buttonClasses">
        <slot />
    </NuxtLink>
    <button v-else :type="type" :disabled="disabled" :class="buttonClasses" @click="emit('click', $event)">
        <slot />
    </button>
  
</template>

<script setup>
const props = defineProps({
    variant: {
        type: String,
        default: 'primary', // primary, secondary, danger, ghost
        validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
    },
    size: {
        type: String,
        default: 'md', // sm, md, lg
        validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    type: {
        type: String,
        default: 'button'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    fullWidth: {
        type: Boolean,
        default: false
    },
    to: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
    const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    const cursor = props.to ? 'cursor-pointer' : ''

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    }

    const variants = {
        primary: 'bg-gh-accent text-white hover:opacity-90',
        secondary: 'bg-gh-bg border border-gh-border text-gh-text hover:bg-gh-hover',
        danger: 'bg-gh-accent/10 border border-gh-accent text-gh-accent hover:bg-gh-accent hover:text-white',
        ghost: 'bg-transparent text-gh-text hover:bg-gh-hover'
    }

    const width = props.fullWidth ? 'w-full' : ''

    return `${base} ${cursor} ${sizes[props.size]} ${variants[props.variant]} ${width}`
})
</script>
