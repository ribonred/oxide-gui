<template>
    <div class="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div class="flex items-center justify-between gap-3">
            <BackButton :to="`/public/${route.params.id}`" title="Back to Quiz" />
        </div>

        <QuizLeaderboard :quiz-id="route.params.id" :public-mode="true" />
    </div>
</template>

<script setup>
import BackButton from '~/components/ui/BackButton.vue'
import QuizLeaderboard from '~/components/quiz/QuizLeaderboard.vue'

useSeoMeta({
    title: 'Leaderboard',
    ogTitle: 'Quiz Leaderboard - QuizOxide',
    description: 'See how you rank against other participants. View scores, rankings, and completion times on QuizOxide.',
    ogDescription: 'See how you rank against other participants on QuizOxide.',
})

definePageMeta({
    layout: 'quiz-taking',
})

const route = useRoute()
</script>
