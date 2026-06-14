@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Cormorant Garamond", serif;
}

body {
  font-family: var(--font-sans);
  background-color: #08080a; /* Premium sophisticated dark background */
  color: #e2e2e7;
}

.font-display {
  font-family: var(--font-display);
}

/* Glass panel styled according to Sophisticated Dark specifications */
.glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
}

.glass-heavy {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
}

/* Crystal Shape polygons */
.crystal-shape {
  width: 14px;
  height: 24px;
  background: linear-gradient(135deg, #9f7aea 0%, #6366f1 100%);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: inline-block;
  vertical-align: middle;
}

.crystal-glow {
  box-shadow: 0 0 25px rgba(159, 122, 234, 0.15);
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  margin: 20px 0;
}

/* Custom scrollbars for saved lists */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.01);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(159, 122, 234, 0.25);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(159, 122, 234, 0.45);
}

