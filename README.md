# ChromeComs
### Making messaging between content and background scripts manageable.
ChromeComs is a small framework of two files that makes messaging between content scripts and background scripts manageable in Chrome Extensions.

## Getting started
To get started with ChromeComs, added chromecoms to your extensions and include them in the `manifest.json` in their respective locations.

	{
		content_scipts: [{
			"js": ["chromecoms/frontend.js", <your other scripts>]
		}],

		background: {
			"scripts": ["chromecoms/backend.js", <your other scripts>]
		}
	}

Once they're added, the `coms` variables will appear in your Content Script and your Background Script. Take a look at the examples manifest file in `example/`.

## API
ChromeComs api was designed to be as simple as possible and consistent between the content and background scripts. What you see below is the same for the content and background scripts. 

#### coms.send( *eventName (string)*, *data (object/string/array/boolean)*[, *callback (function)*])
`coms.send` is the method for transporting data down the wire to the corresponding script for handling on the other side.

	coms.send("userUpdate", userObj, function(response) {
		//response is what is sent from the respond() function on the corresponding event handler
	 	//When it handles the event
	});

#### coms.handle( *eventName (string)*, *callback (function)* )
`coms.handle` is the method for handling events received. Works much like you expect. Give it an event name and a callback. Callback arguments are `data` (the data sent), `sender` (information about the sender) and `respond` (function to respond to the data, `respond( *data* )`).

	coms.handle("frontendData", function(data, sender, respond) {
		console.log(data);
	
		respond("Thanks!");
	});

#### coms.handle( *eventObject (object)* )
Instead of passing just one event name and callback, you can provide an object in the form of `eventName: callback`.

	coms.handle({
		"frontendData": function(data, sender, respond) {
		
		},
	
		"moreData": function(data, sender, respond) {
		
		}
	});

#### coms.handle( *handler (function)* )
Handle all incoming events by providing a function.

	 coms.handle(function(request, sender, respond) {
	 	console.log(request); //Will be in the form of request[eventName] = data
	 });

See code for inline documentation.

## Troubleshooting
#### Error: Port: Could not establish connection. Receiving end does not exist. 
This is `coms` trying to send information to a content script that won't take it. This happens for example when you make a change to your extensions and have multiple tabs open where the content script is running but haven't refreshed them yet.
