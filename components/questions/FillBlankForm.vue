<template>
    <div class="space-y-4">
        <div>
            <label class="block text-gh-text text-sm font-medium mb-2">
                Blanks & Acceptable Answers <span class="text-red-400">*</span>
            </label>
            <div v-for="(blank, index) in blanks" :key="index" class="mb-3">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-gh-text text-sm font-medium">Blank {{ index + 1 }}:</span>
                    <Button 
                        v-if="blanks.length > 1" 
                        variant="danger"
                        size="sm"
                        @click="removeBlank(index)" 
                    >
                        Remove Blank
                    </Button>
                </div>
                <div class="space-y-2">
                    <div v-for="(answer, ansIndex) in blank" :key="ansIndex" class="flex gap-2">
                        <input 
                            :value="answer"
                            @input="updateAnswer(index, ansIndex, $event.target.value)"
                            type="text" 
                            required 
                            class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                            :placeholder="ansIndex === 0 ? 'Primary answer' : `Alternative answer ${ansIndex}`"
                        />
                        <Button 
                            v-if="ansIndex > 0" 
                            variant="danger"
                            size="sm"
                            @click="removeAlternative(index, ansIndex)" 
                        >
                            Remove
                        </Button>
                    </div>
                    <Button 
                        variant="secondary"
                        size="sm"
                        @click="addAlternative(index)" 
                    >
                        + Add Alternative Answer
                    </Button>
                </div>
            </div>
            <Button 
                variant="secondary"
                @click="addBlank" 
            >
                + Add Another Blank
            </Button>
        </div>

        <!-- Optional: Provide clickable word choices -->
        <div>
            <div class="flex items-center justify-between mb-2">
                <label class="block text-gh-text text-sm font-medium">
                    Word Choices (Optional - max 10)
                </label>
                <label class="flex items-center gap-2 text-sm text-gh-muted cursor-pointer">
                    <input 
                        type="checkbox" 
                        :checked="withOptions"
                        @change="$emit('update:withOptions', $event.target.checked)"
                        class="w-4 h-4 bg-gh-bg border-gh-border rounded focus:ring-2 focus:ring-gh-accent" 
                    />
                    <span>Enable word choices</span>
                </label>
            </div>

            <div v-if="withOptions" class="space-y-3">
                <p class="text-xs text-gh-muted">Students can click these words to fill in the blanks (first click fills blank 1, second fills blank 2, etc.)</p>
                <div v-for="(option, index) in wordOptions" :key="index" class="flex gap-2">
                    <span class="flex items-center justify-center w-8 h-10 text-gh-muted text-sm">{{ index + 1 }}.</span>
                    <input 
                        :value="option.label"
                        @input="updateWordOption(index, $event.target.value)"
                        type="text" 
                        required 
                        class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" 
                        :placeholder="`Word choice ${index + 1}`" 
                    />
                    <Button 
                        v-if="wordOptions.length > 1" 
                        variant="danger"
                        size="sm"
                        @click="removeWordOption(index)" 
                    >
                        Remove
                    </Button>
                </div>
                <Button 
                    v-if="wordOptions.length < 10" 
                    variant="secondary"
                    @click="addWordOption" 
                >
                    + Add Word Choice ({{ wordOptions.length }}/10)
                </Button>
                <p v-else class="text-xs text-gh-muted">Maximum of 10 word choices reached</p>
            </div>
        </div>

        <div class="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-md p-3">
            <p class="text-sm text-blue-400 mb-2">
                <strong>Format Guide:</strong>
            </p>
            <ul class="text-xs text-blue-400 space-y-1 ml-4 list-disc">
                <li>Use _____ (underscores) in the question text for blank positions</li>
                <li>Single blank: "apple" or with alternatives: "apple" | "fruit"</li>
                <li>Multiple blanks are separated automatically (each blank can contain commas)</li>
                <li>Examples: "Paris, France" or "Hello, world" work as single blanks</li>
                <li>Each blank can have multiple acceptable answers (alternatives using |)</li>
                <li><strong>Word choices:</strong> Optional clickable words for students (max 10). Can include correct answers or distractors.</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'

const props = defineProps({
    blanks: {
        type: Array,
        required: true
    },
    withOptions: {
        type: Boolean,
        default: false
    },
    wordOptions: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:blanks', 'update:withOptions', 'update:wordOptions'])

// Blank management
const addBlank = () => {
    emit('update:blanks', [...props.blanks, ['']])
}

const removeBlank = (index) => {
    const newBlanks = [...props.blanks]
    newBlanks.splice(index, 1)
    emit('update:blanks', newBlanks)
}

const addAlternative = (blankIndex) => {
    const newBlanks = [...props.blanks]
    newBlanks[blankIndex] = [...newBlanks[blankIndex], '']
    emit('update:blanks', newBlanks)
}

const removeAlternative = (blankIndex, answerIndex) => {
    const newBlanks = [...props.blanks]
    newBlanks[blankIndex] = [...newBlanks[blankIndex]]
    newBlanks[blankIndex].splice(answerIndex, 1)
    emit('update:blanks', newBlanks)
}

const updateAnswer = (blankIndex, answerIndex, value) => {
    const newBlanks = [...props.blanks]
    newBlanks[blankIndex] = [...newBlanks[blankIndex]]
    newBlanks[blankIndex][answerIndex] = value
    emit('update:blanks', newBlanks)
}

// Word options management
const addWordOption = () => {
    if (props.wordOptions.length < 10) {
        emit('update:wordOptions', [...props.wordOptions, { label: '', value: '' }])
    }
}

const removeWordOption = (index) => {
    const newOptions = [...props.wordOptions]
    newOptions.splice(index, 1)
    emit('update:wordOptions', newOptions)
}

const updateWordOption = (index, value) => {
    const newOptions = [...props.wordOptions]
    newOptions[index] = { label: value, value: value }
    emit('update:wordOptions', newOptions)
}
</script>

<style scoped>
input[type="checkbox"] {
    accent-color: var(--color-gh-accent);
}
</style>
