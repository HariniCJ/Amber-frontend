// src/app/ambulance/types.ts

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface HospitalAvailability {
  id: string;
  name: string;
  availability: number;
}

export interface BestHospital {
  id: string;
  name: string;
  coords: Coordinates;
  availability: number;
}

export interface RouteData {
  id: string;
  ambulanceLocation: Coordinates;
  bestHospitalId: string;
  bestHospital: BestHospital;
  routeCoordinates: Coordinates[];
  createdAt: string;
}

export interface Signal {
  index: number;
  latitude: number;
  longitude: number;
  status: string; // 'red' or 'green'
}
