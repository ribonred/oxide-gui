export const QuestionType = {
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    SHORT_ANSWER: 'short_answer',
    ESSAY: 'essay',
    MULTIPLE_SELECT: 'multiple_select',
    FILL_BLANK: 'fill_blank',
    ORDERING: 'ordering',
    MATCHING_PAIRS: 'matching_pairs',
    MATCHING_MATRIX: 'matching_matrix'
}

export const QuestionLevel = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
}

export const useQuestionEnums = () => {
    const questionTypes = [
        { value: QuestionType.MULTIPLE_CHOICE, label: 'Multiple Choice' },
        { value: QuestionType.TRUE_FALSE, label: 'True/False' },
        { value: QuestionType.SHORT_ANSWER, label: 'Short Answer' },
        { value: QuestionType.ESSAY, label: 'Essay' },
        { value: QuestionType.MULTIPLE_SELECT, label: 'Multiple Select' },
        { value: QuestionType.FILL_BLANK, label: 'Fill in the Blank' },
        { value: QuestionType.ORDERING, label: 'Ordering' },
        { value: QuestionType.MATCHING_PAIRS, label: 'Matching Pairs' },
        { value: QuestionType.MATCHING_MATRIX, label: 'Matching Matrix' }
    ]

    const difficultyLevels = [
        { value: QuestionLevel.EASY, label: 'Easy', color: 'green' },
        { value: QuestionLevel.MEDIUM, label: 'Medium', color: 'yellow' },
        { value: QuestionLevel.HARD, label: 'Hard', color: 'red' }
    ]

    const getQuestionTypeLabel = (type) => {
        const found = questionTypes.find(t => t.value === type)
        return found ? found.label : type
    }

    const getDifficultyLabel = (level) => {
        const found = difficultyLevels.find(l => l.value === level)
        return found ? found.label : level
    }

    const getDifficultyColor = (level) => {
        const found = difficultyLevels.find(l => l.value === level)
        return found ? found.color : 'gray'
    }

    const getDifficultyClass = (level) => {
        const color = getDifficultyColor(level)
        const classes = {
            green: 'badge-success',
            yellow: 'badge-warning',
            red: 'badge-danger',
            gray: 'badge-neutral'
        }
        return classes[color] || classes.gray
    }

    return {
        QuestionType,
        QuestionLevel,
        questionTypes,
        difficultyLevels,
        getQuestionTypeLabel,
        getDifficultyLabel,
        getDifficultyColor,
        getDifficultyClass
    }
}
