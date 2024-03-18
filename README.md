# TravelWidget

TravelWidget is a JavaScript project that helps users track traffic time from point A to point B. This widget is compatible with iOS devices using the Scriptable app.

## Features

- Fetches real-time traffic data using the Bing Maps API.
- Calculates estimated travel time based on traffic conditions.
- Displays travel time on a widget for quick access.
- Notifies users when traffic conditions are good (14 minutes or less).

## Installation

To use the TravelWidget project, follow these steps:

1. Install the Scriptable app from the App Store on your iOS device.
2. Download the TravelWidget script file (`TravelWidget.js`) from this GitHub repository.
3. Open the Scriptable app and import the `TravelWidget.js` script.
4. Add a new widget to your home screen and select the TravelWidget script.

## Usage

1. Open the Scriptable app and import the script `SetKeychain.js`. Assign it an API key name and enter its value when prompted.
2. Set the latitude and longitude values for the origin point of your trip: `originLatitude` and `originLongitude`.
3. Repeat the process for the destination you wish to track: `destinationLatitude` and `destinationLongitude`.
4. After adding the widget to your home screen, tap on the widget to open the Scriptable app.
5. Enter the starting point (point A) and destination (point B) for which you want to track traffic time.
6. The widget will display the estimated travel time based on real-time traffic data.

## Configuration

You can customize the appearance and behavior of the TravelWidget by modifying the following in the `TravelWidget.js` script:

- `shouldRefreshWidget()`: Set the interval (in minutes) for widget refresh and travel time update.

Note: The origin coordinates are obtained from the user's location. Ensure Scriptable's location access is enabled.

## Dependencies

The TravelWidget project requires:

- Scriptable app for iOS.
- Bing Maps API key for accessing real-time traffic data.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- This project uses the [Bing Maps API](https://learn.microsoft.com/en-us/bingmaps) for fetching traffic data.