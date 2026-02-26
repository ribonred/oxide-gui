<template>
    <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-gh-text">Edit Question</h1>
            <Button variant="secondary" @click="router.push('/questions')">
                Back to Questions
            </Button>
        </div>

        <Alert v-if="error" variant="error" class="mb-6">
            {{ error }}
        </Alert>

        <Card>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Question Title -->
                <Input v-model="form.question_title" label="Question Title" placeholder="Enter question title"
                    required />

                <!-- Question Text (Rich Text Editor) -->
                <div>
                    <label class="block text-gh-text text-sm font-medium mb-2">
                        Question Text <span class="text-red-400">*</span>
                    </label>
                    <TiptapEditor v-model="form.question_text"
                        placeholder="Enter the detailed question text (supports rich formatting)" />
                </div>

                <!-- Question Type (Disabled) -->
                <Select v-model="form.question_type" label="Question Type" placeholder="Select type" required disabled>
                    <option v-for="type in questionTypes" :key="type.value" :value="type.value">
                        {{ type.label }}
                    </option>
                </Select>

                <!-- Category -->
                <CategoryInput v-model="form.category" />

                <!-- Tags -->
                <TagsInput v-model="form.tags" label="Tags" placeholder="Add tags..." />

                <!-- Metadata -->
                <KeyValueInput v-model="form.metadata" label="Metadata" />

                <!-- Difficulty Level -->
                <Select v-model="form.difficulty_level" label="Difficulty Level" placeholder="Select difficulty"
                    required>
                    <option v-for="level in difficultyLevels" :key="level.value" :value="level.value">
                        {{ level.label }}
                    </option>
                </Select>

                <!-- Points -->
                <Input v-model="form.points" type="number" label="Points" placeholder="Enter points" :min="1"
                    required />

                <!-- Explanation -->
                <Textarea v-model="form.explanation" label="Explanation"
                    placeholder="Provide an explanation for the correct answer" optional />

                <!-- Dynamic Fields Based on Question Type -->

                <!-- Multiple Choice -->
                <MultipleChoiceForm v-if="form.question_type === QuestionType.MULTIPLE_CHOICE"
                    v-model:options="form.options" v-model:correct-answer="form.correct_answer" />

                <!-- True/False -->
                <div v-if="form.question_type === QuestionType.TRUE_FALSE">
                    <label class="block text-gh-text text-sm font-medium mb-2">
                        Correct Answer <span class="text-red-400">*</span>
                    </label>
                    <select v-model="form.correct_answer" required
                        class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent">
                        <option value="">Select answer</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>

                <!-- Short Answer -->
                <div v-if="form.question_type === QuestionType.SHORT_ANSWER">
                    <label class="block text-gh-text text-sm font-medium mb-2">
                        Correct Answer <span class="text-red-400">*</span>
                    </label>
                    <input v-model="form.correct_answer" type="text" required
                        class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                        placeholder="Enter the correct answer" />
                </div>

                <!-- Essay -->
                <div v-if="form.question_type === QuestionType.ESSAY">
                    <label class="block text-gh-text text-sm font-medium mb-2">
                        Sample Answer / Rubric <span class="text-gh-muted text-xs">(Optional)</span>
                    </label>
                    <textarea v-model="form.correct_answer" rows="4"
                        class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                        placeholder="Enter sample answer or grading rubric"></textarea>
                </div>

                <!-- Multiple Select -->
                <MultipleSelectForm v-if="form.question_type === QuestionType.MULTIPLE_SELECT"
                    v-model:options="form.options" v-model:selected-answers="multipleSelectAnswers" />

                <!-- Fill in the Blank -->
                <FillBlankForm v-if="form.question_type === QuestionType.FILL_BLANK" v-model:blanks="fillBlankAnswers"
                    v-model:with-options="fillBlankWithOptions" v-model:word-options="fillBlankOptions" />

                <!-- Ordering -->
                <OrderingForm v-if="form.question_type === QuestionType.ORDERING" v-model:options="form.options" />

                <!-- Matching Pairs -->
                <MatchingPairsForm v-if="form.question_type === QuestionType.MATCHING_PAIRS"
                    v-model:options="matchingPairsOptions" v-model:pairs="matchingPairs" />

                <!-- Matching Matrix -->
                <MatchingMatrixForm v-if="form.question_type === QuestionType.MATCHING_MATRIX"
                    v-model:left-items="matrixLeftItems" v-model:right-items="matrixRightItems"
                    v-model:cells="matrixCells" />

                <!-- Submit Button -->
                <div class="flex gap-4 pt-4">
                    <Button type="submit" :disabled="loading" full-width>
                        {{ loading ? 'Updating...' : 'Update Question' }}
                    </Button>
                    <Button variant="secondary" @click="router.push('/questions')">
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'
import Textarea from '~/components/ui/Textarea.vue'
import Select from '~/components/ui/Select.vue'
import Card from '~/components/ui/Card.vue'
import Alert from '~/components/ui/Alert.vue'
import CategoryInput from '~/components/ui/CategoryInput.vue'
import TagsInput from '~/components/ui/TagsInput.vue'
import KeyValueInput from '~/components/ui/KeyValueInput.vue'
import TiptapEditor from '~/components/editor/TiptapEditor.vue'
import MultipleChoiceForm from '~/components/questions/MultipleChoiceForm.vue'
import MultipleSelectForm from '~/components/questions/MultipleSelectForm.vue'
import FillBlankForm from '~/components/questions/FillBlankForm.vue'
import OrderingForm from '~/components/questions/OrderingForm.vue'
import MatchingPairsForm from '~/components/questions/MatchingPairsForm.vue'
import MatchingMatrixForm from '~/components/questions/MatchingMatrixForm.vue'

