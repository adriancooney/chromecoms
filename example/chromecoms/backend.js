var coms = {
	/**
	 * Sends a message to the frontend
	 * @param  {String}   eventName The event/handler name to trigger
	 * @param  {*}   	  val  		Data to be sent to the frontend. Functions won't be sent.
	 * @param  {Function} callback  Callback is a response is sent
	 * @param  {Array}    matches   Array of URL patterns to send against
	 * @example
	 * 	coms.send("userUpdate", userObj, function(response) {
	 * 		//response is what is sent from the respond() function on the client side
	 * 		//When it handles the event
	 * 	});
	 */
	send: function(eventName, val, callback, matches) {
		if(callback instanceof Array) matches = callback, callback = undefined;

		//Get the tabs to match against and duplicate the array
		var tabs = [], tempArr = coms.matches.filter(function(e) { return true; });
		(function getTabs(matches) {
			var match = matches[0];

			if(match) {
				chrome.tabs.query({
					url: match
				}, function(tabsGot) {
					//Add the tabs to the array
					tabs = tabs.concat(tabsGot);

					//Pop that match
					matches.shift();

					//And recur
					getTabs(matches);
				})
			} else {
				//And sent the message to the tabs
				tabs.forEach(function(tab) {
					sendMessage(tab.id)
				});
			}
		})(tempArr || matches);

		function sendMessage(tabId) {
			try {
				//Conform it to <message>:<name> for easy parsing
				//in the frontend.
				var obj = {}
				obj[eventName] = val;
				chrome.tabs.sendMessage(tabId, obj, callback);
			} catch(e) {
				console.log("Error!", e);
			}
		}
	},

	/**
	 * Handlers store <eventName>:<callback>
	 * @type {Object}
	 */
	handlers: {},

	/**
	 * Handle incoming events from the frontend
	 * @param  {String}   message  The string to bind the handler to
	 * @param  {Function} callback The function to be executed when message recieved. Parameters: (data, sender, respond)
	 * @example
	 * 	coms.handle("frontendData", function(data, sender, respond) {
	 * 		console.log(data);
	 *
	 * 		respond("Thanks!");
	 * 	});
	 *
	 * @param {Function} message Binds to all incoming messages
	 * @example
	 * 	coms.handle(function(request, sender, respond) {
	 * 		console.log(request); //Will be in the form of request[<eventname>] = <data>
	 * 	});
	 *
	 * @param {Object} message An object of events and their handlers
	 * @example
	 * 	coms.handle({
	 * 		"frontendData": function(data, sender, respond) {
	 * 		
	 * 		},
	 *
	 * 		"moreData": function(data, sender, respond) {
	 * 		
	 * 		}
	 * 	});
	 */
	handle: function(message, callback) {
		if(typeof message == "object") {
			for(var key in message) coms.handlers[key] = message[key];
		} else if(typeof message == "function") {
			coms.handlers["*"] = message;
		} coms.handlers[message] = callback;
	},

	/**
	 * Initilize the listeners and grab the manifest.
	 */
	init: function() {
		//Get where the content script runs so we
		//can query the chrome.tabs and return the tabs
		//its running on.
		var manifest = chrome.runtime.getManifest(),
			matches = [];

		//Combine all the routes to one array
		manifest.content_scripts.forEach(function(script) {
			matches = matches.concat(script.matches);
		});

		coms.matches = matches;

		//Handle all incoming message
		chrome.runtime.onMessage.addListener(function(request, sender, respond) {
			//Call the wild card if it exists
			if(coms.handlers["*"]) coms.handlers["*"].call(coms, request, sender, respond);

			//Loop over the request object and call a handler if one exists
			for(var key in request) if(coms.handlers[key]) coms.handlers[key].call(coms, request[key], sender, respond);
		});
	}
};

coms.init();



