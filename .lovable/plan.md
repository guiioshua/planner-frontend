# Planner de Casamento — MVP Implementation Plan

- **Language of the website:** Portuguese

## Design System & Foundation

- **Typography**: Playfair Display (serif) for all headings; Inter 300/400 weight for body text
- **Palette**: Ivory (`#FFFFF0`) background, Charcoal (`#2C2C2C`) text, muted Champagne (`#D4C5A9`) accents
- **UI Elements**: Rectangular buttons with 2px border-radius and 1px charcoal borders; fine-line botanical sketch decorations as SVG accents
- **Layout**: Generous white space, mobile-first responsive design

## Architecture & Data Layer

- All data managed via React local state with mock arrays
- Dedicated **service hooks** per module (`useInvitations`, `useGuests`, `useGifts`, `useVendors`) that encapsulate all CRUD operations — designed to be swapped for Java Spring API calls later
- No authentication — direct access to admin views

---

## Page 1: Landing / Dashboard (Admin Home)

The couple's command center with an elegant, at-a-glance summary:

- **Summary Cards**: Total Invitations, Confirmed Guests, Pending RSVPs, Declined, Total Godparents confirmed
- **Budget Overview**: Total vendor costs vs. amount paid, with remaining balance
- **Quick Actions**: Create Invitation, Add Gift, Add Vendor

## Page 2: Invitations Management

- **Table/List view** of all invitations (family name, type badge: Standard/Godparent, guest count, confirmation status)
- **Filter tabs**: All / Standard / Godparents
- **Create/Edit Invitation dialog**:
  - Family name, type selection (Standard or Godparent)
  - Cover image URL and personalized message fields
  - Add/remove people (name + phone) within the invitation
- **Per-invitation actions**: Copy RSVP link, Open WhatsApp share (via `wa.me` API), Edit, Delete
- Auto-generated unique slug/hash per invitation

## Page 3: Guest List

- **Full table** of all individual guests across all invitations
- Columns: Name, Phone, Invitation (family), Type, Status (Pending/Confirmed/Declined)
- **Filters**: By status, by type (Standard/Godparent)
- Inline status indicator with color-coded badges

## Page 4: Gift Registry (Admin)

- **Grid of gift cards** with image, name, and purchase link
- **Add/Edit Gift dialog**: Name, purchase URL, image URL (manual input for MVP — no scraping in frontend prototype)
- Toggle gift active/inactive

## Page 5: Vendors / Financial

- **Table of vendors**: Company, Service Category, Contact, Phone, Total Price, Amount Paid, Balance
- **Add/Edit Vendor dialog** with all fields including notes
- **Financial summary bar** at top: Total Budget, Total Paid, Remaining Balance

## Page 6: Public RSVP Page (`/rsvp/:slug`)

A beautiful, guest-facing page — the heart of the classical aesthetic:

- Displays the invitation's **cover image** and **personalized message**
- Lists all people in the invitation with a toggle switch per person (Confirm / Decline)
- **"Confirm" button** to save selections
- After confirmation: success state with a **"View Gift Registry"** button linking to a public gift list view

## Page 7: Public Gift List (`/gifts/:slug`)

- Elegant grid of active gifts (image, name, external purchase link button)
- Accessible only after RSVP confirmation (checked via invitation status in local state)

---

## Navigation

- **Admin sidebar** with links: Dashboard, Invitations, Guests, Gifts, Vendors
- Public pages (`/rsvp/:slug`, `/gifts/:slug`) have no sidebar — standalone elegant layouts with botanical accents