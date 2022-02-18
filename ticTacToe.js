function definePlaceValues(){

	you = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	opponent = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	emptyPlaces = [1, 1, 1, 1, 1, 1, 1, 1, 1];

	ids = ["place1", "place2", "place3", "place4", "place5", "place6", "place7", "place8", "place9"];

	hidden = ["hiddenFirst", "hiddenSecond", "hiddenThird", "hiddenFourth", "hiddenFifth", "hiddenSixth",
	          "hiddenSeventh", "hiddenEighth", "hiddenNinth"];

	winningStates = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [2,4,6], [3,4,5], [6,7,8]];

	finishState = false;
	colorSelect = false;
	userBeepOff = false;

	initialBodyScript = document.body.innerHTML;
}

function sum(list){

	return list.reduce((partialSum, a) => partialSum + a, 0);
}

function beep(){

	document.getElementById("beepUser").play();
}

function setName(){

	var usernameElement = document.getElementById('username');

	name = usernameElement.value;

	if (name.length > 5)

		name = name.substring(0, 5);

	else

		name = name.padStart(5, ' ');
	
	usernameElement.readOnly = true;

	usernameElement.value = name;
}

function colorSelection(){

	if (!colorSelect){

		window.alert("Select your color...");
	}
}

function select(place, color, text){

		var placeVar = document.getElementById(place);
		var ctx = placeVar.getContext('2d');

		placeVar.style.backgroundColor = color;
		ctx.font = "italic bold 50px calibri";

		if (text == "System")
			ctx.fillText("  System", 50, 90);

		else
			ctx.fillText(text, 80, 90);
}

function firstMoveByOpponent(){

	var aux = document.getElementById("hiddenFifth").value;

	if (aux == 0){

		opponent[4] = 1;

		emptyPlaces[4] = 0;

		select("place5", opponentColor, "System");

		document.getElementById("hiddenFifth").value += 1;
	}

}

function solveWinning(text){

	if (text == "opponent")
		var query = opponent;

	else
		var query = you;

	for (let ws=0;ws < winningStates.length;ws++){

		var counter = 0;

		for (let ele=0;ele < winningStates[ws].length;ele++){

			if (query[winningStates[ws][ele]])

				counter += 1;

			else

				var memory = winningStates[ws][ele];
		}

		if (counter == 2 && emptyPlaces[memory] == 1)

			return memory;
	}

	return ("not found");	
}

function goodSelection(){

	for (let ws=0;ws < winningStates.length;ws++){

		var counter = 0;
		var memory = []

		for (let ele=0;ele < winningStates[ws].length;ele++){

			if (opponent[winningStates[ws][ele]])

				counter += 1;

			else

				memory.push(winningStates[ws][ele]);
		}

		if (counter == 1 && (emptyPlaces[memory[0]] + emptyPlaces[memory[1]] == 2))

			return memory[Math.floor(Math.random() * 2)];	
	}

	return ("not found");	
}

function changeTurn(){

	// This function is trying to make the system winner or prevent the user being winner

	if (!finishState){

		// User did not select the middle place at the beggining of the game?! System will :)

		if (sum(you) == 1 && sum(opponent) == 0 && emptyPlaces[4] == 1){

			select(ids[4], opponentColor, "System");

			opponent[4] = 1;
			emptyPlaces[4] = 0;

			gameFinishChecker(opponent, "System");

			document.getElementById(hidden[4]).value += 1;
		}

		// At the beggining of the game, user selected the middle place. System will select one of the corners.

		else if (sum(you) == 1 && sum(opponent) == 0 && emptyPlaces[4] == 0){

			var allCorners = [1, 3, 7, 9];

			var randomCornerNo = Math.floor(Math.random() * 4);

			var corner = allCorners[randomCornerNo];

			select(ids[corner-1], opponentColor, "System");

			opponent[corner-1] = 1;
			emptyPlaces[corner-1] = 0;

			gameFinishChecker(opponent, "System");

			document.getElementById(hidden[corner-1]).value += 1;
		}

		// The rest of the game

		else{

			// Select a place that makes the system winner

			var idxToWin = solveWinning("opponent");

				if (idxToWin != "not found"){

					select(ids[idxToWin], opponentColor, "System");

					opponent[idxToWin] = 1;
					emptyPlaces[idxToWin] = 0;

					gameFinishChecker(opponent, "System");

					document.getElementById(hidden[idxToWin]).value += 1;
				}


			// Select a place that prevents the user being winner

			var idxToUserWin = solveWinning("you");

				if (idxToUserWin != "not found" && idxToWin == "not found"){

					select(ids[idxToUserWin], opponentColor, "System");

					opponent[idxToUserWin] = 1;
					emptyPlaces[idxToUserWin] = 0;

					gameFinishChecker(opponent, "System");

					document.getElementById(hidden[idxToUserWin]).value += 1;
				}


			// Select a place that puts you in a winning position for the next turn

			if (idxToWin == "not found" && idxToUserWin == "not found"){

				var idxForNextTurn = goodSelection();

				if (idxForNextTurn != "not found"){

					select(ids[idxForNextTurn], opponentColor, "System");

					opponent[idxForNextTurn] = 1;
					emptyPlaces[idxForNextTurn] = 0;

					gameFinishChecker(opponent, "System");

					document.getElementById(hidden[idxForNextTurn]).value += 1;
				}

				else{

					var extraMove = emptyPlaces.indexOf(1);

					if (extraMove != -1){

						select(ids[extraMove], opponentColor, "System");

						opponent[extraMove] = 1;
						emptyPlaces[extraMove] = 0;

						gameFinishChecker(opponent, "System");

						document.getElementById(hidden[extraMove]).value += 1;
					}
				}
			}
		}
	}
}

