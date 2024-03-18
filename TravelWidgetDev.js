require('dotenv').config();

async function getTrafficData() {
  const originLatitude = process.env.ORIGIN_LATITUDE;
  const originLongitude = process.env.ORIGIN_LONGITUDE;
  const latitude = process.env.DESTINATION_LATITUDE;
  const longitude = process.env.DESTINATION_LONGITUDE;
  const bingMapsKey = process.env.BING_MAPS_KEY;

  // Construct the API request URL
  const url = `https://dev.virtualearth.net/REST/v1/Routes/Driving?wayPoint.1=${latitude},${longitude}&wayPoint.2=${originLatitude},${originLongitude}&du=mi&key=${bingMapsKey}&avoid=tolls`;

  // Make the API request
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data) {
      throw new Error('Failed to retrieve data');
    }

    // Extract travel distance and duration in minutes
    const distance = data.resourceSets[0].resources[0].travelDistance;
    const durationInMinutes = (data.resourceSets[0].resources[0].travelDuration / 60);
    const trafficInMinutes = (data.resourceSets[0].resources[0].travelDurationTraffic / 60);

    const hours = Math.floor(trafficInMinutes / 60);
    const minutes = Math.round(trafficInMinutes % 60);

    console.log(`Travel Duration: ${hours}h${minutes}min`);
    console.log(trafficInMinutes - durationInMinutes);
    console.log(trafficInMinutes, durationInMinutes);
  } catch (error) {
    console.error("Error:", error);
  }
}

getTrafficData();