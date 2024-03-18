async function getTrafficData() {
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
      trafficStack.font = Font.systemFont(10);
      trafficStack.cornerRadius = 12;
      trafficStack.setPadding(6, 6, 6, 6);

      let totalTimeStack = widget.addStack();
      totalTimeStack.setPadding(16, 0, 36, 0);
      let hoursText = totalTimeStack.addText(hours);
      hoursText.font = Font.boldSystemFont(36);
      let hText = totalTimeStack.addText('h')
      hText.font = Font.lightSystemFont(36);
      let minutesText = totalTimeStack.addText(minutes);
      minutesText.font = Font.boldSystemFont(36);
      let mText = totalTimeStack.addText('min')
      mText.font = Font.lightSystemFont(36);

      let lastRefreshedStack = widget.addStack();
      let lastRefreshedText = lastRefreshedStack.addText(`Last updated: ${getCurrentTime()}`);
      lastRefreshedText.font = Font.systemFont(12);

      const trafficStatusStyles = {
        'bad': {
          textColor: Color.white(),
          backgroundColor: new Color('#C52F22'),
          widgetBackgroundColor: new Color('#E94335'),
          emoji: '☠️',
          trafficTextColor: Color.white(),
          lastRefreshedTextColor: Color.white(),
        },
        'medium': {
          textColor: new Color('#202124'),
          backgroundColor: new Color('#F09E00'),
          widgetBackgroundColor: new Color('#FBBB05'),
          emoji: '⚠️',
          trafficTextColor: new Color('#202124'),
          lastRefreshedTextColor: new Color('#202124'),
        },
        'default': {
          textColor: Color.white(),
          backgroundColor: new Color('#0B7240'),
          widgetBackgroundColor: new Color('#0F9D58'),
          emoji: '✅',
          trafficTextColor: Color.white(),
          lastRefreshedTextColor: Color.white(),
        }
      };

      const statusStyle = trafficStatusStyles[trafficStatus] || trafficStatusStyles['default'];

      totalTimeText.textColor = statusStyle.textColor;
      trafficStack.backgroundColor = statusStyle.backgroundColor;
      widget.backgroundColor = statusStyle.widgetBackgroundColor;

      let statusEmojiText = trafficStack.addText(statusStyle.emoji);
      statusEmojiText.font = Font.semiboldSystemFont(14);

      let trafficTimeText = trafficStack.addText(`${trafficTime} ${trafficTime === 0 ? 'min' : 'mins'}`);
      trafficTimeText.font = Font.semiboldSystemFont(14);
      trafficTimeText.textColor = statusStyle.trafficTextColor;

      lastRefreshedText.textColor = statusStyle.lastRefreshedTextColor;

      trafficStack.spacing = 4;

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

function getCurrentTime() {
  // Get the current date and time
  const now = new Date();

  // Extract the hour and minute
  const hour = now.getHours();
  const min = now.getMinutes();

  // Format the hour and minute as strings, padding with a leading zero if necessary
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMin = min.toString().padStart(2, '0');

  // Combine the hour and minute into the desired format
  return `${formattedHour}:${formattedMin}`;
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
    url = `https://dev.virtualearth.net/REST/v1/Routes/Driving?wayPoint.1=${locationLatitude},${locationLongitude}&wayPoint.2=${originLatitude},${originLongitude}&du=mi&key=${bingMapsKey}&avoid=tolls`;
  } else {
    url = `https://dev.virtualearth.net/REST/v1/Routes/Driving?wayPoint.1=${locationLatitude},${locationLongitude}&wayPoint.2=${destinationLatitude},${destinationLongitude}&du=mi&key=${bingMapsKey}&avoid=tolls`;
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
