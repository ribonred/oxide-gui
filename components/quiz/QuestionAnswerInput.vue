<template>
    <div class="space-y-4">
        <!-- Multiple Choice -->
        <MultipleChoice
            v-if="isQuestionType('multiple_choice')"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
            :options="parsedOptions"
        />

        <!-- Multiple Select -->
        <MultipleSelect
            v-else-if="isQuestionType('multiple_select')"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
            :options="parsedOptions"
        />

        <!-- Fill in the Blank -->
        <FillBlankAuto
            v-else-if="isQuestionType('fill_blank')"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
            :question-content="question.question_text || ''"
        />

        <!-- True/False -->
        <TrueFalse
            v-else-if="isQuestionType('true_false')"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
        />

        <!-- Ordering -->
        <Ordering 
            v-else-if="isQuestionType('ordering')"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
            :options="parsedOptions"
        />

        <!-- Matching Pairs -->
        <MatchingPairs
            v-else-if="isQuestionType('matching_pairs')"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
            :options="parsedOptions"
        />

        <!-- Matching Matrix -->
        <MatchingMatrix
            v-else-if="isQuestionType('matching_matrix')"
            :model-value="modelValue"
            @update:model-value="emit('update:modelValue', $event)"
            :options="parsedOptions"
        />

        <!-- Matching Pairs OLD -->
        <div v-else-if="false" class="space-y-2">
            <p class="text-sm text-gh-muted mb-2">Match items from left column with right column</p>
            <div 
                v-for="(pair, index) in matchingPairs"
                :key="index"
                class="grid grid-cols-2 gap-4 p-3 border border-gh-border rounded-md"
            >
                <div class="text-gh-text font-medium">
                    {{ pair.left }}
                </div>
                <Select
                    :model-value="pair.selectedRight"
                    @update:model-value="updateMatch(index, $event)"
                    :options="rightOptions"
                    placeholder="Select match"
                />
            </div>
        </div>

        <!-- Short Answer / Essay -->
        <div v-else-if="isQuestionType('short_answer') || isQuestionType('essay')">
            <Textarea
                :model-value="modelValue"
                @update:model-value="emit('update:modelValue', $event)"
                :placeholder="isQuestionType('essay') ? 'Enter your detailed answer...' : 'Enter your answer...'"
                :rows="isQuestionType('essay') ? 6 : 3"
            />
        </div>

        <!-- Unknown Type -->
        <div v-else>
            <Alert type="warning" message="This question type is not supported yet" />
        </div>
    </div>
</template>

<script setup>
import { toRaw } from 'vue'
import Textarea from '~/components/ui/Textarea.vue'
import Select from '~/components/ui/Select.vue'
import Alert from '~/components/ui/Alert.vue'
import MultipleChoice from '~/components/quiz/answer-types/MultipleChoice.vue'
import MultipleSelect from '~/components/quiz/answer-types/MultipleSelect.vue'
import TrueFalse from '~/components/quiz/answer-types/TrueFalse.vue'
// import FillBlank from '~/components/quiz/answer-types/FillBlank.vue'
import FillBlankAuto from '~/components/quiz/answer-types/FillBlankAuto.vue'
import Ordering from '~/components/quiz/answer-types/Ordering.vue'
import MatchingPairs from '~/components/quiz/answer-types/MatchingPairs.vue'
import MatchingMatrix from '~/components/quiz/answer-types/MatchingMatrix.vue'

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

// Helper to check question type (supports both snake_case and PascalCase)
const isQuestionType = (type) => {
    const questionType = props.question.question_type?.toLowerCase()
    const checkType = type.toLowerCase()
    return questionType === checkType || questionType === checkType.replace(/_/g, '')
}

// Parse options - support both options array and question_content string
const parsedOptions = computed(() => {
    // First check if options exists (from API)
    if (props.question.options) {
        // Convert Proxy/reactive object to plain value using toRaw
        const rawOptions = toRaw(props.question.options)
        
        // If it's already an array, use it directly
        if (Array.isArray(rawOptions)) {
            return rawOptions.map(opt => ({
                label: opt.label || opt.value,
                value: opt.value || opt.label,
                ...opt
            }))
        }
        
        // If it's an object, try to extract array
        if (typeof rawOptions === 'object' && rawOptions !== null) {
            const optionsArray = Object.values(rawOptions)
            if (optionsArray.length > 0) {
                return optionsArray.map(opt => ({
                    label: opt.label || opt.value,
                    value: opt.value || opt.label
                }))
            }
        }
    }
    
    // Fallback to question_content parsing
    if (!props.question.question_content) {
        return []
    }
    
    try {
        const parts = props.question.question_content.split('|')
        return parts.map((part, index) => ({
            label: part.trim(),
            value: String.fromCharCode(65 + index) // A, B, C, etc.
        }))
    } catch (e) {
        return []
    }
})

// Matching Pairs
const matchingPairs = ref([])
const rightOptions = ref([])

const initializeMatching = () => {
    if (!props.question.question_content) return
    
    try {
        // Format: "left1:right1|left2:right2|left3:right3"
        const pairs = props.question.question_content.split('|')
        const leftItems = []
        const rightItems = []
        
        pairs.forEach(pair => {
            const [left, right] = pair.split(':').map(s => s.trim())
            leftItems.push(left)
            rightItems.push(right)
        })
        
        rightOptions.value = rightItems.map((item, index) => ({
            label: item,
            value: String(index)
        }))
        
        if (props.modelValue) {
            const matches = props.modelValue.split('|')
            matchingPairs.value = leftItems.map((left, index) => ({
                left,
                selectedRight: matches[index] || ''
            }))
        } else {
            matchingPairs.value = leftItems.map(left => ({
                left,
                selectedRight: ''
            }))
        }
    } catch (e) {
        matchingPairs.value = []
    }
}

const updateMatch = (index, value) => {
    matchingPairs.value[index].selectedRight = value
    const matchString = matchingPairs.value.map(p => p.selectedRight).join('|')
    emit('update:modelValue', matchString)
}

// Watch for question changes and initialize accordingly
watch(() => props.question, () => {
    if (isQuestionType('matching_pairs')) {
        initializeMatching()
    }
}, { immediate: true })
</script>
