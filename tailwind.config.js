/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure content paths cover all your files, including shadcn/ui components
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // This path is crucial for shadcn/ui components if they are in your root or other directories
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      // Custom colors for your primary palette
      colors: {
        primary: {
          light: "#3A83F1",
          DEFAULT: "#1E3A8A",
          dark: "#1E2B8A",
        },
        // You might also want to add shadcn/ui's default colors if not already present
        // For example, if you're using their default setup:
        // border: "hsl(var(--border))",
        // input: "hsl(var(--input))",
        // ring: "hsl(var(--ring))",
        // background: "hsl(var(--background))",
        // foreground: "hsl(var(--foreground))",
        // primary: {
        //   DEFAULT: "hsl(var(--primary))",
        //   foreground: "hsl(var(--primary-foreground))",
        // },
        // ... and so on for secondary, destructive, accent, popover, card
      },
      // Animations often used by shadcn/ui components
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        // Add shadcn/ui specific animations like 'accordion-down', 'accordion-up' if needed
        // "accordion-down": "accordion-down 0.2s ease-out",
        // "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Border radius variables for consistent styling with shadcn/ui
      borderRadius: {
        lg: "var(--radius)", // This variable should be defined in your CSS (e.g., globals.css)
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Add keyframes for shadcn/ui animations if you include them
      // keyframes: {
      //   "accordion-down": {
      //     from: { height: "0" },
      //     to: { height: "var(--radix-accordion-content-height)" },
      //   },
      //   "accordion-up": {
      //     from: { height: "var(--radix-accordion-content-height)" },
      //     to: { height: "0" },
      //   },
      // },
    },
  },
  // Plugins, including tailwindcss-animate which is often used with shadcn/ui
  plugins: [require("tailwindcss-animate")],
  corePlugins: {
    preflight: false,
  },
};
