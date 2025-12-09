import { getPublicId } from "./decodeToken"
import { AscentItemType } from "./performance/getAscensionsType";

export async function fetchAscensions() {
    const ascents = localStorage.getItem("ascents");
    if (ascents) return JSON.parse(ascents);

    const token = localStorage.getItem("token");

    if (!token) return [];

    const public_id = getPublicId(token);
    const response = await fetch(`/api/ascensions/getAscensions?public_id=${public_id}`);
    const data = await response.json();
    const sortedAscensions = data.data.sort((a: AscentItemType, b: AscentItemType) => {
        return new Date(b.date_climbed).getTime() - new Date(a.date_climbed).getTime();
    });

    localStorage.setItem("ascents", JSON.stringify(sortedAscensions));
    return sortedAscensions;
}