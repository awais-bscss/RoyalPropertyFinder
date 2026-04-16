# 🔔 Royal Property Finder: Global Notification Matrix

This document provides a definitive list of which notifications are sent to **Administrators**, **Property Owners (Sellers)**, and **General Users (Buyers)**.

---

## 🚀 System Architecture
The notification system is a centralized, real-time-simulated (**30s polling**) engine that connects critical backend events to the frontend UI for all user roles.

---

## 🛡️ 1. Notifications For Administrators (Supervisors)
Administrators receive alerts for platform-wide events and items requiring review.

| Trigger Event | Notification Title | Message Content | Destination Link |
| :--- | :--- | :--- | :--- |
| **New User Registration** | 🎉 New User Registered | "[Name] ([Email]) has registered on the platform." | `/dashboard/admin/users` |
| **Listing Submission** | 🏠 New Listing Pending Approval | "[Name] has submitted a new property listing: [Title]" | `/dashboard/admin/listings` |
| **Property Reported** | 🚨 Listing Reported | "[Listing Title] reported for [Reason]." | `/dashboard/admin/reports` |
| **Contact Support Message** | 📬 New Support Inquiry | "Support request from [Name]: [Subject]" | `/dashboard/admin/inquiries` |
| **Property Inquiry Activity** | 📢 Global Inquiry Activity | "New inquiry by [Inquirer] for property: [Title]" | `/dashboard/admin/inquiries` |

---

## 🏠 2. Notifications For Property Owners (Sellers)
Owners receive alerts related to their managed properties and business leads.

| Trigger Event | Notification Title | Message Content | Destination Link |
| :--- | :--- | :--- | :--- |
| **Listing Approved** | ✅ Listing Approved! | "Your property listing [Title] has been approved and is now live." | `/dashboard/my-properties` |
| **Listing Rejected** | ❌ Listing Rejected | "Your property listing [Title] was rejected. Reason: [Reason]" | `/dashboard/my-properties` |
| **New Buyer Inquiry** | 📧 New Property Inquiry | "[Name] has sent an inquiry about your property: [Title]" | `/dashboard/inbox` |
| **New Message** | 💬 New Message from Admin | "You have a new message regarding your listing: [Title]" | `/dashboard/inbox` |

---

## 👤 3. Notifications For General Users (Buyers/Members)
Users receive alerts related to their account status and safety interactions.

| Trigger Event | Notification Title | Message Content | Destination Link |
| :--- | :--- | :--- | :--- |
| **Successful Sign-up** | 🏘️ Welcome to Royal Property! | "Welcome [Name]! Your account is active. Check settings to verify your email." | `/dashboard/settings` |
| **Report Submission** | 🛡️ Report Received | "Thank you for the report. Our team is investigating [Listing Title]." | `/dashboard/notifications` |
| **Reply to Inquiry** | 💬 New Response Received | "The owner/agent has replied to your inquiry about: [Title]" | `/dashboard/inbox` |

---

## 📝 Operational Summary
*   **Real-Time Polling**: All notifications auto-sync every **30 seconds** for a high-responsiveness experience.
*   **Storage Policy**: The system stores the last **100 notifications** per user for "Healthy Storage" (Old ones are auto-cleaned).
*   **Mark/Clear Actions**: Users can "Mark as Read", "Delete Single", or use the custom modal to "Clear Entire History".

---
**Status**: 🛡️ Global Notification Engine fully live and synchronized. 🛡️🚦✨🏆
