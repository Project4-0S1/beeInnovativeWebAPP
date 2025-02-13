import { UserBeehive } from "./user-beehive";

export interface Beehive {
    id: number;
    beehiveName: string;
    latitude: number;
    longitude: number;
    angle: number;
    iotId: string;
    lastCall: string;
    hornetDetections?: any; // Optional field for cases where it's null or unknown
    userBeehives?: UserBeehive; // Optional field for cases where it's null or unknown
  }