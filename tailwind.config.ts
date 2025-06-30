import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			darkteal: {
				darkest: "#121918", // Very Dark Teal
				dark: "#202E2C",    // Dark Teal Gray
				DEFAULT: "#405E5A", // Muted Teal Gray
				light: "#607E7A",   // Dusty Aqua
			  },
			appred: {
				darkest: "#930900", // Deep Crimson
				dark: "#C70B00",    // Strong Red
				DEFAULT: "#E04033", // Tomato Red
				light: "#F26B5D",   // Coral Red
			  },
			appgreen: {
				darkest: "#004d00", // Dark Forest Green
				dark: "#007000",    // Deep Green
				DEFAULT: "#339933", // Leafy Green
				light: "#66cc66",   // Mint Green
			  },
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
