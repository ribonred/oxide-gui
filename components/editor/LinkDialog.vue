<template>
    <div v-if="isOpen" class="dialog-overlay" @click.self="close">
        <div class="dialog-box">
            <h3 class="dialog-title">{{ title }}</h3>
            <input
                ref="inputRef"
                v-model="inputValue"
                type="text"
                :placeholder="placeholder"
                class="dialog-input"
                @keydown.enter="confirm"
                @keydown.esc="close"
            />
            <div class="dialog-actions">
                <button @click="close" class="dialog-btn dialog-btn-cancel">Cancel</button>
                <button @click="confirm" class="dialog-btn dialog-btn-confirm">{{ confirmText }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    isOpen: Boolean,
    title: String,
    placeholder: String,
    defaultValue: String,
    confirmText: {
        type: String,
        default: 'Confirm'
    }
})

const emit = defineEmits(['close', 'confirm'])

const inputValue = ref(props.defaultValue || '')
const inputRef = ref(null)

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        inputValue.value = props.defaultValue || ''
        nextTick(() => {
            inputRef.value?.focus()
            inputRef.value?.select()
        })
    }
})

const close = () => {
    emit('close')
}

const confirm = () => {
    emit('confirm', inputValue.value)
    inputValue.value = ''
}
</script>

<style scoped>
.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.dialog-box {
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 1rem;
    padding: 1.5rem;
    min-width: 400px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    animation: slideUp 0.2s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.dialog-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-gh-text);
    margin-bottom: 1rem;
}

.dialog-input {
    width: 100%;
    padding: 0.75rem;
    background: var(--color-gh-bg);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.5rem;
    color: var(--color-gh-text);
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s ease;
    margin-bottom: 1rem;
}

.dialog-input:focus {
    border-color: var(--color-gh-accent);
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.15);
}

.dialog-input::placeholder {
    color: var(--color-gh-muted);
}

.dialog-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
}

.dialog-btn {
    padding: 0.5rem 1.25rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

.dialog-btn-cancel {
    background: transparent;
    color: var(--color-gh-text-muted);
    border-color: var(--color-gh-border);
}

.dialog-btn-cancel:hover {
    background: color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    color: var(--color-gh-text);
}

.dialog-btn-confirm {
    background: var(--color-gh-accent);
    color: white;
    border-color: var(--color-gh-accent);
}

.dialog-btn-confirm:hover {
    background: color-mix(in srgb, var(--color-gh-accent) 80%, white);
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.4);
}
</style>
