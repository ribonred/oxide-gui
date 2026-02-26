# Quiz Service Design System

## 🎨 Philosophy

This design system ensures **consistency across all contributors**. Instead of inline Tailwind classes everywhere, we use:
1. **Reusable components** with encapsulated styles
2. **CSS variables** for theming
3. **Scoped styles** for component-specific styling
4. **Design tokens** for spacing, colors, typography

## 🎯 Design Tokens

### Colors
```css
/* Defined in assets/css/main.css */
/* These variables change based on the theme (light/dark) */
--color-gh-bg: #0d1117 /* or #ffffff */
--color-gh-card: #161b22 /* or #ffffff */
--color-gh-border: #30363d /* or #d0d7de */
--color-gh-text: #e6edf3 /* or #24292f */
--color-gh-text-muted: #8b949e /* or #57606a */
--color-gh-muted: #6e7681 /* or #656d76 */
--color-gh-accent: #2f81f7 /* or #0969da */
```

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

### Border Radius
- **sm**: 0.375rem (6px)
- **md**: 0.5rem (8px)
- **lg**: 0.75rem (12px)
- **xl**: 1rem (16px)
- **2xl**: 1.5rem (24px)
- **full**: 9999px

### Shadows
- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1)`
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1)`
- **2xl**: `0 25px 50px -12px rgb(0 0 0 / 0.25)`

## 📦 Component Library

### QuizCard (`components/quiz/QuizCard.vue`)

**Usage:**
```vue
<QuizCard
  title="Quiz Title"
  description="Quiz description"
  :question-count="10"
  :time-limit="900"
  status="active"
  @click="handleClick"
/>
```

**Props:**
- `title` (String, required): Quiz title
- `description` (String): Quiz description
- `questionCount` (Number): Number of questions
- `timeLimit` (Number): Time limit in seconds
- `status` (String): 'active', 'draft', or 'archived'

**Styling Philosophy:**
- Uses scoped CSS with CSS variables
- No inline Tailwind (maintainable)
- Consistent hover effects (translateY, scale, opacity)
- Status badges auto-colored based on status

**Why this is better:**
❌ **Bad (Inline):**
```vue
<div class="p-6 bg-gradient-to-br from-gh-card to-gh-bg border-2 border-gh-border/50 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl hover:border-gh-accent/50 hover:-translate-y-1">
```
✅ **Good (Component):**
```vue
<QuizCard ... />
```

### Answer Type Components

These components handle different quiz question types with consistent styling.

#### MultipleChoice (`components/quiz/answer-types/MultipleChoice.vue`)

**Usage:**
```vue
<MultipleChoice
  v-model="answer"
  :options="[
    { label: 'A', value: 'Option 1' },
    { label: 'B', value: 'Option 2' }
  ]"
/>
```

**Props:**
- `modelValue` (String): Selected option label
- `options` (Array): Array of { label, value } objects

**Features:**
- Large clickable cards with hover glow
- Custom radio buttons with accent color
- Badge indicators for option labels
- Gradient background when selected

#### MultipleSelect (`components/quiz/answer-types/MultipleSelect.vue`)

**Usage:**
```vue
<MultipleSelect
  v-model="answers"
  :options="[
    { label: 'A', value: 'Option 1' },
    { label: 'B', value: 'Option 2' }
  ]"
/>
```

**Props:**
- `modelValue` (String): Comma-separated selected labels (e.g., "A,C")
- `options` (Array): Array of { label, value } objects

**Features:**
- Multiple selection with checkboxes
- Same card styling as MultipleChoice
- Automatic comma-separated value management

#### TrueFalse (`components/quiz/answer-types/TrueFalse.vue`)

**Usage:**
```vue
<TrueFalse v-model="answer" />
```

**Props:**
- `modelValue` (String): 'true' or 'false'

**Features:**
- Two large icon buttons
- Green glow for True, red glow for False
- Scale animation on hover
- Icon changes based on selection

#### FillBlank (`components/quiz/answer-types/FillBlank.vue`)

**Usage:**
```vue
<FillBlank
  v-model="answers"
  question-content="The {blank1} is {blank2}"
/>
```

**Props:**
- `modelValue` (String): Pipe-separated answers (e.g., "answer1|answer2")
- `questionContent` (String): Question text with {blank1}, {blank2} placeholders

**Features:**
- Auto-detects number of blanks
- Numbered badge for each blank
- Individual input fields
- Gradient card backgrounds

### Button (`components/ui/Button.vue`)

**Usage:**
```vue
<Button variant="primary" @click="...">Click me</Button>
<Button variant="secondary" :disabled="true">Disabled</Button>
```

**Variants:**
- `primary`: Accent-colored, main CTAs
- `secondary`: Subtle, alternative actions

### Card (`components/ui/Card.vue`)

Basic container with consistent padding, border, shadow.

### Input, Textarea, Select

Form components with consistent styling.

## 🎭 Common Patterns

