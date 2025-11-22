/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: '#FAF9F6', // Creamy off-white
                foreground: '#2D3748',
                primary: {
                    DEFAULT: '#A8E6CF', // Soft mint green
                    foreground: '#2D3748',
                },
                secondary: {
                    DEFAULT: '#FFE4B5', // Soft pale yellow
                    foreground: '#2D3748',
                },
                destructive: {
                    DEFAULT: '#FFA07A',
                    foreground: '#FFFFFF',
                },
                muted: {
                    DEFAULT: '#E8E8E8',
                    foreground: '#6B7280',
                },
                accent: {
                    DEFAULT: '#B4D7FF', // Soft sky blue
                    foreground: '#2D3748',
                },
                popover: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#2D3748',
                },
                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#2D3748',
                },
                warning: '#FFE4B5',
                'cream': '#FAF9F6',
                'mint': '#A8E6CF',
                'pale-yellow': '#FFE4B5',
                'sky-blue': '#B4D7FF',
                'soft-coral': '#FFB6B9',
                'lavender': '#E8DAEF',
                'navy-main': '#0f172a',
                'neon-green': '#39ff14',
                'neon-orange': '#ffaa00',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
                ticker: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                ticker: 'ticker 20s linear infinite',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
