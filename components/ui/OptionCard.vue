<template>
  <div
    class="option-card"
    :class="{
      'option-card--selected': selected,
      'option-card--disabled': disabled
    }"
    @click="(e) => !disabled && $emit('click', e)"
  >
    <div v-if="$slots.badge" class="option-card__badge">
      <slot name="badge"></slot>
    </div>
    
    <div class="option-card__content">
      <slot></slot>
    </div>
    
    <div v-if="$slots.action" class="option-card__action">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selected: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.option-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  background: var(--color-gh-card);
  border: 3px solid var(--color-gh-border);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.option-card:hover:not(.option-card--disabled) {
  background: var(--color-gh-card-hover);
  border-color: var(--color-gh-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(47, 129, 247, 0.3);
}

.option-card--selected {
  background: linear-gradient(135deg, var(--color-gh-card-selected) 0%, var(--color-gh-card-selected-end) 100%);
  border-color: var(--color-gh-accent-hover);
  box-shadow: 0 0 20px rgba(47, 129, 247, 0.4);
  animation: pulse-border 2s ease-in-out infinite;
}

.option-card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-card__badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: var(--color-gh-accent);
  color: white;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(47, 129, 247, 0.3);
}

.option-card--selected .option-card__badge {
  box-shadow: 0 0 12px rgba(47, 129, 247, 0.6);
}

.option-card__content {
  flex: 1;
  color: var(--color-gh-text);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  min-width: 0;
  overflow-wrap: break-word;
  word-break: break-word;
}

.option-card__action {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@keyframes pulse-border {
  0%, 100% {
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(47, 129, 247, 0.6);
  }
}

@media (max-width: 640px) {
  .option-card {
    padding: 0.875rem 1rem;
    gap: 0.75rem;
  }

  .option-card__badge {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.8125rem;
  }

  .option-card__content {
    font-size: 0.95rem;
  }
}
</style>
