// Create an alert with a title and message
let alert = new Alert();
alert.title = "Enter API Key";
alert.message = "Input your API secrets:";

// Add a text field to the alert
let apiKey = alert.addTextField("API key");
let apiValue = alert.addTextField("API value");

// Add a "Save" action to the alert
alert.addAction("Save");

// Add a "Cancel" action to the alert
alert.addCancelAction("Cancel");

// Present the alert and wait for the user to enter the API key or select an action
let actionIndex = await alert.present();
if (actionIndex === -1) {
  // User canceled the alert
  console.log("User canceled the alert.");
  return;
}
