# ProcAgent UI Design Specification (Soft Glassmorphism)

## 1. Design Philosophy
**"Ethereal, Modern, fluidity"**
Based on the provided reference, the design uses **Soft Glassmorphism**. It features organic pastel gradients, frosted glass containers, and high-contrast typography (Black on Glass).

## 2. Color Palette

### Backgrounds (Mesh Gradient)
- **Base:** A fluid mesh of:
    - Soft Teal/Cyan: `#A7F3D0` (or similar pastel)
    - Soft Peach/Orange: `#FDBA74`
    - Soft Blue: `#BFDBFE`
    - Cream/White: `#FDFBF7`
- **Glass Container:** `rgba(255, 255, 255, 0.4)` with `backdrop-filter: blur(24px)`.
- **Border:** `rgba(255, 255, 255, 0.6)` (1px solid).

### Primary Colors (High Contrast)
- **Primary Action (Buttons):** `#111827` (Rich Black) - **Pill shaped**.
- **Primary Text:** `#FFFFFF` (White).
- **Secondary Action:** Transparent with `#111827` border.

### Typography Colors
- **Headings:** `#111827` (Rich Black).
- **Body Text:** `#374151` (Gray 700).
- **Inputs:** `rgba(255, 255, 255, 0.5)` background with dark text.

## 3. Typography
- **Font:** 'Inter', sans-serif.
- **Headings:** Bold/ExtraBold (700/800).
- **Body:** Regular/Medium (400/500).

## 4. Components

### Login Page (The "Hero" Look)
- **Background:** Full-screen animated or static mesh gradient (CSS radial-gradients).
- **Container:** Large, centered (or slightly off-center) **Glass Card**.
    - Rounded corners: `32px` (Large radius).
    - Padding: `48px`.
    - Shadow: `0 25px 50px -12px rgba(0, 0, 0, 0.1)`.
- **Form:**
    - Inputs: "Ghost" style or light semi-transparent fill. Rounded `12px`.
    - Button: Full width, Black, Pill-shaped (`border-radius: 9999px`).

### Main Dashboard (Glass Interface)
- **Background:** Subtle version of the mesh gradient (lighter, less distracting).
- **Layout:** Floating Glass Panels.
    - **Header:** Floating glass strip at the top.
    - **Chat Panel:** Large glass container in center/left.
    - **VNC Panel:** Glass container on right.
- **Chat Bubbles:**
    - **User:** Black bubble, White text.
    - **Assistant:** White/Glass bubble, Dark text.

## 5. Implementation Details
- **CSS Variables:** Define `--glass-bg`, `--glass-border`, `--primary-black`.
- **Gradients:** Use CSS `radial-gradient` at different positions to create the "blob" effect.
- **Animation:** Slowly animate the background gradient positions for a "breathing" effect.