# Dashboard Styling Guide - LearnWeave

This document provides styling guidelines to maintain consistency with the modern teal/cyan theme across the dashboard.

## 🎨 Color Palette

### Primary Colors (Teal/Cyan)
```css
--primary-teal-dark: #0f766e;
--primary-teal: #0d9488;
--primary-cyan: #06b6d4;
--primary-cyan-light: #0891b2;
```

### Background Colors
```css
--bg-light: #f8fafc;
--bg-white: #ffffff;
--bg-card: #ffffff;
--bg-card-hover: #f9fafb;
```

### Border Colors
```css
--border-light: #e5e7eb;
--border-medium: #d1d5db;
--border-teal: #0d9488;
```

### Text Colors
```css
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-dimmed: #9ca3af;
```

## 📐 Component Styling Examples

### 1. Gradient Buttons (Primary Actions)
```jsx
<Button
  sx={(theme) => ({
    background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
    border: 'none',
    borderRadius: 12,
    height: 50,
    fontWeight: 700,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(13, 148, 136, 0.4)',
    },
  })}
>
  Create New Course
</Button>
```

### 2. Card Components
```jsx
<Card
  withBorder
  radius="xl"
  sx={(theme) => ({
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 30px rgba(13, 148, 136, 0.15)',
      borderColor: '#0d9488',
    },
  })}
>
  {/* Card content */}
</Card>
```

### 3. Stats Cards
```jsx
<Paper
  p="xl"
  radius="xl"
  sx={(theme) => ({
    background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
    border: '1px solid rgba(13, 148, 136, 0.2)',
    backdropFilter: 'blur(10px)',
  })}
>
  <Group>
    <ThemeIcon
      size={60}
      radius="xl"
      variant="light"
      color="teal"
      sx={{
        background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
      }}
    >
      <IconRocket size={30} color="white" />
    </ThemeIcon>
    <div>
      <Text size="xl" weight={800}>150</Text>
      <Text size="sm" color="dimmed">Total Courses</Text>
    </div>
  </Group>
</Paper>
```

### 4. Progress Bars
```jsx
<Progress
  value={75}
  size="lg"
  radius="xl"
  styles={{
    root: { width: '100%', backgroundColor: '#e5e7eb' },
    bar: {
      backgroundImage: 'linear-gradient(90deg, #0d9488 0%, #06b6d4 100%)',
    },
  }}
/>
```

### 5. Badges
```jsx
{/* Status Badge */}
<Badge
  variant="light"
  color="teal"
  size="lg"
  radius="md"
  sx={{
    background: 'rgba(13, 148, 136, 0.1)',
    color: '#0d9488',
    fontWeight: 600,
  }}
>
  In Progress
</Badge>

{/* Gradient Badge */}
<Badge
  size="lg"
  radius="xl"
  sx={{
    background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
    color: 'white',
    fontWeight: 700,
  }}
>
  Premium
</Badge>
```

### 6. Section Headers
```jsx
<Box mb="xl">
  <Title
    order={2}
    sx={{
      fontSize: 32,
      fontWeight: 800,
      background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: 8,
    }}
  >
    My Learning Journey
  </Title>
  <Text color="dimmed" size="lg">
    Continue where you left off
  </Text>
</Box>
```

### 7. Action Icons
```jsx
<ActionIcon
  variant="subtle"
  color="gray"
  size="lg"
  radius="md"
  sx={{
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(13, 148, 136, 0.1)',
      color: '#0d9488',
    },
  }}
>
  <IconPencil size={18} />
</ActionIcon>
```

### 8. Search Input
```jsx
<TextInput
  placeholder="Search courses..."
  size="lg"
  radius="xl"
  styles={{
    input: {
      borderColor: '#e5e7eb',
      '&:focus': {
        borderColor: '#0d9488',
        boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.1)',
      },
    },
  }}
/>
```

### 9. Empty State
```jsx
<Stack align="center" spacing="lg" py={60}>
  <ThemeIcon
    size={80}
    radius="xl"
    variant="light"
    sx={{
      background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
    }}
  >
    <IconBook size={40} color="#0d9488" />
  </ThemeIcon>
  <div style={{ textAlign: 'center' }}>
    <Text size="xl" weight={700} mb={8}>
      No courses yet
    </Text>
    <Text color="dimmed" mb="xl">
      Create your first course to get started
    </Text>
    <Button
      size="lg"
      sx={{
        background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
        borderRadius: 12,
      }}
    >
      Create Course
    </Button>
  </div>
</Stack>
```

### 10. Modal Styling
```jsx
<Modal
  opened={opened}
  onClose={close}
  title={
    <Text weight={700} size="xl">
      Edit Course
    </Text>
  }
  centered
  radius="xl"
  styles={{
    modal: {
      border: '1px solid #e5e7eb',
    },
    header: {
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: 16,
    },
  }}
>
  {/* Modal content */}
</Modal>
```

## 🎭 Animation Guidelines

### Hover Effects
```css
transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

&:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(13, 148, 136, 0.15);
}
```

### Entrance Animations
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  {/* Content */}
</motion.div>
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  padding: 20px;
  font-size: 14px;
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  padding: 30px;
}

/* Desktop */
@media (min-width: 1025px) {
  padding: 40px;
}
```

## 🎯 Best Practices

1. **Consistency**: Always use the teal/cyan gradient for primary actions
2. **Spacing**: Use consistent spacing (8px, 16px, 24px, 32px, 48px)
3. **Shadows**: Use subtle shadows (0 4px 20px rgba(0, 0, 0, 0.08))
4. **Borders**: Use light borders (#e5e7eb) for separation
5. **Hover States**: Always include smooth transitions and subtle transforms
6. **Typography**: Use weight 600-800 for headings, 400-500 for body text
7. **Border Radius**: Use xl (24px) for cards, md (12px) for buttons
8. **Icons**: Use 16-24px for inline icons, 40-60px for feature icons

## 🔧 Utility Classes

Create these reusable styles in your theme:

```jsx
const theme = {
  colors: {
    teal: ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'],
    cyan: ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
  },
  primaryGradient: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
  shadows: {
    card: '0 4px 20px rgba(0, 0, 0, 0.08)',
    cardHover: '0 8px 30px rgba(13, 148, 136, 0.15)',
  },
};
```

---

**Note**: This styling guide ensures consistency across the entire dashboard while maintaining the modern, premium feel established in the login and signup pages.
