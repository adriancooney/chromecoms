console.log("Handling event 'backendData'");
// Handle data from the backend with the backendData event
coms.handle("backendData", function(data, sender, respond) {
	console.log("Data from the backend!", data);

	// Respond with a string
	respond("Data recieved --Frontend");
});

console.log("Sending event 'frontendData'");
//Send data to the back end
coms.send("frontendData", { foo: "bar" }, function(response) {

	// The backend responded with the 'respond' function
	console.log("Response from the backend!", response);
});