### Hero Section
```vue
<div class="text-center mb-12">
  <div class="inline-block p-4 bg-gh-accent/10 rounded-2xl mb-4">
    <svg class="w-12 h-12 text-gh-accent">...</svg>
  </div>
  <h1 class="text-5xl font-bold text-gh-text mb-3">Title</h1>
  <p class="text-xl text-gh-text-muted">Subtitle</p>
</div>
```

### Stats/Info Grid
```vue
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div class="stat-card">
    <icon />
    <label>Label</label>
    <value>Value</value>
  </div>
</div>
```

### Loading State
```vue
<div class="flex flex-col items-center justify-center py-20">
  <div class="relative">
    <div class="animate-spin rounded-full h-16 w-16 border-4 border-gh-accent border-t-transparent"></div>
    <div class="absolute inset-0 rounded-full h-16 w-16 border-4 border-gh-accent/20"></div>
  </div>
  <p class="mt-4 text-gh-text-muted animate-pulse">Loading...</p>
</div>
```

### Background Decorations
```vue
<div class="relative">
  <!-- Decorative blur circles -->
  <div class="absolute top-0 right-0 w-96 h-96 bg-gh-accent opacity-5 rounded-full blur-3xl -z-10"></div>
  <div class="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 opacity-5 rounded-full blur-3xl -z-10"></div>
  
  <!-- Content -->
</div>
```

## 🚨 Rules for Contributors

### DO:
✅ Use existing components (`QuizCard`, `Button`, `Card`, etc.)
✅ Use CSS variables for colors: `var(--color-gh-accent)`
✅ Create new reusable components for repeated patterns
✅ Use scoped styles in components
✅ Follow the spacing scale (0.5rem, 1rem, 1.5rem, etc.)
✅ Use consistent hover effects: `transition-all duration-300`
✅ Use `color-mix` for transparency with CSS variables (e.g., `color-mix(in srgb, var(--color-gh-accent) 10%, transparent)`)

