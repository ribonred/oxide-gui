<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeOnBackdrop && close()">
                <div :class="modalClasses">
                    <!-- Header -->
                    <div v-if="title || $slots.header" class="flex items-center justify-between mb-4">
                        <slot name="header">
                            <h2 class="text-xl font-bold text-gh-text">{{ title }}</h2>
                        </slot>
                        <button v-if="closable" @click="close" class="text-gh-muted hover:text-gh-text transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Content -->
                    <div class="mb-6">
                        <slot />
                    </div>
                    
                    <!-- Footer -->
                    <div v-if="$slots.footer" class="flex gap-4">
                        <slot name="footer" :close="close" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
const props = defineProps({
    modelValue: Boolean,
    title: String,
    size: {
        type: String,
        default: 'md', // sm, md, lg, xl
        validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    closable: {
        type: Boolean,
        default: true
    },
    closeOnBackdrop: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
    emit('update:modelValue', false)
    emit('close')
}

const modalClasses = computed(() => {
    const base = 'bg-gh-card border border-gh-border rounded-lg p-6 mx-4'
    
    const sizes = {
        sm: 'max-w-sm w-full',
        md: 'max-w-md w-full',
        lg: 'max-w-lg w-full',
        xl: 'max-w-xl w-full'
    }
    
    return `${base} ${sizes[props.size]}`
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
