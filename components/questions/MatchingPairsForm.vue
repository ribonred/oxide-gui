<template>
    <div class="space-y-6">
        <!-- Options Section -->
        <div>
            <label class="block text-gh-text text-sm font-medium mb-2">
                Options (Items to Match) <span class="text-red-400">*</span>
            </label>
            <p class="text-gh-muted text-xs mb-3">
                Define all items that can be matched. Each item needs a label (A, B, C, etc.) and a value (the text shown to users).
            </p>
            <div v-for="(option, index) in options" :key="`opt-${index}`" class="flex gap-2 mb-2">
                <input 
                    :value="option.label"
                    @input="updateOption(index, 'label', $event.target.value)"
                    type="text" 
                    required 
                    class="w-20 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                    :placeholder="`Label`" 
                />
                <input 
                    :value="option.value"
                    @input="updateOption(index, 'value', $event.target.value)"
                    type="text" 
                    required 
                    class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                    :placeholder="`Item value (e.g., France, Paris, etc.)`" 
                />
                <Button 
                    v-if="options.length > 2" 
                    variant="danger"
                    size="sm"
                    @click="removeOption(index)" 
                >
                    Remove
                </Button>
            </div>
            <Button 
                variant="secondary"
                @click="addOption" 
            >
                Add Option
            </Button>
        </div>

        <!-- Pairs Section -->
        <div>
            <label class="block text-gh-text text-sm font-medium mb-2">
                Correct Pairs (Label:Label) <span class="text-red-400">*</span>
            </label>
            <p class="text-gh-muted text-xs mb-3">
                Define which labels should be paired together (e.g., A:B means item A should match with item B).
            </p>
            <div v-for="(pair, index) in pairs" :key="`pair-${index}`" class="flex gap-2 mb-2 items-center">
                <input 
                    :value="pair.left"
                    @input="updatePair(index, 'left', $event.target.value)"
                    type="text" 
                    required 
                    class="w-32 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                    :placeholder="`Label (A)`" 
                />
                <span class="flex items-center text-gh-accent font-bold">:</span>
                <input 
                    :value="pair.right"
                    @input="updatePair(index, 'right', $event.target.value)"
                    type="text" 
                    required 
                    class="w-32 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                    :placeholder="`Label (B)`" 
                />
                <Button 
                    v-if="pairs.length > 1" 
                    variant="danger"
                    size="sm"
                    @click="removePair(index)" 
                >
                    Remove
                </Button>
            </div>
            <Button 
                variant="secondary"
                @click="addPair" 
            >
                Add More Correct Pairs
            </Button>
        </div>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'

const props = defineProps({
    options: {
        type: Array,
        required: true
    },
    pairs: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:options', 'update:pairs'])

// Options management
const addOption = () => {
    emit('update:options', [...props.options, { label: '', value: '' }])
}

const removeOption = (index) => {
    const newOptions = [...props.options]
    newOptions.splice(index, 1)
    emit('update:options', newOptions)
}

const updateOption = (index, field, value) => {
    const newOptions = [...props.options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    emit('update:options', newOptions)
}

// Pairs management
const addPair = () => {
    emit('update:pairs', [...props.pairs, { left: '', right: '' }])
}

const removePair = (index) => {
    const newPairs = [...props.pairs]
    newPairs.splice(index, 1)
    emit('update:pairs', newPairs)
}

const updatePair = (index, field, value) => {
    const newPairs = [...props.pairs]
    newPairs[index] = { ...newPairs[index], [field]: value }
    emit('update:pairs', newPairs)
}
</script>
