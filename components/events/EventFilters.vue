<template>
    <div class="flex flex-col md:flex-row gap-3">
        <SearchInput
            :model-value="name"
            @update:modelValue="$emit('update:name', $event)"
            placeholder="Search events..."
            class="flex-1"
        />
        <FilterSelect
            :model-value="status"
            @update:modelValue="$emit('update:status', $event)"
            :options="eventStatuses"
            placeholder="Status"
        />
    </div>
</template>

<script setup>
import SearchInput from '~/components/ui/SearchInput.vue'
import FilterSelect from '~/components/ui/FilterSelect.vue'

defineProps({
    name: { type: String, default: '' },
    status: { type: String, default: 'all' },
})

defineEmits(['update:name', 'update:status'])

const { eventStatuses } = useEventEnums()
</script>
