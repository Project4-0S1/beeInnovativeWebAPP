import { User } from "@auth0/auth0-angular";
import { Beehive } from "./beehive";

export interface UserBeehive {
    id: number;
    beehiveId: number;
    userId: number;
    beehive: Beehive;
    user: User;

}