### DON'T:
❌ Copy-paste inline Tailwind classes
❌ Hardcode colors like `#2f81f7` - use `var(--color-gh-accent)`
❌ Create one-off styles without considering reusability
❌ Mix different hover animation styles
❌ Use random spacing values like `px-7` or `py-5`
❌ Use Tailwind opacity utilities like `bg-opacity-20` with CSS variables (they don't work together)

## 📐 Layout Utilities (OK to use inline)

These are fine for layout since they're contextual:
- Grid/Flex: `flex`, `grid`, `items-center`, `justify-between`, `gap-4`
- Spacing: `p-6`, `mt-4`, `mb-8`, `mx-auto`
- Sizing: `w-full`, `max-w-7xl`, `h-screen`
- Responsive: `md:grid-cols-2`, `lg:flex-row`

## 🔄 Migration Strategy

**Instead of this:**
```vue
<div class="p-6 bg-gh-card border-2 border-gh-border rounded-xl shadow-lg hover:shadow-xl transition-all">
  <h3 class="text-xl font-bold text-gh-text mb-2">{{ title }}</h3>
  <p class="text-gh-text-muted">{{ description }}</p>
</div>
```

**Do this:**
```vue
<!-- Option 1: Use existing component -->
<QuizCard :title="title" :description="description" />

<!-- Option 2: Create new reusable component if pattern repeats -->
<InfoCard :title="title" :description="description" />

<!-- components/ui/InfoCard.vue -->
<template>
  <div class="info-card">
    <h3 class="info-card__title">{{ title }}</h3>
    <p class="info-card__description">{{ description }}</p>
  </div>
</template>

<style scoped>
.info-card {
  padding: 1.5rem;
  background: var(--color-gh-card);
  border: 2px solid var(--color-gh-border);
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
</style>
```

## 🎨 Animation Standards

All hover effects should use:
```css
transition: all 0.3s ease;
```

Common transforms:
- **Lift**: `transform: translateY(-4px)`
- **Scale**: `transform: scale(1.05)`
- **Slide**: `transform: translateX(4px)`

## 📝 Component Checklist

When creating a new component:
- [ ] Uses CSS variables for colors
- [ ] Has scoped styles
- [ ] Accepts props for customization
- [ ] Emits events for actions
- [ ] Follows naming convention (PascalCase)
- [ ] Has consistent spacing
- [ ] Uses standard transitions
- [ ] Documented in this file

## 🎯 Benefits

1. **Consistency**: All QuizCards look the same everywhere
2. **Maintainability**: Change component once, updates everywhere
3. **Performance**: Scoped styles better than massive inline classes
4. **Collaboration**: Clear patterns for contributors
5. **Theming**: Change CSS variables to restyle entire app
6. **Testability**: Components can be unit tested
7. **Documentation**: Single source of truth

## 🚀 Next Steps

Create these reusable components:
- `<StatCard />` - For displaying stats/metrics
- `<HeroSection />` - Page hero with icon/title/subtitle
- `<EmptyState />` - "No data" messages
- `<LoadingSpinner />` - Consistent loading animation
- `<PageHeader />` - Page title and decorative elements
- `<StatusBadge />` - Status indicators (active/draft/archived)

### Rich Text Editor Components

#### TiptapEditor (`components/editor/TiptapEditor.vue`)

**Usage:**
```vue
<TiptapEditor 
  v-model="content" 
  placeholder="Start typing..."
/>
```

**Props:**
- `modelValue` (String): HTML content
- `placeholder` (String): Placeholder text

**Features:**
- Full-featured toolbar with formatting options
- Bold, italic, code, headings (H2, H3)
- Lists (bullet, ordered), code blocks
- Links and images support
- **Math formulas (inline and block)** - LaTeX support with KaTeX
- Undo/redo functionality
- Syntax highlighting for code blocks
- Consistent dark theme styling

**Math Formula Examples:**
- Inline: `$x^2 + y^2 = z^2$`
- Block: `$$\sum_{i=1}^{n} x_i$$`

#### TiptapRenderer (`components/editor/TiptapRenderer.vue`)

**Usage:**
```vue
<TiptapRenderer :content="htmlContent" />
```

**Props:**
- `content` (String): HTML content to render

**Features:**
- Read-only display of rich text
- Matches editor styling
- Safe HTML rendering
- Responsive images
- Code syntax styling
- **Math formula rendering** - Displays LaTeX formulas with KaTeX

#### Ordering (`components/quiz/answer-types/Ordering.vue`)

**Usage:**
```vue
<Ordering
  v-model="answer"
  :options="[
    { label: 'First item', value: '1' },
    { label: 'Second item', value: '2' }
  ]"
/>
```

**Props:**
- `modelValue` (String): Comma-separated ordered values (e.g., "2,1,3")
- `options` (Array): Array of { label, value } objects

**Features:**
- **Drag-and-drop reordering** - Intuitive drag-to-reorder items
- Numbered position indicators with accent glow
- Up/down button fallback for accessibility
- Visual feedback: hover glow, dragging opacity, drop target highlight
- Auto-shuffle on initial load (if no answer yet)
- Drag handle icon that changes color on hover
- Smooth animations and transitions
- Mobile-friendly (buttons only on mobile, hidden drag handle)

**Drag States:**
- **Dragging**: Item becomes semi-transparent and scales down
- **Over**: Drop target gets accent border and background glow
- **Hover**: Items lift slightly with accent border and shadow

## 📱 Client-Facing vs Admin Guidelines

### Client-Facing Pages (Public Quiz Taking)
**Mandatory Requirement: Mobile-First Responsiveness**

The quiz taking experience (`/public/*`) MUST be fully optimized for mobile devices. Users are likely to take quizzes on phones.

**Rules:**
1. **Stacking Layouts**: Use `flex-col` on mobile, `flex-row` on desktop.
   ```vue
   <div class="flex flex-col lg:flex-row gap-6">
   ```
2. **Content Ordering**: Use `order-*` classes to prioritize content on mobile.
   - *Example*: Timer should be visible at the top on mobile, even if it's on the right sidebar on desktop.
3. **Touch Targets**: Buttons and inputs must be at least 44px height (`p-3` or `p-4`).
4. **Font Scaling**: Use responsive text sizes.
   - *Bad*: `text-4xl` (overflows on mobile)
   - *Good*: `text-2xl md:text-4xl`
5. **Icon Scaling**: Icons should be smaller on mobile to save space.
   - *Example*: `w-8 h-8 md:w-12 md:h-12`
6. **No Horizontal Scroll**: Ensure containers have `overflow-hidden` or `flex-wrap` to prevent page breaking.

### Dashboard / Admin Pages
**Priority: Desktop Experience**

The dashboard (`/dashboard`, `/quizzes`, `/questions`) is a productivity tool for creators. While it should not break on mobile, the primary design target is **Desktop**.

**Rules:**
1. **Information Density**: It is acceptable to show dense tables and complex forms.
2. **Sidebar Navigation**: Persistent sidebar is preferred.
3. **Complex Editors**: Rich text editors and complex settings panels can assume a larger viewport.
4. **Mobile Fallback**: On mobile, complex tables can scroll horizontally or stack, but desktop productivity features should not be compromised for mobile simplicity.

## ✅ Completed Components

- ✅ `<QuizCard />` - Reusable quiz listing card
- ✅ `<MultipleChoice />` - Multiple choice answer input
- ✅ `<MultipleSelect />` - Multiple select answer input
- ✅ `<TrueFalse />` - True/False answer input
- ✅ `<FillBlank />` - Fill in the blank answer input
- ✅ `<Ordering />` - Drag-and-drop ordering answer input
- ✅ `<TiptapEditor />` - Rich text editor with toolbar
- ✅ `<TiptapRenderer />` - Rich text content renderer

This eliminates 90% of inline styling needs!
