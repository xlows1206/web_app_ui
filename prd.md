# ProcAgent SaaS Dashboard - Product Requirements Document (PRD)

**Document Version:** 1.0.0
**Product Name:** ProcAgent Workspace Engine
**Status:** In Development (Phase 4 Finalized)

---

## 1. Executive Summary
ProcAgent is a professional-grade SaaS (Software as a Service) workspace dashboard engineered for high-complexity, industrial, and creative teams. The goal of this product is to provide a unified, highly aesthetic entry point (Workspace) for discovering templates, managing simulation projects (e.g., 3D Piping), and monitoring business assets (like AI credits) while maintaining an uncompromising standard of UI/UX precision.

Our design philosophy strictly adheres to the **"Neural Architectures"** style: desaturated palettes, robust typography, extreme minimalism, and heavy reliance on high-quality blurs, shadows, and spacing over noisy borders and saturated colors.

## 2. Target Audience & Use Case
**Target Roles:**
- **Lead Engineers / Enterprise Architects:** Users interacting with complex data sets, such as fluid dynamics and chemical plant piping.
- **Project Managers:** Users managing cross-functional team access and project timelines.
- **Power Users / Admins:** Users needing real-time monitoring of SaaS billing resources (e.g., AI compute credits).

**Primary Use Case:**
A central "Command Center" where an engineer logs in to check notification alerts, review their remaining compute quotas, and rapidly instantiate high-fidelity industrial models from a curated template library or pick up their recent heavy-duty projects.

## 3. Product Principles
- **Aesthetic Authority:** Every border radius, shadow, and color transition must feel like a premium Apple/Linear product.
- **Cognitive Clarity:** Information hierarchy must prioritize what’s important. Noise (like redundant buttons or excessive text) must be eliminated.
- **Global Inclusivity (i18n):** The system must perfectly support English and Chinese string lengths and typography (Manrope/Noto Sans SC) without breaking layout bounds.

## 4. Key Functional Modules (The Workspace)

### 4.1 Global Top Navigation (`TopNav`)
The primary anchor for global actions and user status.
- **Brand Identity:** Left-aligned `ProcAgent` logo and brand name.
- **AI Asset Monitor (Micro-Interaction):** The critical business conversion component.
  - **Design:** A pill-shaped unit left of the user avatar.
  - **Content:** Displays an `auto_awesome` icon using the brand gradient (`from-purple-600 to-pink-500`) and the raw numeric balance (e.g., "5.00").
  - **Rationale:** By removing text like "AI Credit", it reduces noise and positions the resource as a high-value, ubiquitous OS-level metric.
- **Notifications Tower:** 
  - Supports dual state representations: Positive events (e.g., "Accepted joining project") and Negative events (e.g., "Removed from project").
  - Features real-time unread dot indicators (`bg-error`).
- **User Avatar & Profile Menu:**
  - Displays user avatar and dynamic "Rank Badge" (e.g., PRO, TEAM).
  - Includes a comprehensive dropdown for quick profile editing, multi-language switching (`en` <-> `zh`), and a secondary AI Credit summary block offering a high-contrast "Upgrade" action.

### 4.2 Template Library Repository (`TemplatesSection`)
A horizontal scrolling repository for discovering workflow presets.
- **Header:** Title and a bilingual-supported "More Templates / 更多模板" interaction link.
  - **Micro-interaction:** The hover state triggers a unified `border-bottom` line transition connecting the text and the arrow, providing a bespoke, continuous interactive feel.
- **Template Cards:**
  - **Static State:** Minimalist presentation with an icon, title, short description, and an optional "New" outline badge.
  - **Hover State:** Triggers a smooth scale + shadow elevation, accompanied by a single fade-in action button reading "View Template / 查看模板", using the brand's low-saturation slate gradient.
