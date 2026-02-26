<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-gh-bg-secondary p-6 rounded-lg border border-gh-border max-w-md w-full">
        <h3 class="text-xl font-bold text-gh-text mb-2">{{ title }}</h3>
        <p class="text-gh-text-secondary mb-6">{{ message }}</p>
        
        <div class="flex space-x-3">
          <button
            @click="handleConfirm"
            :disabled="loading"
            class="flex-1 bg-gh-danger hover:bg-red-600 text-white py-2 rounded-md font-medium disabled:opacity-50"
          >
            {{ loading ? confirmLoadingText : confirmText }}
          </button>
          <button
            @click="handleCancel"
            :disabled="loading"
            class="flex-1 bg-gh-bg hover:bg-gh-border text-gh-text py-2 rounded-md font-medium border border-gh-border disabled:opacity-50"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  confirmLoadingText: {
    type: String,
    default: 'Processing...'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:isOpen'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('update:isOpen', false)
}
</script>
