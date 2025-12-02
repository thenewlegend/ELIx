# ELI-X 🎓

**Explain Like I'm X** - Complex topics, simplified for any age.

ELI-X is an AI-powered web application that transforms complex topics into easy-to-understand explanations tailored to any age level or persona. Built with SvelteKit and powered by Google's Gemini AI, it offers multiple modes for learning and comparing explanations.

![Material Design 3](https://img.shields.io/badge/Material%20Design-3-6750A4)
![SvelteKit](https://img.shields.io/badge/SvelteKit-5-FF3E00)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4)

---

## ✨ Features

### 🎯 Multiple Explanation Modes

- **Explain Mode**: Get simple explanations for any topic at any age level (1-100)
- **Versus Mode**: Compare explanations side-by-side for two different age levels
- **Persona Mode**: Hear explanations from unique characters:
  - 🪨 Caveman - Primitive, all-caps simplicity
  - 💀 Gen Z - Brainrot slang and chaotic energy
  - 🎭 Shakespeare - Flowery Early Modern English
  - 👽 Conspiracy Theorist - Everything connects to "Them"
  - 👨‍🍳 Gordon Ramsay - Aggressive culinary insults
  - 💻 Programmer - Software engineering analogies
- **Battle Mode**: Watch personas debate from opposing viewpoints:
  - 🤔 Philosopher vs 🔬 Scientist
  - 👴 Boomer vs 🛹 Zoomer
  - ☀️ Optimist vs 🌧️ Pessimist

### 🌗 Thematic Support

- **Light Mode**: Clean, standard Material Design 3 light theme
- **Dark Mode**: Deep, rich dark theme for low-light environments
- **AMOLED Mode**: Pure black theme for OLED screens and battery saving
- **System Sync**: Automatically matches your device's preference

### 🎨 Premium UI/UX

- **Material Design 3**: Modern, polished interface with M3 color tokens and typography
- **Glassmorphism**: Frosted glass navbar with backdrop blur
- **Micro-interactions**:
  - Button press feedback (scale animations)
  - Material ripple effects on all buttons
  - Layered shadows for depth
  - Staggered entrance animations
- **Haptic Feedback**: Subtle vibrations on mobile devices (where supported)
- **Toast Notifications**: Success/error feedback for all actions
- **Responsive Design**: Seamless experience from mobile (320px) to 4K displays
- **Accessibility**: Respects `prefers-reduced-motion` and includes proper ARIA labels

---

## 🏗️ Architecture

### Technology Stack

```
Frontend:  SvelteKit 5 (Svelte 5 with Runes)
Styling:   Tailwind CSS + Custom M3 Tokens
AI Model:  Google Gemini 2.5 Flash
Runtime:   Node.js
```

### Project Structure

```
ELIx/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Toast.svelte          # Toast notification component
│   │   │   ├── Skeleton.svelte       # Loading skeleton component
│   │   │   ├── SettingsModal.svelte  # Settings & Theme configuration
│   │   │   └── SplashScreen.svelte   # Intro walkthrough component
│   │   ├── stores/
│   │   │   ├── toast.js              # Global toast state management
│   │   │   └── theme.js              # Theme state management
│   │   ├── actions/
│   │   │   └── ripple.js             # Material ripple effect action
│   │   └── utils/
│   │       └── haptics.js            # Haptic feedback utility
│   ├── routes/
│   │   ├── +layout.svelte            # Global layout with navbar & toasts
│   │   ├── +page.svelte              # Landing page with mode cards
│   │   ├── explain/+page.svelte      # Standard explanation mode
│   │   ├── versus/+page.svelte       # Side-by-side comparison
│   │   ├── persona/+page.svelte      # Character-driven explanations
│   │   ├── battle/+page.svelte       # Persona vs Persona debates
│   │   └── api/
│   │       └── explain/+server.js    # Gemini API integration
│   └── routes/layout.css             # M3 design tokens & animations
└── IDEAS.md                          # Future feature ideas
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/thenewlegend/ELIx.git
cd ELIx

# Install dependencies
npm install

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

### Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Usage Examples

### Explain Mode
```
Topic: "Quantum Computing"
Age: 8
→ Gets child-friendly explanation with simple analogies
```

### Versus Mode
```
Topic: "Climate Change"
Age A: 10  |  Age B: 40
→ Compares explanations side-by-side
```

### Persona Mode
```
Topic: "Blockchain"
Persona: Shakespeare
→ "Hark! A ledger distributed amongst the realm..."
```

### Battle Mode
```
Topic: "Social Media"
Philosopher vs Scientist
→ Two contrasting perspectives in debate format
```

---

## 🔧 Configuration

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Customizing Personas

Edit `/src/routes/api/explain/+server.js` to add or modify persona prompts:

```javascript
case 'your_persona':
  prompt = `Explain "${topic}" as [character description]...`;
  break;
```

---

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Progressive Features**:
- Haptic feedback: Mobile only (Vibration API)
- Backdrop blur: Modern browsers only
- Animations: Disabled if `prefers-reduced-motion: reduce`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

### AI-Powered Development

This project was built with significant assistance from AI tools:

- **[Google Gemini AI](https://deepmind.google/technologies/gemini/)**: Powers the core explanation generation using Gemini 2.5 Flash model
- **[Gemini CLI (Antigravity)](https://github.com/google/generative-ai-cli)**: AI-powered coding assistant that helped architect, implement, and polish the entire application
  - Designed the Material Design 3 implementation
  - Implemented responsive layouts and micro-interactions
  - Created the persona system and battle mode
  - Added UI polish features (toasts, ripples, haptics)
  - Provided architectural guidance and best practices

**Built with AI, for humans.** 🤖❤️👨‍💻


---

**Made with ❤️ using SvelteKit, Gemini AI, and Antigravity**
