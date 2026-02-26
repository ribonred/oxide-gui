<template>
  <div class="space-y-3">
    <div v-if="label" class="block text-gh-text text-sm font-medium">
      {{ label }}
    </div>

    <!-- Empty State -->
    <div v-if="rows.length === 0" class="text-sm text-gh-muted italic border border-dashed border-gh-border rounded-md p-4 text-center">
      No properties defined.
    </div>

    <!-- Rows -->
    <div v-else class="space-y-2">
      <div 
        v-for="(row, index) in rows" 
        :key="index" 
        class="flex gap-2 items-start"
      >
        <div class="flex-1">
          <input
            v-model="row.key"
            type="text"
            placeholder="Key"
            class="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text text-sm focus:outline-none focus:ring-1 focus:ring-gh-accent"
            @change="emitUpdate"
          />
        </div>
        <div class="flex-1">
          <input
            v-model="row.value"
            type="text"
            placeholder="Value"
            class="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text text-sm focus:outline-none focus:ring-1 focus:ring-gh-accent"
            @change="emitUpdate"
          />
        </div>
        <button 
          type="button"
          class="p-2 text-gh-muted hover:text-red-400 hover:bg-gh-bg-secondary rounded-md"
          @click="removeRow(index)"
          title="Remove property"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Add Button -->
    <button 
      type="button"
      class="flex items-center text-sm text-gh-accent hover:text-gh-text font-medium px-2 py-1 rounded-md hover:bg-gh-accent/10 transition-colors"
      @click="addRow"
    >
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Property
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object as () => Record<string, any>,
    default: () => ({})
  },
  label: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

interface KeyValueRow {
  key: string;
  value: string;
}

const rows = ref<KeyValueRow[]>([]);

// Initialize rows from modelValue
const initRows = () => {
  if (!props.modelValue) {
    rows.value = [];
    return;
  }
  rows.value = Object.entries(props.modelValue).map(([key, value]) => ({
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value)
  }));
};

// Sync internal rows when modelValue changes externally (and isn't the one we just emitted)
watch(() => props.modelValue, (newVal) => {
    // Avoid re-parsing if the object content matches our current rows (need deep check or just simple length/key check)
    // For simplicity, we can just re-init if the object reference changes significantly, 
    // but ideally we want to avoid overwriting active typing.
    // Here we'll just check if keys match to avoid strict loops, but init only on mount or specialized reset logic might be better.
    // Let's rely on initRows being called on mount and explicit Watch if needed, 
    // but usually in forms parent passes initial object.
    
    // Simple check: reconstruct object from rows and compare?
    const currentObj = rows.value.reduce((acc, row) => {
        if (row.key) acc[row.key] = row.value;
        return acc;
    }, {} as Record<string, any>);
    
    if (JSON.stringify(currentObj) !== JSON.stringify(newVal)) {
        initRows();
    }
}, { deep: true });

onMounted(() => {
  initRows();
});

const addRow = () => {
  rows.value.push({ key: '', value: '' });
};

const removeRow = (index: number) => {
  rows.value.splice(index, 1);
  emitUpdate();
};

const emitUpdate = () => {
  const result: Record<string, any> = {};
  rows.value.forEach(row => {
    if (row.key.trim()) {
      result[row.key.trim()] = row.value;
    }
  });
  emit('update:modelValue', result);
};
</script>
