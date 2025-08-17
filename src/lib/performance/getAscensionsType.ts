export interface AscentItemType {
    aid: number;
    ascension_type: string;
    ascent_name: string;
    attempts: number;
    created_at: string;
    date_climbed: string;
    grade: string;
    height_ft: number;
    style: string;
    uid: number;
    users: {
        public_id: string;
    }
}

export type NewAscension = Omit<AscentItemType, "aid" | "created_at" | "users">;