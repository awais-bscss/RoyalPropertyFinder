# 🚨 Royal Property Finder: Listing Report System (Safety & Moderation)

This document explains the technical architecture, API endpoints, and moderation workflow for the **Listing Report System**.

---

## 🚀 Overview
The Listing Report system allows users to flag suspicious, incorrect, or fraudulent properties. It provides a real-time moderation bridge between platform users and Administrators.

---

## 🛠️ API Architecture (`/api/v1/listing-reports`)

### 📦 1. Data Model (`listingReport.model.ts`)
Each report record stores the following critical data:
*   **Listing**: The property being flagged (ID reference).
*   **Reporter**: The user who submitted the flag (Self-ID).
*   **Reason**: Categorized reason (SCAM, INACCURATE_PRICE, AGENT_NOT_RESPONDING, OTHER).
*   **Description**: Detailed text provided by the user (Full Report).
*   **Status**: `pending` (Default), `resolved`, or `ignored`.

### 📡 2. Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/:listingId` | Submit a flag for a property. | Private |
| **GET** | `/all` | Fetch all reports with listing/reporter data. | Admin Only |
| **PATCH** | `/:id/status` | Update status (Resolve / Ignore). | Admin Only |
| **DELETE** | `/:id` | Permanently remove a report record. | Admin Only |

---

## ⚡ Automated Workflow & Notifications

The system is fully integrated with the **Global Notification Engine**:

### 1️⃣ On Submission (`POST /:listingId`)
*   **Admin Alert**: All platform administrators receive a **🚨 New Property Report** alert. This includes a direct link to the Reports Management tab.
*   **Reporter Alert**: The user receives a **🛡️ Report Submitted** confirmation via their notification bell.

### 2️⃣ On Resolution (`PATCH /:id/status`)
*   **Status Sync**: The record is updated in the database and the dashboard UI reflects the new state immediately.

---

## 🖥️ Administrator Management (The Reports Tab)

Administrators manage these reports via the **Reports Tab** in the Admin Dashboard.

### 🔍 How to View a Full Report:
1.  **Dashboard Table**: Admins can see the property thumbnail, title, reason, and reporter info.
2.  **Full Text**: The `description` is displayed in italics. If it is long, hovering the mouse over it reveals the **Full Tooltip**.
3.  **Property Link**: Admins can click **"View Listing"** to open the reported property in a new tab for investigation.
4.  **Three-Dot Menu (⋮)**: Provides quick actions to "Mark Resolved", "Ignore", or "Delete" the report.

---

## 📝 Performance Notes
*   **Eager Loading**: The system uses `.populate()` to fetch the property title, images, and the reporter's contact info (Name/Email) in a single API call for maximum performance.
*   **Safety Lock**: Only the Admin who resolves a report can change its status or delete it.

---

**Status**: 🚨 Safety & Moderation Engine fully live. 🛡️🚦✨🏆
