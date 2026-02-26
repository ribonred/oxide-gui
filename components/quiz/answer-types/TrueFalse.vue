<template>
    <div class="space-y-3">
        <p class="text-sm sm:text-base text-gh-muted font-medium mb-3">Choose true or false:</p>
        <div class="tf-grid">
            <div 
                class="tf-card"
                :class="{ 'tf-card--selected tf-card--true': modelValue === 'true' }"
                @click="emit('update:modelValue', 'true')"
            >
                <div class="tf-card__icon">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <span class="tf-card__label">True</span>
            </div>
            
            <div 
                class="tf-card"
                :class="{ 'tf-card--selected tf-card--false': modelValue === 'false' }"
                @click="emit('update:modelValue', 'false')"
            >
                <div class="tf-card__icon">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </div>
                <span class="tf-card__label">False</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.tf-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.tf-card {
    padding: 1.25rem;
    border: 2px solid var(--color-gh-border);
    border-radius: 0.75rem;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;
    background: var(--color-gh-card);
}

.tf-card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px rgba(47, 129, 247, 0.1);
}

.tf-card--true:hover {
    border-color: color-mix(in srgb, rgb(34 197 94) 50%, transparent);
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.2);
}

.tf-card--false:hover {
    border-color: color-mix(in srgb, rgb(239 68 68) 50%, transparent);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
}

.tf-card--selected.tf-card--true {
    border-color: rgb(74 222 128);
    background: linear-gradient(to bottom right,
        color-mix(in srgb, rgb(34 197 94) 10%, var(--color-gh-card)),
        color-mix(in srgb, rgb(34 197 94) 5%, var(--color-gh-bg)));
    box-shadow: 0 0 25px rgba(34, 197, 94, 0.3);
}

.tf-card--selected.tf-card--false {
    border-color: rgb(248 113 113);
    background: linear-gradient(to bottom right,
        color-mix(in srgb, rgb(239 68 68) 10%, var(--color-gh-card)),
        color-mix(in srgb, rgb(239 68 68) 5%, var(--color-gh-bg)));
    box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);
}

.tf-card__icon {
    display: inline-flex;
    padding: 0.625rem;
    border-radius: 9999px;
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;
    background: color-mix(in srgb, var(--color-gh-bg) 50%, transparent);
    color: var(--color-gh-muted);
}

.tf-card:hover .tf-card__icon {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
}

.tf-card--true:hover .tf-card__icon {
    color: rgb(74 222 128);
    background: color-mix(in srgb, rgb(34 197 94) 10%, transparent);
}

.tf-card--false:hover .tf-card__icon {
    color: rgb(248 113 113);
    background: color-mix(in srgb, rgb(239 68 68) 10%, transparent);
}

.tf-card--selected.tf-card--true .tf-card__icon {
    background: color-mix(in srgb, rgb(34 197 94) 20%, transparent);
    color: rgb(74 222 128);
}

.tf-card--selected.tf-card--false .tf-card__icon {
    background: color-mix(in srgb, rgb(239 68 68) 20%, transparent);
    color: rgb(248 113 113);
}

.tf-card__label {
    display: block;
    font-size: 1rem;
    font-weight: bold;
    color: var(--color-gh-text);
}

@media (max-width: 1024px) {
    .tf-card {
        padding: 1rem;
    }

    .tf-card__label {
        font-size: 0.95rem;
    }

    .tf-card__icon svg {
        width: 1.5rem;
        height: 1.5rem;
    }
}

@media (max-width: 640px) {
    .tf-grid {
        grid-template-columns: 1fr;
    }

    .tf-card {
        padding: 0.875rem;
    }

    .tf-card__label {
        font-size: 0.9rem;
    }

    .tf-card__icon svg {
        width: 1.25rem;
        height: 1.25rem;
    }
}
</style>
