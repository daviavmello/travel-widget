async function getTrafficData() {
  console.log("Start");

  const getHours = minutes => Math.floor(minutes / 60);
  const getMinutes = minutes => Math.round(minutes % 60);

  const homeLatitude = 28.8033899;
  const homeLongitude = -81.3509408;
  const latitude = 27.9782556;
  const longitude = -82.3340117;

  // Construct the API request URL
  const url = `https://dev.virtualearth.net/REST/v1/Routes/Driving?wayPoint.1=${latitude},${longitude}&wayPoint.2=${homeLatitude},${homeLongitude}&du=mi&key=${bingMapsKey}`;

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

    // console.log(`Travel Duration: ${hours}h${minutes}min`);
    // console.log(`Traffic: ${getMinutes(trafficInMinutes) - getMinutes(durationInMinutes)} minutes`);
    console.log(trafficInMinutes - durationInMinutes);
    console.log(trafficInMinutes, durationInMinutes);
  } catch (error) {
    console.error("Error:", error);
  }
}

getTrafficData();