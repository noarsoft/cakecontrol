// ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        
        // Then check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    });

    useEffect(() => {
        // Update data-theme attribute on document root
        document.documentElement.setAttribute('data-theme', theme);
        
        // Store preference
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setLightTheme = () => setTheme('light');
    const setDarkTheme = () => setTheme('dark');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setLightTheme, setDarkTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
