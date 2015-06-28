require('./models/event');
var mongoose = require('mongoose');
var Calendar = mongoose.model('Calendar');

module.exports = function(app) {

	/**
     * API
     * 1. GET - gets all events
     * 2. GET - gets events for year
     * 3. POST - creates events for each date
     * 4. DELETE - remove events according to specified date
     */
	
    // 1. get all events
	app.get('/api/events', function(req, res) {
		console.log("getting all events...");
		
		// use mongoose to get all events in the database
		Calendar.find(function(err, events) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err) {
				res.send(err);
            }
			res.json(events); // return all events in JSON format
		});
	});
    
    // 2. get events for year
    app.get('/api/events/:year', function(req, res) {
		console.log("getting events for year " + req.params.year);
		Calendar.find({ year: req.params.year }, function(err, events) {
			if (err) {
				res.send(err);
            }
			res.json(events);
		});
	});
    
	// 3. create events and send back all events after creation
	app.post('/api/events', function(req, res) {
		console.log("creating events from request", req.body.dataEvents);
		
		// creates array of valid models
		var calendarItems = [];
		req.body.dataEvents.forEach(function (item) {
			var date = new Date(item.date);
			calendarItems.push({
				date: date,
		    	year: date.getFullYear(),
		    	event: item.event,
		    	message: item.message,
		    	note: item.note 
			});
		});
		
		// save list of events with one command
		Calendar.create(calendarItems, function (err, result) {
			if(err) {
				res.send(err);
			}
			res.json({status: "OK"});
		});
	});

	// 4. delete events
	app.delete('/api/events', function(req, res) {
		console.log("deleting events from request", req.body.dataEvents);
		
		var dates = req.body.dataEvents.map(function (d) {
			return new Date(d.date);
		});
		
		// delete items from database with one command
		Calendar.remove({ date: { $in: dates }}, function (err) {
			if(err) {
				res.send(err);
			}
			res.json({status: "OK"});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		console.log("loading index page...");
		res.sendfile('./public/index.html'); // load the single view file
	});
};
