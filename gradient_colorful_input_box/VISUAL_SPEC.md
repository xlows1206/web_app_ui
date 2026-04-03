# Visual Specification: Gradient Colorful Input Box

This document defines the architectural and aesthetic standards for the "Gradient Colorful Input Box" component, specifically the refined "Soft Bleed" version.

## 1. Design Philosophy
The component is built on a **Soft Glassmorphism** foundation. It prioritizes content clarity by maintaining a solid white center for text entry, while creating a premium "shimmer" effect that appears to bleed through the border area via deep scattering and dual-layer masking.

## 2. Color Palette (Glow Effects)
The shimmering glow utilizes a multi-layer gradient inspired by nature and energy:

- **Emerald (Primary Glow)**: `#a7f3d0`
- **Orange (Secondary Glow)**: `#fdba74`
- **Blue (Accent Glow)**: `#bfdbfe`
- **Center Focus**: `#ffffff` (Solid White)
- **Text Primary**: `#111827` (Used for text and button background)

## 3. Layering Architecture (Stacking Order)
To achieve the "edge-only bleed" effect, the component uses a precise 3-layer stacking system:

1.  **Layer 1 (Bottom) - `::before`**: The Rainbow Glow layer. Positioned at `z-index: -2` with a `12px` to `18px` blur.
2.  **Layer 2 (Middle) - `::after`**: The White Mask layer. Positioned at `z-index: -1`. It uses a `radial-gradient` (White 55% → Translucent 100%) and a large `inset 0 0 40px 10px #ffffff` shadow to create the halo effect.
3.  **Layer 3 (Top) - Content**: The `textarea` and action buttons. Set to `z-index: 1` to ensure accessibility and clarity.

## 4. Key Interactions
### Focus State (The Shimmer Effect)
Whenever any element within the container is focused, the following occurs:
1. **Vertical Lift**: The container lifts by `4px` (`translateY(-4px)`).
2. **Shadow Expansion**: A deep shadow appears (`box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.12)`).
3. **Soft Bleed Activation**: The `::before` rainbow layer expands its blur to `18px` and increases opacity to `0.95`.
   - **Animation**: `shimmer-glow-outer` (3s, linear, infinite).

## 5. Usage Guidelines
- **Multi-line Support**: The component utilizes a `textarea` that defaults to 3 rows high and auto-expands as the user types.
- **Container**: Max-width of `4xl` (approx 896px) is recommended for best visual balance on landing pages or chat interfaces.
- **Typography**: `1.125rem` (text-lg) with `500` weight (Medium) for a professional, easy-to-read engineering feel.
