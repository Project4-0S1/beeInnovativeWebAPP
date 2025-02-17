import { Beehive } from "./beehive";
import { Hornet } from "./hornet";
import { UserBeehive } from "./user-beehive";

export interface HornetDetection {
    id: number;
    detectionTimestamp: Date
    IsMarked: Boolean;
    direction: number;
    hornetId: number;
    beehiveId: number;
    beehive?: Beehive; // Optional field for cases where it's null or unknown
    hornet?: Hornet
  }