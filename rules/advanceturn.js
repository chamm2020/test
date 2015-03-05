/**
 * @name advanceTurn
 */

/**
 * [advanceTurn function used in default game engine for determining next player turn]
 * @return {[void]} [description]
 */
function advanceTurn() {
	document.getElementById("turnStatus").innerHTML = "";
	var turnFlag = false;
	for (var i = 0; i < activeObjects.length; i++) {
		if ((activeObjects.isWithinMaxDistance && activeObjects.isWithinMaxDistance()) || activeObjects[i].constructor === Player) {
			activeObjects[i].turnCounter += activeObjects[i].initiative;
		}

		if (activeObjects[i].turnCounter > MAX_TURN_COUNTER && !turnFlag) {
			activeObjects[i].turn();
			turnFlag = true;
			if (activeObjects[i].constructor === Player) {
				activePlayer = activeObjects[i];
			}
		}

		document.getElementById("turnStatus").innerHTML = document.getElementById("turnStatus").innerHTML + "<br>" + activeObjects[i].turnCounter + " / " + MAX_TURN_COUNTER;
	}
}