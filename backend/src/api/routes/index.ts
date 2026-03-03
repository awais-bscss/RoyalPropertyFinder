import { Router } from "express";
import authRoutes from "../../modules/auth/auth.route";
import listingRoutes from "../../modules/listing/listing.route";
// import userRoutes from "../../modules/user/user.route";

const router = Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/listings",
    route: listingRoutes,
  }
  // { path: "/users", route: userRoutes } 
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
