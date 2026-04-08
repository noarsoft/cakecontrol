# 🎨 Quick Start: Theme System

## For Users

### How to Switch Themes

1. **Find the Theme Switcher Button**
   - Look for the sun ☀️ or moon 🌙 icon
   - Located in the navigation bar (Dashboard)
   - Located in the sidebar (Controls Documentation)

2. **Click to Toggle**
   - Click once to switch to dark mode
   - Click again to switch back to light mode
   - Your preference is automatically saved

3. **Automatic Theme**
   - First visit: System preference detected
   - Subsequent visits: Your last choice remembered

---

## For Developers

### Quick Implementation (3 Steps)

#### Step 1: Wrap Your App
```jsx
// main.jsx
import { ThemeProvider } from './ThemeContext';
import './theme.css';

<ThemeProvider>
    <App />
</ThemeProvider>
```

#### Step 2: Use Theme Variables in CSS
```css
/* Your component CSS */
.my-component {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
}
```

#### Step 3: Add Theme Switcher
```jsx
import ThemeSwitcher from './ThemeSwitcher';

function MyNav() {
    return (
        <nav>
            <ThemeSwitcher />
        </nav>
    );
}
```

---

## Common Theme Variables

### Quick Reference Card

```css
/* BACKGROUNDS */
var(--bg-primary)      /* Main white/dark gray */
var(--bg-secondary)    /* Page background */
var(--bg-hover)        /* Hover states */

/* TEXT */
var(--text-primary)    /* Main text */
var(--text-secondary)  /* Subtle text */
var(--text-tertiary)   /* Very subtle */

/* BORDERS */
var(--border-primary)  /* Main borders */
var(--border-focus)    /* Blue focus ring */

/* COLORS */
var(--accent-primary)  /* Brand blue */
var(--success)         /* Green */
var(--error)           /* Red */
var(--warning)         /* Amber */

/* SPACING */
var(--spacing-sm)      /* 8px */
var(--spacing-md)      /* 12px */
var(--spacing-lg)      /* 16px */

/* RADIUS */
var(--radius-md)       /* 6px */
var(--radius-lg)       /* 8px */

/* SHADOWS */
var(--shadow-sm)       /* Subtle */
var(--shadow-md)       /* Medium */
```

---

## Test Your Theme

### Quick Test Checklist
```
✓ Click theme switcher
✓ Verify colors change
✓ Refresh page - theme persists
✓ Test in incognito - system preference detected
✓ Check all controls look good in both modes
```

---

## Need More Info?

📖 Full Documentation: [THEME-GUIDE.md](./THEME-GUIDE.md)  
📊 Implementation Details: [THEME-IMPLEMENTATION-SUMMARY.md](./THEME-IMPLEMENTATION-SUMMARY.md)

---

## Visual Preview

### Light Theme
```
┌─────────────────────────────┐
│ ☀️ CAMT Dashboard          │  ← White navbar
├─────────────────────────────┤
│                             │
│  [White Card]               │  ← White backgrounds
│  Black text on white        │  ← High contrast
│                             │
│  [White Card]               │
│  Blue accents               │  ← Accent color
│                             │
└─────────────────────────────┘
```

### Dark Theme
```
┌─────────────────────────────┐
│ 🌙 CAMT Dashboard          │  ← Dark navbar
├─────────────────────────────┤
│                             │
│  [Dark Gray Card]           │  ← Dark backgrounds
│  White text on dark         │  ← High contrast
│                             │
│  [Dark Gray Card]           │
│  Blue accents               │  ← Same accent
│                             │
└─────────────────────────────┘
```

---

## Troubleshooting

### Theme Not Switching?
1. Check browser console for errors
2. Verify ThemeProvider wraps your app
3. Clear browser cache
4. Check localStorage has 'theme' key

### Colors Look Wrong?
1. Verify CSS uses `var(--variable)` syntax
2. Check theme.css is imported
3. Inspect element in DevTools
4. Look for hardcoded colors

### Need Help?
See full guide: [THEME-GUIDE.md](./THEME-GUIDE.md)

---

**Made with ❤️ for CAMT Auth System**  
Version 1.0.0 | November 2025
