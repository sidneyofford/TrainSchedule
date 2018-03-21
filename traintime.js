
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAWfLzjSsd9-YUjoZEIZc6wSbB-azyNlPY",
    authDomain: "traintime-d4770.firebaseapp.com",
    databaseURL: "https://traintime-d4770.firebaseio.com",
    projectId: "traintime-d4770",
    storageBucket: "",
    messagingSenderId: "118101920571"
  };
  firebase.initializeApp(config);

var trainData = firebase.database();

// 2. Populate Firebase Database with initial data (in this case, I did this via Firebase GUI)

// 3. Button for adding trains
$("#addTrainBtn").on("click", function(){

	// Grabs user input
	var trainName = $("#trainNameInput").val().trim();
	var destination = $("#destinationInput").val().trim();
	var firstTrainUnix = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
	var frequency = $("#frequencyInput").val().trim();

	// Creates local "temporary" object for holding train data
	var newTrain = {
		name:  trainName,
		destination: destination,
		firstTrain: firstTrainUnix,
		frequency: frequency
	}

	// Uploads train data to the database
	trainData.ref().push(newTrain);

	// Logs everything to console
	console.log(newTrain.name);
	console.log(newTrain.destination); 
	console.log(firstTrainUnix);
	console.log(newTrain.frequency)

	// Alert
	alert("Train successfully added");

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainInput").val("");
	$("#frequencyInput").val("");

	// Determine when the next train arrives.
	return false;
});


// 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var locoName = childSnapshot.val().name;
	var locoDestination = childSnapshot.val().destination;
	var locoFrequency = childSnapshot.val().frequency;
	var locoFirstTrain = childSnapshot.val().firstTrain;

	// Calculate the minutes until arrival using hardcore math
	// To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
	var differenceTimes = moment().diff(moment.unix(locoFirstTrain), "minutes");
	var locoRemainder = moment().diff(moment.unix(locoFirstTrain), "minutes") % locoFrequency ;
	var locoMinutes = locoFrequency - locoRemainder;

	// To calculate the arrival time, add the locoMinutes to the currrent time
	var locoArrival = moment().add(locoMinutes, "m").format("hh:mm A"); 
	console.log(locoMinutes);
	console.log(locoArrival);

	console.log(moment().format("hh:mm A"));
	console.log(locoArrival);
	console.log(moment().format("X"));

	// Add each train's data into the table 
	$("#trainTable > tbody").append("<tr><td>" + locoName + "</td><td>" + locoDestination + "</td><td>" + locoFrequency + "</td><td>" + locoArrival + "</td><td>" + locoMinutes + "</td></tr>");

});

