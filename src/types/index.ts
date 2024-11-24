// next-app/types/index.ts

import { Hospital, Route } from "@prisma/client";

export interface HospitalWithRoutes extends Hospital {
  routes: Route[];
}

export interface RouteWithHospital extends Route {
  bestHospital: HospitalWithRoutes;
}
