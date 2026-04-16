# Property Search Implementation Guide (v2.0)

This document explains the technical implementation of the Royal Property Finder search engine, how it evaluates matches, and how the frontend and backend interact.

## 1. Technical Architecture

The search engine uses a **Server-Side Filtering** approach to ensure scalability and high performance even with large volumes of data.

### **A. Backend (MongoDB & Express)**
The core search logic resides in the `getAllListings` controller (`backend/src/modules/listing/listing.controller.ts`).
*   **Database Query**: It uses `Listing.find(filter)` to fetch only the properties that meet the user's criteria.
*   **Regex Matching**: For the keyword search, it uses a case-insensitive regular expression (`RegExp`) to find matches within multiple text fields.
*   **Range Queries**: It uses MongoDB operators like `$gte` (Greater than or equal) and `$lte` (Less than or equal) for price and area filtering.

### **B. Frontend (Next.js)**
*   **Hero Section**: Captures user inputs and redirects using `router.push('/properties?params...')`.
*   **Properties Page (Suspense Wrapped)**: Uses `useSearchParams` to extract filters from the URL. To prevent Next.js "RSC Payload" errors, the entire component is wrapped in a `<Suspense />` boundary.
*   **State Sync**: The page automatically triggers a re-fetch of data whenever the URL parameters change.

---

## 2. Advanced Mapping Logic (UI to Database)

To ensure the user interface remains friendly, the backend intelligently maps human-readable frontend categories to their database technical equivalents.

### **A. Category Mapping (propertyTypeTab)**
The frontend uses uppercase and plural terms for the UI tabs, which the backend maps to singular lowercase values in MongoDB:

| Frontend UI (Hero) | Database Value |
| :--- | :--- |
| **HOMES** | `home` |
| **PLOTS** | `plot` |
| **COMMERCIAL** | `commercial` |

### **B. Purpose Mapping**
The frontend sends user-friendly search intents which the backend translates:

| Frontend UI Intent | Database Value |
| :--- | :--- |
| **buy** | `Sell` |
| **rent** | `Rent` |

---

## 3. How Matching Works (The "Match" Rules)

### **A. Keyword Matching (OR Logic)**
A property matches if the keyword appears in **ANY** of these 6 fields:
1.  **Title**: Property headline.
2.  **Description**: Detailed text.
3.  **Location**: Area or society name.
4.  **City**: Name of the city.
5.  **Subtype**: Property type (e.g., House, Flat).
6.  **Property ID**: Unique ID (e.g., RP-1001).

### **B. Filter Matching (AND Logic)**
For dropdowns, a property is ONLY shown if it matches **ALL** selected filters:
*   **Purpose**: Exact match required (Sell vs Rent).
*   **City**: Matches the selected city (case-insensitive).
*   **Property Type**: Matches the specific subtype (e.g., "Flat").
*   **Price Range**: Property price $\ge$ Min Price AND $\le$ Max Price.
*   **Area Range**: Property size falls within the selected Marla/Kanal range.
*   **Bedrooms**: Matches the exact number selected.

---

## 4. Range Translation

Simplified UI ranges are converted to raw numbers for the database:

| UI Selection | Database Query (Example) |
| :--- | :--- |
| **Up to 1 Crore** | `price: { $lte: 10,000,000 }` |
| **1 – 5 Crore** | `price: { $gte: 10,000,000, $lte: 50,000,000 }` |
| **20+ Crore** | `price: { $gte: 200,000,000 }` |

---

## 5. Security & Availability
Only properties meeting these conditions are displayed:
1.  **Status**: `approved` (Pending or Rejected items are hidden).
2.  **Activity**: `isActive: true` (Deactivated items are hidden).

---

## Summary
The search system is built for **human flexibility** but **database precision**. It ensures that users can find properties using natural search terms while maintaining strict production standards.
