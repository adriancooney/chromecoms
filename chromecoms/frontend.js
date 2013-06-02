var coms = {
	/**
	 * Send a message to the backend
	 * @param  {String}   eventName The event/handler name to trigger
	 * @param  {*}   	  val       Data to sent to the handler. Functions will not be sent.
	 * @param  {Function} callback  Callback with response parameter
	 * @example
	 * 	coms.send("frontendData", { someData: 1 }, function(response) {
	 * 		console.log(response); //Thanks!
	 * 	})
	 */
	send: function(eventName, val, callback) {
		var obj = {};
		obj[eventName] = val;
		chrome.runtime.sendMessage(obj, callback);
	},

	/**
	 * Handlers store <eventName>:<callback>
	 * @type {Object}
	 */
	handlers: {},

	/**
	 * Handl incoming events from the backend
	 * @see Backend.js coms.handle function
	 */
	handle: function(message, callback) {
		if(typeof message == "object") {
			for(var key in message) coms.handlers[key] = message[key];
		} else if(typeof message == "function") {
			coms.handlers["*"] = message;
		} coms.handlers[message] = callback;
	},


	/**
	 * Initilize the listener.
	 */
	init: function() {
		chrome.runtime.onMessage.addListener(function(request, sender, respond) {
			//Call the wild card if it exists
			if(coms.handlers["*"]) coms.handlers["*"].call(coms, request, sender, respond);

			//Loop over the request object and call a handler if one exists
			for(var key in request) if(coms.handlers[key]) coms.handlers[key].call(coms, request[key], sender, respond);
		});
	}
};

coms.init();	