// Create an alert with a title and message
let alert = new Alert();
alert.title = "Keychain Store";
alert.message = "Input your secrets (data will be saved in your phone only):";

// Add a text field to the alert
let apiKey = alert.addTextField("Key");
let apiValue = alert.addTextField("Value");

// Add a "Save" action to the alert
alert.addAction("Save");

// Add a "Cancel" action to the alert
alert.addCancelAction("Cancel");

// Present the alert and wait for the user to enter the API key or select an action
let actionIndex = await alert.present();
if (actionIndex === -1) {
  // User canceled the alert
  console.log("User canceled the alert.");
  let alert = new Alert();
  alert.title = '❌ Data not saved!'
  alert.addCancelAction("Ok");
  return;
} else {
  let alert = new Alert();
  alert.title = '✅ Data was saved successfully!'
  alert.addCancelAction("Ok");
}