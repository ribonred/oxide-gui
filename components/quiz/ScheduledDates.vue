<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateTimePicker
            v-model="localAvailableFrom"
            label="Available From"
            placeholder="Select start date and time"
            :required="required"
            :min="minDate"
            hint="When the quiz becomes available"
            @update:model-value="handleFromChange"
        />
        <DateTimePicker
            v-model="localAvailableUntil"
            label="Available Until"
            placeholder="Select end date and time"
            :required="required"
            :min="minDateForUntil"
            hint="When the quiz closes"
            @update:model-value="handleUntilChange"
        />
    </div>
</template>

<script setup>
import DateTimePicker from '~/components/ui/DateTimePicker.vue'

const props = defineProps({
    availableFrom: {
        type: String,
        default: ''
    },
    availableUntil: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:availableFrom', 'update:availableUntil'])

const localAvailableFrom = ref(props.availableFrom)
const localAvailableUntil = ref(props.availableUntil)

// Set minimum date to current date/time
const minDate = computed(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
})

// Minimum date for "until" should be at least 1 minute after "from"
const minDateForUntil = computed(() => {
    if (!localAvailableFrom.value) return minDate.value
    
    try {
        // Parse the "from" date and add 1 minute
        const fromDate = new Date(localAvailableFrom.value.replace(' ', 'T'))
        fromDate.setMinutes(fromDate.getMinutes() + 1)
        
        const year = fromDate.getFullYear()
        const month = String(fromDate.getMonth() + 1).padStart(2, '0')
        const day = String(fromDate.getDate()).padStart(2, '0')
        const hours = String(fromDate.getHours()).padStart(2, '0')
        const minutes = String(fromDate.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}`
    } catch (e) {
        return minDate.value
    }
})

const handleFromChange = (value) => {
    localAvailableFrom.value = value
    emit('update:availableFrom', value)
    
    // If 'from' is after or equal to 'until', clear 'until'
    if (localAvailableUntil.value && value >= localAvailableUntil.value) {
        localAvailableUntil.value = ''
        emit('update:availableUntil', '')
    }
}

const handleUntilChange = (value) => {
    localAvailableUntil.value = value
    emit('update:availableUntil', value)
}

// Watch for prop changes
watch(() => props.availableFrom, (newVal) => {
    localAvailableFrom.value = newVal
})

watch(() => props.availableUntil, (newVal) => {
    localAvailableUntil.value = newVal
})
</script>
