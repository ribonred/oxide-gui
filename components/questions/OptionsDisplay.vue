<template>
    <div v-if="options && options.length > 0" class="space-y-2">
        <h3 class="text-sm font-medium text-gh-muted mb-2">{{ title }}</h3>
        <div class="bg-gh-bg border border-gh-border rounded-md p-3">
            <div v-for="(option, index) in options" :key="index" class="flex items-center gap-3 py-2 border-b border-gh-border last:border-b-0">
                <span class="flex items-center justify-center w-8 h-8 bg-gh-bg border border-gh-accent text-gh-accent rounded-md text-sm font-medium">
                    {{ index + 1 }}
                </span>
                <div class="flex-1">
                    <div v-if="option.label === option.value" class="text-gh-text">
                        {{ option.label }}
                    </div>
                    <div v-else class="space-y-1">
                        <div class="text-gh-text font-medium">{{ option.label }}</div>
                        <div class="text-gh-muted text-sm flex items-center gap-2">
                            <span class="text-xs">→</span>
                            <span>{{ option.value }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    options: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: 'Options'
    }
})
</script>