- **Template Detail Modal (`TemplateDetailModal`):**
  - **Trigger:** Click action on any template card.
  - **Layout (Information First):** 
    - Top: Large, assertive title with an inline, pill-shaped "Category" tag.
    - Middle: The `longDesc` providing deep context, immediately followed by a large, 4K `aspect-video` product screenshot. Example: *Chemical Plant Piping Design & Simulation*. 
    - Footer: Simplistic right-aligned "Use this Template" primary action button.
  - **Design Language:** Uses immersive, full-screen spanning dark `backdrop-blur-md` (`bg-slate-900/60`), framing the content in a stark white card with maximum border radiuses (`rounded-[32px]`).

### 4.3 Active Projects Grid (`ActiveProjectsSection` & `ProjectCard`)
The operational core where users manage ongoing assets.
- **Card Hierarchy (Bento Style):**
  - **Structure:** To optimize readability, the Project Title resides on the top row alongside a subtle "three-dot" context menu. Business Tags (`3D PIPING`, `SIMULATION`) are subordinate, placed below the title.
  - **Visuals:** Follows the "Neural Architectures" philosophy. Badges and "New Project" actions are thoroughly desaturated. Instead of vibrant pinks, the system leverages expert-level tones: `Slate-600` to `Navy-900` for primary actions, producing a calm, clinical SaaS environment.
- **Project Context Menu (`ProjectMembersModal` & `ProjectCard` Actions):** 
  - **Meta-Data Immersion:** The menu header transcends plain text, offering a dedicated sub-card layout displaying the project creator’s dynamic entity avatar paired with localized creation timestamps (e.g., "Created 2026-10-14").
  - **Actions Stack:** Provides context-aware administrative capabilities: Members overview, Rename, Delete.
- **Intelligent Member Stacking (`AvatarGroup`):**
  - Designed for high-density collaboration. Visually prioritizes and strictly renders up to 3 active avatars.
  - Automatically calculates and aggregates all overflowing members into a visually consistent, dynamically-sized `+N` badge located at the rear, preserving card grid harmony.

## 5. Technical Stack & Implementation Guidelines
- **Framework:** Next.js App Router (React 19).
- **Styling:** Tailwind CSS (utility-first).
- **Typography Engine:** Dual-stack utilizing `Manrope` for Latin characters and `Noto Sans SC` for perfect CJK rendering. Font weights are cleanly mapped to avoid rendering crashes.
- **Iconography System:** Exclusively runs on **`lucide-react`** vector icons. Every functional icon in the product strictly adheres to fine-tuned `strokeWidth` (2 to 2.5) and precision scaling parameters (sizes: 14|16|18|20|24) to enforce the high-end industrial engineering aesthetic, effectively abandoning standard web-fonts.
- **Borders & Radiuses (Global Rule):** 
  - `rounded-[24px]` is the absolute uncompromised standard for **all floating operational surfaces** (e.g., TopNav Dropdowns, Notification Panels, Action Menus, and Standard Modals), strictly coupled with `overflow-hidden` inner clipping to eradicate jagged corners.
  - `rounded-[32px]` is reserved exclusively for major focal structural sheets (e.g., Template Detail Overlays) to communicate heavyweight focus.
- **Compiler Hardening:** In Next.js 16+ Turbopack environments, the structural `next.config.ts` explicitly anchors the project (`turbopack: { root: process.cwd() }`) to eliminate catastrophic path resolution shifts caused by localized `pnpm` monorepo footprints, ensuring deterministic and hyper-fast dev/build cycles.
- **Internationalization (i18n):** Managed entirely client-side via `LanguageContext`. All strings, including dynamically injected parameters (like Notification titles and suffixes), must be mapped through this dictionary to guarantee zero hardcoded text strings in UI files.

## 6. Project Roadmap Checkpoint
- **[Phase 1] Prototype Replication:** Complete.
- **[Phase 2] Component Library Extraction:** Complete. (UI Kit is stable).
- **[Phase 3] Advanced Interactions (Template Engine):** Complete. Modal system is fully structuralized.
- **[Phase 4] Branding & Metrics Integration:** Complete. AI Credit and final desaturation passes applied.

*End of Document*
