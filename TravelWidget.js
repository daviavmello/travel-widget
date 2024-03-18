async function getTrafficData() {
  const getHours = minutes => Math.floor(minutes / 60);
  const getMinutes = minutes => Math.round(minutes % 60);

  const location = await getLocation();
  const locationLatitude = location.latitude;
  const locationLongitude = location.longitude;
  const destinationLatitude = 27.9782556;
  const destinationLongitude = -82.3340117;
  const bingMapsKey = Keychain.get('travelWidget');

  // Construct the API request URL
  const url = `https://dev.virtualearth.net/REST/v1/Routes/Driving?wayPoint.1=${destinationLatitude},${destinationLongitude}&wayPoint.2=${locationLatitude},${locationLongitude}&du=mi&key=${bingMapsKey}`;

  // Make the API request
  try {
    const request = new Request(url);
    const response = await request.loadJSON();
    if (!response) {
      throw new Error('Failed to retrieve data');
    }

    // Extract travel distance and duration in minutes
    const travelDurationTraffic = (response.resourceSets[0].resources[0].travelDurationTraffic);
    const durationInMinutes = (response.resourceSets[0].resources[0].travelDuration / 60);
    const trafficInMinutes = (response.resourceSets[0].resources[0].travelDurationTraffic / 60);

    const hours = Math.floor(trafficInMinutes / 60);
    const minutes = Math.round(trafficInMinutes % 60);

    const trafficTime = Math.floor(trafficInMinutes - durationInMinutes);
    const trafficStatus = getTrafficStatus(trafficTime);

    if (shouldRefreshWidget()) {
      let widget = new ListWidget();
      let trafficStack = widget.addStack();
      let totalTimeStack = widget.addStack();
      let totalTimeText = totalTimeStack.addText(`${hours}h${minutes}min`);
      totalTimeText.font = Font.lightSystemFont(28);

      switch (trafficStatus) {
        case 'bad':
          // trigger notification
          totalTimeText.textColor = Color.white();
          trafficStack.addText('☠️');
          let badTrafficText = trafficStack.addText(`${trafficTime} ${trafficTime === 0 ? 'min' : 'mins'}`);
          badTrafficText.font = Font.semiboldSystemFont(18);
          widget.backgroundColor = new Color('#E94335');
          badTrafficText.textColor = Color.white();
          break;
        case 'medium':
          totalTimeText.textColor = new Color('#202124');
          trafficStack.addText('⚠️');
          let mediumTrafficText = trafficStack.addText(`${trafficTime} ${trafficTime === 0 ? 'min' : 'mins'}`);
          mediumTrafficText.font = Font.semiboldSystemFont(18);
          widget.backgroundColor = new Color('#FBBB05');
          mediumTrafficText.textColor = new Color('#202124');
          break;
        default:
          totalTimeText.textColor = Color.white();
          trafficStack.addText('✅');
          let goodTrafficText = trafficStack.addText(`${trafficTime} ${trafficTime === 0 ? 'min' : 'mins'}`);
          goodTrafficText.font = Font.semiboldSystemFont(18);
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
    }
  } catch (error) {
    console.error("Error:", error);
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
    if (minute === 0) {
      return true;
    }
  }
  return false;
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
