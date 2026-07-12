# FlowSync Design System
Version: 1.0

---

# Overview

FlowSync follows a clean, modern SaaS dashboard aesthetic.

Design principles:

- Minimal UI
- Lots of whitespace
- Soft shadows
- Rounded corners
- Purple as primary brand color
- Accessible contrast
- Consistent 8pt spacing system
- Professional enterprise appearance

Every new component MUST follow this design system.

---

# Brand

Application Name:

FlowSync

Theme:

Minimal Enterprise Dashboard

Font:

Inter

Icons:

Lucide React

---

# Color Palette

## Primary

Primary
#A78BFA

Primary Hover
#8B5CF6

Primary Dark
#7C3AED

---

## Semantic Colors

Success
#34D399

Warning
#FBBF24

Danger
#F87171

---

## Neutral Colors

Background
#FAF7FF

Surface
#FFFFFF

Border
#E9E4F5

Primary Text
#1F2937

Secondary Text
#6B7280

Disabled Text
#A1A1AA

---

# Typography

Font Family

Inter

Never use multiple fonts.

---

## Headings

H1

32px

Bold

Used only once per page.

---

H2

24px

Semibold

Used for page titles.

---

H3

20px

Semibold

Section titles.

---

H4

18px

Medium

Card titles.

---

Body

16px

Regular

Default content.

---

Small

14px

Regular

Descriptions

Secondary information

Labels

---

Caption

12px

Medium

Helper text

Table metadata

Status descriptions

---

Overline

10px

Medium

Uppercase only.

---

# Spacing

Always use the 8pt grid.

Available spacing:

4
8
12
16
20
24
32
40
48
56
64
72
80
96
112
128
144
160

Never invent arbitrary spacing values.

---

# Border Radius

Small

8px

Inputs

Badges

Buttons

---

Medium

12px

Cards

Dropdowns

Dialogs

---

Large

16px

Dashboard cards

Containers

---

XL

20px

Side panels

---

XXL

24px

Large widgets

---

# Shadows

Small

0 1px 2px rgba(124,58,237,.08)

Medium

0 4px 12px rgba(124,58,237,.12)

Large

0 10px 24px rgba(124,58,237,.16)

Avoid harsh shadows.

---

# Buttons

## Primary

Background:
Primary Purple

Text:
White

Radius:
8px

Hover:
Primary Hover

Disabled:
Gray background

---

## Secondary

White background

Purple border

Purple text

Hover:

Light Purple background

---

## Outline

Transparent

1px Purple border

Purple text

---

## Ghost

Transparent

No border

Purple text

Hover:

Light purple background

---

## Danger

Red background

White text

Hover:

Darker red

---

Button Height

40px

Padding

Horizontal 16px

Vertical 10px

---

# Inputs

Every input has:

Height

40px

Radius

8px

Border

1px

---

States

Default

Gray border

---

Focused

Purple border

Soft glow

---

Error

Red border

Error text

---

Disabled

Gray background

Gray text

No interaction

---

Supported Inputs

Text Input

Password

Email

Number

Select

Date Picker

Textarea

Search

---

# Cards

Cards use

White background

16px radius

Medium shadow

24px padding

Border:
1px solid Border color

Never use colored backgrounds unless showing analytics.

---

# Badges

Small rounded pill.

Padding

Horizontal 10px

Vertical 4px

Categories

Low

Blue

Medium

Yellow

High

Orange

Critical

Red

Pending

Purple

Approved

Green

Rejected

Red

New

Blue

---

# Status Chips

Available

Green

Allocated

Blue

Reserved

Purple

Maintenance

Yellow

Lost

Red

Retired

Gray

Disposed

Gray

Inactive

Gray

Active

Green

Status chips always use:

Rounded pill

Small font

Medium weight

---

# Avatar

Circle

Available Sizes

24

32

48

64

Fallback

User initials

---

# Tables

Tables should always contain

Checkbox

Primary column

Supporting columns

Status

Actions

Actions use icon buttons only.

Row Height

56px

Header

Bold

Background

White

Hover

Very light purple

---

# Icons

Use only

Lucide React

Do not mix icon libraries.

Icon Size

18-20px

Default Color

Primary Purple

Inactive

Secondary Text

---

# Layout

Dashboard Layout

Sidebar

Fixed

Width

260px

---

Top Navbar

Height

72px

Sticky

---

Content

Padding

32px

---

Cards

Gap

24px

---

Grid

Desktop

12 columns

Tablet

8 columns

Mobile

4 columns

---

# Navigation

Sidebar uses

Icon

Label

Active indicator

Active background

Collapsed state supported

---

# Animations

Duration

200ms

Ease

ease-in-out

Hover

Scale

1.01

Buttons

Background transition

Cards

Shadow transition

Dropdown

Fade + Slide

Avoid long animations.

---

# Component Rules

Every component should:

Follow 8pt spacing

Use Inter

Use Lucide icons

Use proper semantic colors

Have hover states

Have disabled states

Support dark mode in the future

Be reusable

Never hardcode colors

Use design tokens

---

# Accessibility

Minimum touch target

40x40

Minimum contrast

WCAG AA

Focus rings

Visible

Keyboard navigation

Supported

Proper aria labels

Required

---

# Responsive Breakpoints

Mobile

<640px

Tablet

640px

Desktop

1024px

Large Desktop

1440px+

---

# Dashboard Style

The dashboard should feel similar to:

- Linear
- Stripe Dashboard
- Vercel Dashboard
- Notion
- Clerk Dashboard

Characteristics:

Large whitespace

Soft shadows

Rounded cards

Minimal borders

No unnecessary gradients

Subtle interactions

Professional enterprise appearance

---

# Code Standards

When generating UI:

- Use Tailwind CSS
- Use shadcn/ui where possible
- Use Lucide React icons
- Use reusable components
- Never inline styles
- Never hardcode colors
- Use CSS variables for theme tokens
- Keep components under 200 lines where practical
- Prefer composition over duplication

---

# Design Tokens

```ts
export const colors = {
  primary: "#A78BFA",
  primaryHover: "#8B5CF6",
  primaryDark: "#7C3AED",

  success: "#34D399",
  warning: "#FBBF24",
  danger: "#F87171",

  background: "#FAF7FF",
  surface: "#FFFFFF",
  border: "#E9E4F5",

  text: "#1F2937",
  textSecondary: "#6B7280",
  textDisabled: "#A1A1AA",
};
```

---

# AI Agent Instructions

Whenever generating a new page:

1. Follow this design system exactly.
2. Reuse existing components whenever possible.
3. Never invent new colors.
4. Never invent new spacing values.
5. Use semantic colors only.
6. Keep layouts clean and uncluttered.
7. Prefer cards over bordered containers.
8. Every page should feel like it belongs to the same application.
9. Maintain visual consistency across the entire project.
10. If a component is missing, create it following the principles in this document before using it.