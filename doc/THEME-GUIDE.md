# Theme System Documentation

## Overview

The application now features a comprehensive **Light/Dark Theme System** that applies to all UI controls and components. Users can switch between themes seamlessly using the theme switcher button.

## Features

✅ **Global Theme Support** - All 27+ controls support theming  
✅ **Automatic Theme Detection** - Respects system color scheme preference  
✅ **Theme Persistence** - User's theme choice is saved in localStorage  
✅ **Smooth Transitions** - All color changes animate smoothly (0.2s)  
✅ **Consistent Variables** - Centralized theme variables for easy maintenance

## Theme Switcher Component

### Location
The theme switcher appears in:
- **Dashboard** - Top navigation bar (next to user info)
- **Controls Documentation** - Sidebar (below header)

### Usage
```jsx
import ThemeSwitcher from './ThemeSwitcher';

function MyComponent() {
    return (
        <div>
            <ThemeSwitcher />
        </div>
    );
}
```

### API
```jsx
import { useTheme } from './ThemeContext';

function MyComponent() {
    const { theme, toggleTheme, setLightTheme, setDarkTheme } = useTheme();
    
    // Current theme: 'light' or 'dark'
    console.log(theme);
    
    // Toggle between themes
    toggleTheme();
    
    // Set specific theme
    setLightTheme();
    setDarkTheme();
}
```

## Theme Variables

### Color Palette

#### Text Colors
```css
--text-primary: #111827      /* Main text (dark in light mode) */
--text-secondary: #4b5563    /* Secondary text */
--text-tertiary: #6b7280     /* Subtle text */
--text-disabled: #9ca3af     /* Disabled text */
--text-placeholder: #9ca3af  /* Input placeholders */
```

#### Background Colors
```css
--bg-primary: #ffffff        /* Main backgrounds (white in light mode) */
--bg-secondary: #f9fafb      /* Page backgrounds */
--bg-tertiary: #f3f4f6       /* Subtle backgrounds */
--bg-hover: #f3f4f6          /* Hover states */
--bg-disabled: #e5e7eb       /* Disabled states */
```

#### Border Colors
```css
--border-primary: #d1d5db    /* Main borders */
--border-secondary: #e5e7eb  /* Subtle borders */
--border-focus: #3b82f6      /* Focused elements (blue) */
--border-hover: #9ca3af      /* Hover states */
```

#### Accent Colors
```css
--accent-primary: #3b82f6         /* Primary brand color (blue) */
--accent-primary-hover: #2563eb   /* Darker blue on hover */
--accent-primary-light: rgba(59, 130, 246, 0.1)  /* Light blue tint */
```

#### Status Colors
```css
--success: #10b981                /* Success messages (green) */
--success-light: rgba(16, 185, 129, 0.1)
--error: #ef4444                  /* Error messages (red) */
--error-light: rgba(239, 68, 68, 0.1)
--warning: #f59e0b                /* Warnings (amber) */
--warning-light: rgba(245, 158, 11, 0.1)
--info: #06b6d4                   /* Information (cyan) */
--info-light: rgba(6, 182, 212, 0.1)
```

#### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-focus: 0 0 0 3px var(--accent-primary-light)
```

#### Border Radius
```css
--radius-sm: 4px
--radius-md: 6px
--radius-lg: 8px
--radius-xl: 12px
```

#### Spacing
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 12px
--spacing-lg: 16px
--spacing-xl: 24px
```

## Dark Theme Values

When `data-theme="dark"` is applied to the document root, all variables automatically switch to dark mode values:

```css
[data-theme="dark"] {
    --bg-primary: #1f2937          /* Dark gray */
    --bg-secondary: #111827        /* Darker gray */
    --bg-tertiary: #374151         /* Medium gray */
    
    --text-primary: #f9fafb        /* Light text */
    --text-secondary: #e5e7eb      /* Lighter text */
    --text-tertiary: #d1d5db       /* Subtle light text */
    
    --border-primary: #4b5563      /* Dark borders */
    --border-secondary: #374151    /* Darker borders */
    
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3)      /* Stronger shadows */
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5)
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.7)
}
```

## Themed Controls

All controls have been updated to use theme variables:

### Layout Controls
- ✅ FormControl
- ✅ TableviewControl
- ✅ GridviewControl
- ✅ CardControl
- ✅ AccordionControl
- ✅ TabControl
- ✅ TreeControl
- ✅ ButtonGroupControl
- ✅ PaginationControl

