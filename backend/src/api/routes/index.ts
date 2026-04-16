import { Router } from "express";
import authRoutes from "../../modules/auth/auth.route";
import listingRoutes from "../../modules/listing/listing.route";
import userRoutes from "../../modules/user/user.route";
import inquiryRoutes from "../../modules/inquiry/inquiry.route";
import listingInquiryRoutes from "../../modules/listingInquiry/listingInquiry.route";
import settingsRoutes from "../../modules/settings/settings.route";
import notificationRoutes from "../../modules/notification/notification.route";
import listingReportRoutes from "../../modules/listingReport/listingReport.route";

const router = Router();

const defaultRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/listings", route: listingRoutes },
  { path: "/listing-inquiries", route: listingInquiryRoutes },
  { path: "/users", route: userRoutes },
  { path: "/inquiries", route: inquiryRoutes },
  { path: "/settings", route: settingsRoutes },
  { path: "/notifications", route: notificationRoutes },
  { path: "/listing-reports", route: listingReportRoutes },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
