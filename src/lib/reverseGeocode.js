export async function getLocationName(lat, long) {
    try {
        const url = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

        const params = new URLSearchParams({
            latitude: lat,
            longitude: long
        });

        const response = await fetch(`${url}?${params}&localityLanguage=en`);

        const responseData = await response.json();
        return responseData.locality + ", " + responseData.principalSubdivision + ", " + responseData.countryCode;

    } catch (error) {
        console.log("Error getting location reverse geocode: " + error);
    }
}