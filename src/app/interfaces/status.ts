import { Nestlocations } from "./nestlocations"

export interface Status {
    id: number,
    type: string,
    nestLocation?: Nestlocations
}