definePageMeta({
    middleware: 'auth'
})

const router = useRouter()
const route = useRoute()
const { getQuestionById, updateQuestion } = useQuestions()
const { questionInfo, refreshQuestionInfo } = useQuestionInfo()
const { QuestionType, questionTypes, difficultyLevels } = useQuestionEnums()

const questionId = route.params.id

const loading = ref(false)
const error = ref(null)

const form = ref({
    question_title: '',
    question_text: '',
    question_type: '',
    category: '',
    tags: [],
    metadata: {},
    difficulty_level: '',
    points: 1,
    options: [],
    correct_answer: '',
    explanation: ''
})

// For multiple select type
const multipleSelectAnswers = ref([])

// For matching pairs type
const matchingPairsOptions = ref([
    { label: 'A', value: '' },
    { label: 'B', value: '' },
    { label: 'C', value: '' },
    { label: 'D', value: '' }
])
const matchingPairs = ref([
    { left: 'A', right: 'B' }
])

// For matching matrix type
const matrixLeftItems = ref([
    { label: 'A', value: '' },
    { label: 'B', value: '' },
    { label: 'C', value: '' }
])
const matrixRightItems = ref([
    { label: '1', value: '' },
    { label: '2', value: '' }
])
const matrixCells = ref(new Set())

// For fill in the blank type
const fillBlankAnswers = ref([
    ['']
])
const fillBlankWithOptions = ref(false)
const fillBlankOptions = ref([{ label: '', value: '' }])

// Fetch question details and populate form
const fetchQuestion = async () => {
    loading.value = true
    error.value = null

    try {
        const result = await getQuestionById(questionId)

        if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to fetch question')
        }

        const question = result.data.data

        // Populate basic form fields
        form.value = {
            question_title: question.question_title,
            question_text: question.question_text,
            question_type: question.question_type,
            category: question.category,
            tags: question.tags || [],
            metadata: question.metadata || {},
            difficulty_level: question.difficulty_level || '',
            points: question.points || 1,
            options: question.options || [],
            correct_answer: question.correct_answer,
            explanation: question.explanation || ''
        }

        // Populate type-specific fields
        if (question.question_type === QuestionType.MULTIPLE_SELECT) {
            multipleSelectAnswers.value = question.correct_answer.split(',')
        } else if (question.question_type === QuestionType.MATCHING_PAIRS) {
            // Options are the separate items
            matchingPairsOptions.value = question.options && question.options.length > 0 ?
                question.options :
                [{ label: 'A', value: '' }, { label: 'B', value: '' }]

            // Parse correct_answer as label pairs (A:B,C:D)
            const pairs = question.correct_answer.split(',').map(pair => {
                const [left, right] = pair.split(':')
                return { left: left.trim(), right: right.trim() }
            })
            matchingPairs.value = pairs.length > 0 ? pairs : [{ left: 'A', right: 'B' }]
        } else if (question.question_type === QuestionType.MATCHING_MATRIX) {
            const opts = question.options || []
            matrixLeftItems.value = opts.filter(o => o.position === 'left').map(o => ({ label: o.label, value: o.value }))
            matrixRightItems.value = opts.filter(o => o.position === 'right').map(o => ({ label: o.label, value: o.value }))
            if (matrixLeftItems.value.length === 0) matrixLeftItems.value = [{ label: 'A', value: '' }, { label: 'B', value: '' }]
            if (matrixRightItems.value.length === 0) matrixRightItems.value = [{ label: '1', value: '' }, { label: '2', value: '' }]
            matrixCells.value = new Set(
                question.correct_answer.split(',').filter(Boolean)
            )
        } else if (question.question_type === QuestionType.FILL_BLANK) {
            // Parse fill blank format: "answer1|alt1<>answer2|alt2|alt3"
            const blanks = question.correct_answer.split('<>').map(blank => {
                return blank.split('|')
            })
            fillBlankAnswers.value = blanks.length > 0 ? blanks : [
                ['']
            ]

            // Check if there are word options
            if (question.options && question.options.length > 0) {
                fillBlankWithOptions.value = true
                fillBlankOptions.value = question.options
            }
        }

    } catch (err) {
        error.value = err.message || 'Failed to load question'
    } finally {
        loading.value = false
    }
}

