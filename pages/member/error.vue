<template>
    <div class="max-w-2xl mx-auto px-4 py-16">
        <div class="text-center mb-8">
            <div class="inline-block p-4 bg-red-500/10 rounded-2xl mb-4">
                <svg class="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-gh-text mb-2">Access Denied</h1>
            <p class="text-gh-text-muted">We couldn't verify your member access.</p>
        </div>

        <Card class="p-6 md:p-8 border-2 border-gh-border/50 shadow-xl">
            <Alert variant="error">
                <div class="space-y-2">
                    <p class="font-semibold">{{ message }}</p>
                    <p v-if="code" class="text-sm text-gh-text-muted">Code: {{ code }}</p>
                </div>
            </Alert>
            <div class="mt-6 text-sm text-gh-text-muted">
                Please contact the quiz owner to request a valid member link or API key.
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
import Alert from '~/components/ui/Alert.vue'

const route = useRoute()

const message = computed(() => {
    if (typeof route.query.message === 'string' && route.query.message.trim()) {
        return route.query.message
    }
    return 'Your member link is invalid or expired.'
})

const code = computed(() => {
    if (typeof route.query.code === 'string' && route.query.code.trim()) {
        return route.query.code
    }
    return ''
})
</script>
