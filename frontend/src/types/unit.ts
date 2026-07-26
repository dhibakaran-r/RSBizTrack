// Shape of data coming FROM the API (response)
export interface Unit {
  id: number;
  name: string;
  shortName: string;
}

// Shape of data going TO the API (create)
export interface UnitCreate {
  name: string;
  shortName?: string;
}

// Shape of data going TO the API (update)
export interface UnitUpdate {
  name?: string;
  shortName?: string;
}