// Form submission
const handleSubmit = async () => {
    loading.value = true
    error.value = null

    try {
        // Prepare payload
        const payload = {
            question_title: form.value.question_title,
            question_text: form.value.question_text,
            category: form.value.category,
            tags: form.value.tags.length > 0 ? form.value.tags : undefined,
            metadata: Object.keys(form.value.metadata).length > 0 ? form.value.metadata : undefined,
            difficulty_level: form.value.difficulty_level,
            points: form.value.points,
            explanation: form.value.explanation || null
        }

        // Add type-specific fields
        if (form.value.question_type === QuestionType.MULTIPLE_CHOICE) {
            payload.options = form.value.options
                .filter(o => o.label && o.label.trim())
                .map(opt => ({ label: opt.label, value: opt.value }))
            payload.correct_answer = form.value.correct_answer
        } else if (form.value.question_type === QuestionType.TRUE_FALSE) {
            payload.correct_answer = form.value.correct_answer
            payload.options = []
        } else if (form.value.question_type === QuestionType.SHORT_ANSWER) {
            payload.correct_answer = form.value.correct_answer
            payload.options = []
        } else if (form.value.question_type === QuestionType.ESSAY) {
            payload.correct_answer = form.value.correct_answer || ''
            payload.options = []
        } else if (form.value.question_type === QuestionType.MULTIPLE_SELECT) {
            payload.options = form.value.options
                .filter(o => o.label && o.label.trim())
                .map(opt => ({ label: opt.label, value: opt.value }))
            payload.correct_answer = multipleSelectAnswers.value.join(',')
        } else if (form.value.question_type === QuestionType.FILL_BLANK) {
            const formattedBlanks = fillBlankAnswers.value
                .filter(blank => blank.some(ans => ans.trim()))
                .map(blank => {
                    const validAlternatives = blank.filter(ans => ans.trim())
                    return validAlternatives.join('|')
                })
                .filter(blank => blank)

            payload.correct_answer = formattedBlanks.join('<>')

            if (fillBlankWithOptions.value) {
                const validOptions = fillBlankOptions.value.filter(opt => opt.label.trim())
                payload.options = validOptions.map(opt => ({
                    label: opt.label,
                    value: opt.label
                }))
            } else {
                payload.options = []
            }
        } else if (form.value.question_type === QuestionType.ORDERING) {
            const validOptions = form.value.options.filter(o => o.label && o.label.trim())
            payload.options = validOptions.map(opt => ({ label: opt.label, value: opt.value }))
            // Use labels only for correct_answer, not values
            payload.correct_answer = validOptions.map(o => o.label).join(',')
        } else if (form.value.question_type === QuestionType.MATCHING_PAIRS) {
            // Options are separate items with labels and values
            const validOptions = matchingPairsOptions.value.filter(o => o.label.trim() && o.value.trim())
            payload.options = validOptions.map(opt => ({ label: opt.label, value: opt.value }))

            // Correct answer is label pairs (e.g., "A:B,C:D")
            const validPairs = matchingPairs.value.filter(p => p.left.trim() && p.right.trim())
            payload.correct_answer = validPairs.map(p => `${p.left}:${p.right}`).join(',')
        } else if (form.value.question_type === QuestionType.MATCHING_MATRIX) {
            const leftValid = matrixLeftItems.value.filter(o => o.label.trim() && o.value.trim())
            const rightValid = matrixRightItems.value.filter(o => o.label.trim() && o.value.trim())
            payload.options = [
                ...leftValid.map(o => ({ label: o.label, value: o.value, position: 'left' })),
                ...rightValid.map(o => ({ label: o.label, value: o.value, position: 'right' }))
            ]
            payload.correct_answer = [...matrixCells.value].join(',')
        }

        const result = await updateQuestion(questionId, payload)

        if (result.success) {
            // Refresh question statistics to reflect the update
            await refreshQuestionInfo()
            // Success - redirect to question detail
            router.push(`/questions/${questionId}`)
        } else {
            error.value = result.error
        }
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}

// Fetch on mount
onMounted(() => {
    fetchQuestion()
})
</script>

<style scoped>
input[type="checkbox"] {
    accent-color: var(--gh-accent);
}
</style>
