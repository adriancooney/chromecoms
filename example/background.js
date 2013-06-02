// Handle data from the frontend
coms.handle("frontendData", function(data, sender, respond) {
	console.log("Frontend data!", data);

	// Respond to the data
	respond("Thanks dude. --Backend");
});

//Let's wait a couple of seconds and send some data
setTimeout(function() {
	// Send some data to the front end
	coms.send("backendData", { bar: "foo" }, function(response) {
		console.log("Response from frontend!", response);
	})
}, 10000)