async function getTrafficData() {
  const getHours = minutes => Math.floor(minutes / 60);
  const getMinutes = minutes => Math.round(minutes % 60);

  if (shouldRefreshWidget()) {
    // Make the API request
    try {
      const url = await getURLRequest();
      const request = new Request(url);
      const response = await request.loadJSON();
      if (!response) {
        throw new Error('Failed to retrieve data');
      }

      // Extract travel duration and traffic in minutes
      const durationInMinutes = (response.resourceSets[0].resources[0].travelDuration / 60);
      const trafficInMinutes = (response.resourceSets[0].resources[0].travelDurationTraffic / 60);

      const hours = Math.floor(trafficInMinutes / 60);
      const minutes = Math.round(trafficInMinutes % 60);

      const trafficTime = Math.floor(trafficInMinutes - durationInMinutes);
      const trafficStatus = getTrafficStatus(trafficTime);

      let widget = new ListWidget();
      let trafficStack = widget.addStack();
      trafficStack.cornerRadius = 12;
      trafficStack.setPadding(8, 8, 8, 8);
      let totalTimeStack = widget.addStack();
      let totalTimeText = totalTimeStack.addText(`${hours}h${minutes}min`);
      totalTimeText.font = Font.lightSystemFont(28);

      switch (trafficStatus) {
        case 'bad':
          totalTimeText.textColor = Color.white();
          trafficStack.backgroundColor = new Color('#BA352A');
          trafficStack.addText('☠️');
          let badTrafficText = trafficStack.addText(`${trafficTime} ${trafficTime === 0 ? 'min' : 'mins'}`);
          badTrafficText.font = Font.semiboldSystemFont(12);
          widget.backgroundColor = new Color('#E94335');
          badTrafficText.textColor = Color.white();
          break;
        case 'medium':
          totalTimeText.textColor = new Color('#202124');
          trafficStack.backgroundColor = new Color('#C99504');
          trafficStack.addText('⚠️');
          let mediumTrafficText = trafficStack.addText(`${trafficTime} ${trafficTime === 0 ? 'min' : 'mins'}`);
          mediumTrafficText.font = Font.semiboldSystemFont(12);
          widget.backgroundColor = new Color('#FBBB05');
          mediumTrafficText.textColor = new Color('#202124');
          break;
        default:
          // trigger notification
          totalTimeText.textColor = Color.white();
          trafficStack.backgroundColor = new Color('#0C7D46');
          trafficStack.addText('✅');
          let goodTrafficText = trafficStack.addText(`${trafficTime} ${trafficTime === 0 ? 'min' : 'mins'}`);
          goodTrafficText.font = Font.semiboldSystemFont(12);
          widget.backgroundColor =
            new Color('#0F9D58');
          goodTrafficText.textColor = Color.white();
      }

      trafficStack.spacing = 4;
      widget.addSpacer(10);

      if (config.runsInWidget) {
        // The script is running in a widget, so we save and return the widget
        Script.setWidget(widget);
        Script.complete();
      } else {
        widget.presentSmall();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.log('Script has not ran. Check its scheduled time.')
  }
}

async function getLocation() {
  // Attempts to get the user's current location
  const location = await Location.current();

  // Checks if the location object is empty or undefined
  if (!location || Object.keys(location).length === 0) {
    throw new Error("Failed to retrieve user's location");
  }
  return location;
}

function shouldRefreshWidget() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Check if it's Monday to Friday
  if (dayOfWeek < 1 || dayOfWeek > 5) return false;

  // Check if it's within the desired refresh times
  if ((hour >= 5 && hour < 8) || (hour >= 13 && hour < 19)) {
    // Check if it's the start of the hour
    if (minute % 10 === 0) {
      return true;
    }
  }
  return false;
}

// Function to get distance between two coordinates in miles
function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  // Convert degrees to radians
  const toRadians = (degrees) => degrees * Math.PI / 180;

  // Haversine formula
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInKilometers = R * c;

  // Convert kilometers to miles
  const distanceInMiles = distanceInKilometers * 0.621371;

  return distanceInMiles;
}

async function getURLRequest() {
  const location = await getLocation();
  const locationLatitude = location.latitude;
  const locationLongitude = location.longitude;
  const originLatitude = Keychain.get('originLatitude');
  const originLongitude = Keychain.get('originLongitude');
  const destinationLatitude = Keychain.get('destinationLatitude');
  const destinationLongitude = Keychain.get('destinationLongitude');
  const bingMapsKey = Keychain.get('travelWidget');

  const distanceToOrigin = getDistanceInMiles(locationLatitude, locationLongitude, originLatitude, originLongitude);
  const distanceToDestination = getDistanceInMiles(locationLatitude, locationLongitude, destinationLatitude, destinationLongitude);

  // Construct the API request URL
  let url = '';
  if (distanceToOrigin > distanceToDestination) {
    url = `https://dev.virtualearth.net/REST/v1/Routes/Driving?wayPoint.1=${locationLatitude},${locationLongitude}&wayPoint.2=${originLatitude},${originLongitude}&du=mi&key=${bingMapsKey}`;
  } else {
    url = `https://dev.virtualearth.net/REST/v1/Routes/Driving?wayPoint.1=${locationLatitude},${locationLongitude}&wayPoint.2=${destinationLatitude},${destinationLongitude}&du=mi&key=${bingMapsKey}`;
  }
  return url;
}

function getTrafficStatus(minutes) {
  if (minutes >= 40) {
    return 'bad';
  } else if (minutes >= 15) {
    return 'medium';
  } else {
    return 'good';
  }
}

await getTrafficData();
