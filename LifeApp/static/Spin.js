var svgns = "http://www.w3.org/2000/svg"; // SVG Namespace (in case we need it)
var slices = []; // Array of wheel slice objects
var numSlices = 10;  // Size of the circle slices
var isSpinning = false; // Is the arrow spinning?
var rotation = 0; // Arrow rotation
var currentSlice = 0; // Current slice the arrow is over
var wheel; // DOM Object for the spinner board
var arrow; // DOM Object for the spinner arrow
var spinButton; // DOM Object for the spin wheel <button>
var colors = ["#FF0000", "#FF6600", "#FF9933", "#FFFF00", "#99FF33", "#33CC33", "#00FFFF","#0000FF", "#9933FF", "#FF66FF"];

// Basic wheel "slice" object for drawing SVG
function Slice(num, parent) {
	// Set instance vars
	this.parent = parent;
	this.size = 360/numSlices;
	this.offset = num * this.size;
	this.id = "slice_"+num;
	// Draw the object
	this.object = this.create(num);
	this.parent.appendChild(this.object);
}

Slice.prototype = {
	create:function(num) {
		// Create a group to store the slice in
		var g = document.createElementNS(svgns, "g");
		// Create the slice object
		var slice = document.createElementNS(svgns, "path");
		slice.setAttributeNS(null, "id", this.id);
		var x1 = 200 + 180 * Math.cos(Math.PI*(-90+this.offset)/180);
		var y1 = 200 + 180 * Math.sin(Math.PI*(-90+this.offset)/180);
		var x2 = 200 + 180 * Math.cos(Math.PI*(-90+this.size+this.offset)/180);
		var y2 = 200 + 180 * Math.sin(Math.PI*(-90+this.size+this.offset)/180);
		slice.setAttributeNS(null, "d", "M 200 200 L "+x1+" "+y1+" A 180 180 0 0 1 "+x2+" "+y2+"  Z");
		// Randomize the color of the slice and finish styling
		slice.setAttributeNS(null, "fill", colors[num]);
		slice.setAttributeNS(null, "stroke", "#222222");
		slice.setAttributeNS(null, "style", "stroke-width:2px");
		// Add the slice to the group
		g.appendChild(slice);
		// Create the highlight for the slice
		var overlay = document.createElementNS(svgns, "path");
		overlay.setAttributeNS(null, "d", "M 200 200 L "+x1+" "+y1+" A 180 180 0 0 1 "+x2+" "+y2+"  Z");
		overlay.setAttributeNS(null, "fill", "#FFFFFF");
		overlay.setAttributeNS(null, "stroke", "#222222");
		overlay.setAttributeNS(null, "style", "stroke-width:1px");
		overlay.setAttributeNS(null, "opacity", "0");
		// Add the highlight for the slice to the group
		g.appendChild(overlay);
		return g;
	},
	toggleOverlay:function() {
		var overlay = this.object.childNodes[1];
		if (overlay.getAttribute("opacity") == 0) {
			overlay.setAttributeNS(null, "opacity", 0.75);
		}
		else {
			overlay.setAttributeNS(null, "opacity", 0);
		}
	}
};

// Toggle the spinning of the wheel
function toggleSpinning() {
	// Toggle the spinning animation
	if (isSpinning) {
		// Stop the arrow
		isSpinning = false;
		clearInterval(toggleSpinning.spinInt);
		spinButton.removeAttribute("disabled");
		var result = currentSlice+1;
		console.log(result);
		this_game.spin = result;
		$('#start_turn_button').prop('disabled', false);
	}
	else {
		// Start spinning the arrow
		isSpinning = true;
		toggleSpinning.spinInt = setInterval(spinWheel, 1000/60);
		// Set how long the wheel will be spinning
		var duration = Math.floor(Math.random() * 2000) + 1000;
		setTimeout(toggleSpinning, duration);
		// Disable the spin button
		spinButton.setAttribute("disabled", "true");
	}
}
// Animation step for spinning the wheel arrow
function spinWheel() {
	// Rotate the spinner arrow
	rotation = (rotation + 12) % 360;
	arrow.setAttributeNS(null, "transform", "rotate("+rotation+",200,200)");
	// Highlight the slice the arrow is above
	var newSlice = Math.floor(rotation / (360/numSlices));
	if (newSlice != currentSlice) {
		slices[currentSlice].toggleOverlay();
		slices[newSlice].toggleOverlay();
		currentSlice = newSlice;
		document.getElementById("spin-value").innerHTML = currentSlice+1;

	}
}


document.addEventListener("DOMContentLoaded", function() {
	// Get a handle to all necessary DOM elements
	wheel = document.getElementById("spinner-board"); // DOM Object for the spinner board
	arrow = document.getElementById("spinner-arrow"); // DOM Object for the spinner arrow
	spinButton = document.getElementById("spinner-button"); // DOM Object for the spin wheel <button>
	// Generate the wheel sections
	for (var i = 0; i < numSlices; i++) {
		slices[i] = new Slice(i, wheel);
	}
	// Highlight the first slice
	slices[0].toggleOverlay();
}, false);
