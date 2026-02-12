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
				// Identidad Visual Nucleo Colectivo EXACTA
				'nucleo-yellow': '#FEE440',
				'nucleo-black': '#000000',
				'nucleo-white': '#FFFFFF',
				'nucleo-purple': '#9D4EDD',
				'nucleo-violet': '#7B2CBF',
				'nucleo-green': '#06FFA5',
				
				// Shadcn UI colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#9D4EDD',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#FEE440',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#7B2CBF',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			fontFamily: {
				'montserrat': ['Montserrat', 'sans-serif'],
				'lora': ['Lora', 'serif'],
				'roboto-mono': ['Roboto Mono', 'monospace'],
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
				// Animaciones Nucleo Colectivo
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'pulse-ring': {
					'0%': { transform: 'scale(0.8)', opacity: '1' },
					'100%': { transform: 'scale(2.4)', opacity: '0' },
				},
				'gradient': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
				'neuron-pulse': {
					'0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
					'50%': { transform: 'scale(1.1)', opacity: '1' },
				},
				'connect': {
					'0%': { strokeDashoffset: '100%' },
					'100%': { strokeDashoffset: '0%' },
				},
				'fadeInUp': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0px)' },
				},
				'slideInLeft': {
					'0%': { opacity: '0', transform: 'translateX(-100px)' },
					'100%': { opacity: '1', transform: 'translateX(0px)' },
				},
				'slideInRight': {
					'0%': { opacity: '0', transform: 'translateX(100px)' },
					'100%': { opacity: '1', transform: 'translateX(0px)' },
				},
				'zoomIn': {
					'0%': { opacity: '0', transform: 'scale(0.5)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'rotate3d': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(360deg)' },
				},
				'data-flow': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateX(100%)', opacity: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-ring': 'pulse-ring 2s ease-out infinite',
				'gradient': 'gradient 6s ease-in-out infinite',
				'neuron-pulse': 'neuron-pulse 2s ease-in-out infinite',
				'connect': 'connect 1s ease-in-out',
				'fadeInUp': 'fadeInUp 0.6s ease-out',
				'slideInLeft': 'slideInLeft 0.8s ease-out',
				'slideInRight': 'slideInRight 0.8s ease-out',
				'zoomIn': 'zoomIn 0.5s ease-out',
				'rotate3d': 'rotate3d 10s linear infinite',
				'data-flow': 'data-flow 2s ease-in-out infinite',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'nucleo-gradient': 'linear-gradient(135deg, #FEE440 0%, #9D4EDD 50%, #7B2CBF 100%)',
				'nucleo-gradient-reverse': 'linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 50%, #FEE440 100%)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
