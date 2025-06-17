import { locationData } from "./locations";

export const eligibleDistricts = locationData.map(
  (location) => location.district
);
