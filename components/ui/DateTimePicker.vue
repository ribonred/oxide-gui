<template>
    <div>
        <label v-if="label" class="block text-gh-text text-sm font-medium mb-2">
            {{ label }}
            <span v-if="required" class="text-red-400">*</span>
        </label>
        <ClientOnly>
            <date-picker
                v-model:value="localValue"
                type="datetime"
                format="YYYY-MM-DD HH:mm"
                value-type="format"
                :placeholder="placeholder"
                :disabled="disabled"
                :disabled-date="disabledDate"
                :show-second="false"
                :minute-step="1"
                :clearable="!required"
                :input-class="inputClass"
                :popup-class="popupClass"
                @change="handleChange"
            >
                <template #icon-calendar>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </template>
            </date-picker>
            <template #fallback>
                <input 
                    :value="modelValue" 
                    @input="handleFallbackInput"
                    type="datetime-local" 
                    :required="required"
                    :disabled="disabled"
                    class="w-full px-4 py-2 pr-10 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    :placeholder="placeholder"
                />
            </template>
        </ClientOnly>
        <p v-if="hint" class="text-gh-text-muted text-sm mt-1">
            {{ hint }}
        </p>
        <p v-if="displayValue" class="text-gh-text text-sm mt-1 font-medium">
            {{ displayValue }}
        </p>
    </div>
</template>

<script setup>
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Select date and time'
    },
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    min: {
        type: String,
        default: ''
    },
    max: {
        type: String,
        default: ''
    },
    hint: {
        type: String,
        default: ''
    },
    showDisplay: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

// Custom classes for the date picker to match our theme
const inputClass = 'w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent disabled:opacity-50 disabled:cursor-not-allowed'
const popupClass = 'bg-gh-bg-secondary border border-gh-border shadow-lg'

const disabledDate = (date) => {
    if (!props.min && !props.max) return false
    
    // Get date without time
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    if (props.min) {
        const minDate = new Date(props.min.replace(' ', 'T'))
        minDate.setHours(0, 0, 0, 0)
        if (checkDate < minDate) return true
    }
    
    if (props.max) {
        const maxDate = new Date(props.max.replace(' ', 'T'))
        maxDate.setHours(0, 0, 0, 0)
        if (checkDate > maxDate) return true
    }
    
    return false
}

const displayValue = computed(() => {
    if (!props.showDisplay || !props.modelValue) return ''
    
    try {
        const date = new Date(props.modelValue)
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    } catch (e) {
        return ''
    }
})

const handleChange = (value) => {
    emit('update:modelValue', value)
}

const handleFallbackInput = (event) => {
    emit('update:modelValue', event.target.value)
}

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
    localValue.value = newVal
})
</script>

<style scoped>
:deep(.mx-datepicker) {
    width: 100%;
}

:deep(.mx-input) {
    background-color: var(--color-gh-bg);
    border-color: var(--color-gh-border);
    color: var(--color-gh-text);
}

:deep(.mx-input:hover) {
    border-color: var(--color-gh-accent);
}

:deep(.mx-input:focus) {
    border-color: var(--color-gh-accent);
    box-shadow: 0 0 0 2px rgba(var(--color-gh-accent-rgb), 0.2);
}

:deep(.mx-icon-calendar),
:deep(.mx-icon-clear) {
    color: var(--color-gh-text-muted);
}

:deep(.mx-datepicker-popup) {
    background-color: var(--color-gh-bg-secondary);
    border-color: var(--color-gh-border);
}

:deep(.mx-calendar-header),
:deep(.mx-time-header) {
    background-color: var(--color-gh-bg);
    border-color: var(--color-gh-border);
}

:deep(.mx-btn-text) {
    color: var(--color-gh-text);
}

:deep(.mx-btn-text:hover) {
    color: var(--color-gh-accent);
}

:deep(.mx-calendar-content .cell) {
    color: var(--color-gh-text);
}

:deep(.mx-calendar-content .cell:hover) {
    background-color: var(--color-gh-accent);
    color: white;
}

:deep(.mx-calendar-content .cell.active) {
    background-color: var(--color-gh-accent);
    color: white;
}

:deep(.mx-calendar-content .cell.disabled) {
    color: var(--color-gh-text-muted);
    opacity: 0.5;
}

:deep(.mx-time-content) {
    background-color: var(--color-gh-bg);
}

:deep(.mx-time-column) {
    border-color: var(--color-gh-border);
}

:deep(.mx-time-item) {
    color: var(--color-gh-text);
}

:deep(.mx-time-item:hover) {
    background-color: var(--color-gh-accent);
    color: white;
}

:deep(.mx-time-item.active) {
    background-color: var(--color-gh-accent);
    color: white;
    font-weight: 600;
}
</style>
