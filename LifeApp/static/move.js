
Move.prototype.run = function() {

	var numPoints = this.data.length;
	var dotsPerSeg = 5;
	var i;

	var points = [];

	// Make a random list of waypoints for the animation to follow
	for (i=0; i<numPoints; i++) {
		points.push([(this_game.board.tiles[this.data[i]].x*(1020/2074))+210, (this_game.board.tiles[this.data[i]].y*(904/1856))+108]);
	}

	// -- Important bit #1: Generate the spline animation object --
	var spline = $.crSpline.buildSequence(points);
	
	// Clean up visuals if we've run this once already
	var mover_id = "#mover" + this.num;
	$(mover_id).remove();
	$(".waypoint").remove();
	$(".path-dot").remove();

	// Scary-looking stuff to visualize the waypoints and the trail of dots
	// NOT needed for animation
	for (i=0; i<numPoints; i++) {
		$('<div class="waypoint">' + i + '</div>')
			.appendTo($(document.body))
			.css({
				left: points[i][0],
				top: points[i][1],
				display: (this.showWaypoints ? "inline" : "none")
			});

		for (var j=0; j<dotsPerSeg; j++) {
			var t = (i + j/dotsPerSeg) / points.length;
			var pos = spline.getPos(t);
			$('<div class="path-dot" />')
				.appendTo($(document.body))
				.css({
					left: pos.left,
					top: pos.top,
					display: (this.showTrail ? "inline" : "none")
				});
		}
	}

	// -- Important bit #2: Actually animate our mover object. --
	$('<div id=\"mover' + this.num + '\" />')
		.appendTo($(document.body))
		.animate({ crSpline: spline }, 2000, function () {
			// Re-run the demo with a new spline after we're done
			console.log("done moving");
			this_game.Play_Turn();
		});
	
};