function gameFinishChecker(states, text="You"){

	var occupiedIndexes = [];
	var idx = states.indexOf(1);

	while (idx != -1) {

	  occupiedIndexes.push(idx);
	  idx = states.indexOf(1, idx + 1);
	}

	for (let j=0;j<winningStates.length;j++){

		var counter = 0;

		for (let k=0;k<3;k++){

			if (occupiedIndexes.includes(winningStates[j][k]))

				counter +=1;
		}

		if (counter == 3){

			finishState = true;

			if (text == "You"){

				document.getElementById("beepWin").play();
				console.log("You win");
				div = document.getElementById("div");
				div.innerHTML += `<center><canvas class="canvas" id="result"></canvas>
				<canvas class="canvas" id="restartBtn" onclick="restartGame()"></canvas></center>`;

				select("restartBtn", "yellow", "Restart");
				select("result", "pink", "  Win!");
			}

			else{

				document.getElementById("beepLose").play();
				console.log("You lose");
				div = document.getElementById("div");
				div.innerHTML += `<center><canvas class="canvas" id="result"></canvas>
				<canvas class="canvas" id="restartBtn" onclick="restartGame()"></canvas></center>`;

				select("restartBtn", "yellow", "Restart");
				select("result", "orange", " Lose!");
			}

			finishGame();

			break;
		}
	}

	if (emptyPlaces.reduce((partialSum, a) => partialSum + a, 0) == 0 && !finishState){

		console.log("You tied");
		div = document.getElementById("div");
		div.innerHTML += `<center><canvas class="canvas" id="result"></canvas>
		<canvas class="canvas" id="restartBtn" onclick="restartGame()"></canvas></center>`;

		select("restartBtn", "yellow", "Restart");
		select("result", "brown", "  Tie!");

		finishGame();
	}
}

function finishGame(){

	for (let hE=0;hE<hidden.length;hE++)

		document.getElementById(hidden[hE]).value = 1;

	document.getElementById("hidden1").value = 1;

	userBeepOff = true;
}

function restartGame(){

	document.body.innerHTML = initialBodyScript;

	you = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	opponent = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	emptyPlaces = [1, 1, 1, 1, 1, 1, 1, 1, 1];

	finishState = false;

	counter = 0;

	var usernameElement = document.getElementById('username');

	usernameElement.value = name;

	usernameElement.readOnly = true;

	if (userColor == "green")
		setPlayers1()

	else if (userColor == "red")
		setPlayers2()
}

function setPlayers1(){

	colorSelect = true;

	var aux = document.getElementById("hidden1").value;

	if (aux == 0){

		var greenPlayer = document.getElementById("greenPlayer").getContext("2d");
		var redPlayer = document.getElementById("redPlayer").getContext("2d");

		greenPlayer.font = "italic bold 73px calibri";
		greenPlayer.fillText("You", 85, 100);

		redPlayer.font = "italic bold 73px calibri";
		redPlayer.fillText("  System", 10, 100);

		userColor = "green";
		opponentColor = "red";

		document.getElementById("hidden1").value += 1;
	}
}

function setPlayers2(){

	colorSelect = true;

	var aux = document.getElementById("hidden1").value;

	if (aux == 0){

		var greenPlayer = document.getElementById("greenPlayer").getContext("2d");
		var redPlayer = document.getElementById("redPlayer").getContext("2d");

		greenPlayer.font = "italic bold 73px calibri";
		greenPlayer.fillText("  System", 10, 100);

		redPlayer.font = "italic bold 73px calibri";
		redPlayer.fillText("You", 85, 100);

		userColor = "red";
		opponentColor = "green";

		document.getElementById("hidden1").value += 1;

		firstMoveByOpponent();
	}
}

function firstPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenFirst").value;

	if (aux == 0 && colorSelect){

		you[0] = 1;

		emptyPlaces[0] = 0;

		select("place1", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenFirst").value += 1;
	}
}

function secondPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenSecond").value;

	if (aux == 0 && colorSelect){

		you[1] = 1;

		emptyPlaces[1] = 0;

		select("place2", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenSecond").value += 1;
	}
}

function thirdPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenThird").value;

	if (aux == 0 && colorSelect){

		you[2] = 1;

		emptyPlaces[2] = 0;

		select("place3", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenThird").value += 1;
	}
}

function fourthPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenFourth").value;

	if (aux == 0 && colorSelect){

		you[3] = 1;

		emptyPlaces[3] = 0;

		select("place4", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenFourth").value += 1;
	}
}

function fifthPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenFifth").value;

	if (aux == 0 && colorSelect){

		you[4] = 1;

		emptyPlaces[4] = 0;

		select("place5", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenFifth").value += 1;
	}
}

function sixthPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenSixth").value;

	if (aux == 0 && colorSelect){

		you[5] = 1;

		emptyPlaces[5] = 0;

		select("place6", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenSixth").value += 1;
	}
}

function seventhPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenSeventh").value;

	if (aux == 0 && colorSelect){

		you[6] = 1;

		emptyPlaces[6] = 0;

		select("place7", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenSeventh").value += 1;
	}
}

function eighthPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenEighth").value;

	if (aux == 0 && colorSelect){

		you[7] = 1;

		emptyPlaces[7] = 0;

		select("place8", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenEighth").value += 1;
	}
}

function ninthPlace(){

	colorSelection();

	var aux = document.getElementById("hiddenNinth").value;

	if (aux == 0 && colorSelect){

		you[8] = 1;

		emptyPlaces[8] = 0;

		select("place9", userColor, name);
		
		gameFinishChecker(you);

		beep();

		changeTurn();

		document.getElementById("hiddenNinth").value += 1;
	}
}