### Input Controls
- ✅ TextboxControl
- ✅ NumberControl
- ✅ SelectControl
- ✅ CheckboxControl
- ✅ ToggleControl
- ✅ DateControl
- ✅ ButtonControl
- ✅ LabelControl

### Display Controls
- ✅ LinkControl
- ✅ ImageControl
- ✅ BadgeControl
- ✅ IconControl
- ✅ ProgressControl
- ✅ ChartControl
- ✅ QRCodeControl

### Date/Time Controls
- ✅ DatePickerControl
- ✅ CalendarControl
- ✅ CalendarGridControl

### Other Controls
- ✅ DropdownControl

## Using Theme Variables in Your CSS

### Example 1: Custom Component
```css
.my-component {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-sm);
}

.my-component:hover {
    background-color: var(--bg-hover);
    border-color: var(--border-hover);
}

.my-component:focus {
    border-color: var(--border-focus);
    box-shadow: var(--shadow-focus);
}
```

### Example 2: Button with Status Colors
```css
.btn-success {
    background-color: var(--success);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
}

.btn-success:hover {
    background-color: #059669; /* Darker green */
}

.btn-error {
    background-color: var(--error);
    color: white;
}
```

### Example 3: Card with Shadow
```css
.card {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-md);
    transition: all 0.2s ease;
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}
```

## Implementation Guide

### Step 1: Wrap App with ThemeProvider
```jsx
// main.jsx
import { ThemeProvider } from './ThemeContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>
);
```

### Step 2: Import Theme CSS
```jsx
// main.jsx
import './theme.css';
```

### Step 3: Update Component CSS Files
Replace hardcoded colors with theme variables:
```css
/* Before */
.my-element {
    background-color: #ffffff;
    color: #111827;
    border: 1px solid #e5e7eb;
}

/* After */
.my-element {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-secondary);
}
```

### Step 4: Add Theme Switcher to UI
```jsx
import ThemeSwitcher from './ThemeSwitcher';

function MyNav() {
    return (
        <nav>
            <h1>My App</h1>
            <ThemeSwitcher />
        </nav>
    );
}
```

## Auto Theme Detection

The system automatically detects the user's system color scheme preference:

```javascript
// ThemeContext.jsx
const [theme, setTheme] = useState(() => {
    // 1. Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    
    // 2. Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    // 3. Default to light
    return 'light';
});
```

## Browser Support

The theme system uses CSS Custom Properties (CSS Variables) which are supported in:
- ✅ Chrome 49+
- ✅ Firefox 31+
- ✅ Safari 9.1+
- ✅ Edge 15+
- ✅ Opera 36+

## Best Practices

### DO ✅
- Use theme variables for all colors
- Use spacing variables for consistent padding/margins
- Use radius variables for consistent border-radius
- Test components in both light and dark modes
- Provide sufficient color contrast for accessibility

### DON'T ❌
- Hard-code hex/rgb colors
- Use fixed pixel values for spacing
- Skip testing in dark mode
- Use colors with insufficient contrast
- Override theme variables with inline styles

## Troubleshooting

### Theme Not Switching
1. Check ThemeProvider is wrapping your app
2. Verify theme.css is imported
3. Check data-theme attribute on `<html>` element
4. Clear browser cache and localStorage

### Colors Not Changing
1. Ensure CSS uses `var(--variable-name)` syntax
2. Check for `!important` overrides
3. Verify CSS file imports theme.css
4. Inspect element to see computed styles

### Dark Mode Too Dark/Light
Adjust theme variables in theme.css:
```css
[data-theme="dark"] {
    --bg-primary: #1f2937;  /* Adjust this value */
}
```

## Accessibility

The theme system maintains WCAG 2.1 Level AA contrast ratios:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

Test contrast using browser DevTools or online tools.

## Performance

- Theme switching is instant (no page reload)
- CSS transitions are GPU-accelerated
- Variables are computed once per element
- LocalStorage caching prevents theme flicker on page load

## Future Enhancements

Potential improvements:
- [ ] Multiple theme options (not just light/dark)
- [ ] Custom color picker for accent colors
- [ ] High contrast mode
- [ ] Accessibility preferences integration
- [ ] Theme preview before switching
- [ ] Export/import custom themes

## Support

For issues or questions about the theme system:
1. Check this documentation
2. Inspect browser DevTools
3. Review theme.css for variable definitions
4. Test in both light and dark modes

---

**Last Updated:** November 17, 2025  
**Version:** 1.0.0
