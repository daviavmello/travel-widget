# TravelWidget

TravelWidget is a JavaScript project that helps users track traffic time from point A to point B. This widget can be used in iOS devices with the Scriptable app.

## Features

- Fetches real-time traffic data using the Bing Maps API.
- Calculates the estimated travel time based on traffic conditions.
- Displays the travel time on a widget for quick access.
- Displays a notification when traffic is good (14 minutes or less).

## Installation

To use the TravelWidget project, follow these steps:

1. Install the Scriptable app on your iOS device from the App Store.
2. Download the TravelWidget script file (`SetKeychain.js`) from the GitHub repository.
3. Open the Scriptable app and import the script `SetKeychain.js` script and give it an API key name and enter in its value when prompted.
4. Download the TravelWidget script file (`TravelWidget.js`) from this GitHub repository.
5. Open the Scriptable app and import the `TravelWidget.js` script.
6. Add a new widget to your home screen and select the TravelWidget script.

## Usage

1. After adding the widget to your home screen, tap on the widget to open the Scriptable app.
2. Enter the starting point (point A) and destination (point B) for which you want to track traffic time.
3. The widget will display the estimated travel time based on real-time traffic data.

## Configuration

You can customize the appearance and behavior of the TravelWidget by modifying the following variables in the `TravelWidget.js` script:

- `destination${geographicalCoordinate}`: The destination location for the travel time calculation.
- `refreshInterval()`: The interval (in minutes) at which the widget should refresh and update the travel time.
Obs: the origin coordinates are pulled from user's location. User needs to accept Scriptable's request for location points.

## Dependencies

The TravelWidget project relies on the following dependencies:

- Scriptable app for iOS.
- Bing Maps API key for accessing real-time traffic data.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- This project utilizes the [Bing Maps API](https://learn.microsoft.com/en-us/bingmaps) for fetching traffic data.

## Contributing

Contributions to the TravelWidget project are welcome! To contribute, follow these steps:

1. Fork the GitHub repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push your changes to the forked repository (`git push origin feature/your-feature-name`).
5. Create a new Pull Request on GitHub.