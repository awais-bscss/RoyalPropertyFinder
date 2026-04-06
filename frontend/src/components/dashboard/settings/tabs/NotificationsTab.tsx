"use client";

import { SettingsCard } from "../components/SettingsCard";
import { ToggleRow } from "../components/ToggleRow";

export function NotificationsTab() {
  return (
    <div className="space-y-4">
      {/* Email Notifications */}
      <SettingsCard
        title="Email Notifications"
        description="Choose what you receive in your inbox."
      >
        <ToggleRow
          title="New Property Alerts"
          desc="Get notified when properties match your saved searches."
          defaultChecked={true}
        />
        <ToggleRow
          title="Inquiry Replies"
          desc="Email when someone replies to your property inquiry."
          defaultChecked={true}
        />
        <ToggleRow
          title="Order Updates"
          desc="Receive email updates about your Props Shop orders."
          defaultChecked={true}
        />
        <ToggleRow
          title="Marketing & Promos"
          desc="Hear about new features and discounts on Royal Property Finder."
          defaultChecked={false}
        />
        <ToggleRow
          title="Weekly Newsletter"
          desc="A weekly digest of top real estate news and trends."
          defaultChecked={false}
        />
      </SettingsCard>

      {/* In-App Notifications */}
      <SettingsCard
        title="In-App Notifications"
        description="Control what appears in your notification bell."
      >
        <ToggleRow
          title="New Messages"
          desc="Show a badge when you receive new inbox messages."
          defaultChecked={true}
        />
        <ToggleRow
          title="Listing Views"
          desc="Notify you when your listings get significant views."
          defaultChecked={true}
        />
        <ToggleRow
          title="Price Drop Alerts"
          desc="Alert when saved properties drop in price."
          defaultChecked={true}
        />
        <ToggleRow
          title="Listing Status Changes"
          desc="Notify you when a listing is approved, rejected, or expired."
          defaultChecked={false}
        />
      </SettingsCard>
    </div>
  );
}
