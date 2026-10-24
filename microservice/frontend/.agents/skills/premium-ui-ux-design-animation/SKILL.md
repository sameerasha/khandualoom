---
name: premium-ui-ux-design-animation
description: Standards, design references, and animation patterns for building visually polished, production-quality React applications with exceptional UI/UX. Covers modern design references (21st.dev, Aceternity UI, Magic UI, React Bits, shadcn/ui, Motion for React), micro-interactions, responsive mobile-first typography, smooth Framer Motion/Motion transitions, accessibility, and performance optimization. Use this skill when designing landing pages, dashboards, interactive components, micro-interactions, or animations.
---

# Premium UI/UX Design and Animation Skill

## 1. Objective

Create visually polished, production-quality React applications with exceptional UI/UX, consistent design systems, responsive layouts, meaningful animations, and accessible interactions.

---

## 2. Design Reference Websites

Use these websites as design references and component resources:

- **21st.dev** — [https://21st.dev/](https://21st.dev/)
- **Aceternity UI** — [https://ui.aceternity.com/](https://ui.aceternity.com/)
- **Magic UI** — [https://magicui.design/](https://magicui.design/)
- **React Bits** — [https://reactbits.dev/](https://reactbits.dev/)
- **shadcn/ui** — [https://ui.shadcn.com/](https://ui.shadcn.com/)
- **Motion for React** — [https://motion.dev/docs/react](https://motion.dev/docs/react)
- **Awwwards** — [https://www.awwwards.com/](https://www.awwwards.com/)
- **Dribbble** — [https://dribbble.com/](https://dribbble.com/)

---

## 3. UI Design Standards

1. **User Experience First**: Design the complete user experience before implementing individual components.
2. **Design Tokens**: Establish a consistent visual identity, including colors, typography, spacing, border radii, shadows, and component states.
3. **Elevated Aesthetics**: Prefer modern, clean, premium interfaces over generic default layouts.
4. **Utility-First Responsiveness**: Use Tailwind CSS for responsive, mobile-first styling (`sm:`, `md:`, `lg:`, `xl:`).
5. **Accessible Primitives**: Use shadcn/ui for accessible foundational components.
6. **Distinctive Interactions**: Reference 21st.dev, Aceternity UI, Magic UI, and React Bits for distinctive components and visual effects.
7. **System Consistency**: Maintain visual consistency across headers, sidebars, navigation, cards, tables, forms, dialogs, and buttons.
8. **Spatial Harmony**: Use appropriate whitespace, typography hierarchy, contrast, and visual grouping.
9. **State Polish**: Provide polished loading skeletons, empty states, error states, success feedback, and confirmation dialogs.
10. **Restraint Over Clutter**: Avoid excessive gradients, unnecessary glassmorphism, oversized headings, random colors, and decorative effects without a clear purpose.
11. **Usability Non-Negotiable**: Never sacrifice readability, accessibility, usability, or performance for visual effects.
12. **Thoughtful Adaptation**: Do not copy entire third-party websites. Adapt individual patterns to the application's requirements and design system.

---

## 4. Animation Standards

Use Motion for React when animation complexity justifies it. Its current package is `motion`, with React imports from `motion/react`.

```bash
npm install motion
```

### Approved Animation Use Cases:
- Page entrance and exit transitions.
- Staggered lists and card entrances.
- Hover and tap feedback.
- Animated navigation indicators.
- Dialog and dropdown transitions.
- Expandable panels and accordions.
- Scroll-triggered content reveals.
- Number counters and progress indicators.
- Loading and success feedback.
- Layout changes and drag interactions when appropriate.

### Motion Principles:
Prefer short, smooth, purposeful animations. Use CSS transitions for simple hover and focus effects instead of adding JavaScript animation unnecessarily.

**Recommended duration defaults:**
- **Micro-interactions:** approximately 120–220 ms.
- **Standard UI transitions:** approximately 180–300 ms.
- **Larger entrance transitions:** approximately 250–450 ms.
- Use spring animations selectively for natural motion (`stiffness: 300, damping: 25`).
- Avoid animating many unrelated elements simultaneously.
- Prefer `transform` and `opacity` animations for 60fps GPU acceleration.
- Avoid unnecessary layout-triggering animations (`width`, `height`, `margin`, `padding`).
- Respect `prefers-reduced-motion` media queries.
- Ensure all essential functionality works without animations.

---

## 5. Implementation Workflow

1. Identify the page purpose, target users, content hierarchy, and important actions.
2. Define the visual direction and reusable design tokens.
3. Review relevant design references for suitable patterns.
4. Select components compatible with React, TypeScript, Tailwind CSS, and the project's existing setup.
5. Inspect dependencies and licenses before integrating third-party source code.
6. Build responsive layouts and reusable components.
7. Implement animations with Motion or CSS as appropriate.
8. Integrate Redux Toolkit and API services without coupling business logic to presentation.
9. Verify keyboard navigation, screen-reader semantics, contrast, and reduced-motion behavior.
10. Run Jest tests, TypeScript checks, linting, and production builds.
11. Review the page at mobile, tablet, and desktop widths.
12. Refine spacing, typography, responsiveness, interaction states, and animation timing.

---

## 6. Component Integration Rules

- Prefer existing project components over installing duplicates.
- Review third-party component code before adding it.
- Adapt copied components to the existing design tokens and coding conventions.
- Use TypeScript interfaces for component props.
- Keep animations reusable when the same pattern appears in multiple places.
- Avoid adding large animation dependencies for effects achievable with CSS.
- Do not add multiple component libraries without a clear architectural reason.
- Verify all external dependencies and their compatibility with the installed React and Tailwind versions.

---

## 7. Definition of Done

The interface must be visually consistent, responsive, accessible, functional, tested, and performant. Animations must improve user feedback or comprehension rather than distract from the task. Do not claim a visual or functional test passed unless it was actually performed.
