var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = msg;
  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  ships: [
    {locations: [0, 0, 0], hits: ["", "", ""]},
    {locations: [0, 0, 0], hits: ["", "", ""]},
    {locations: [0, 0, 0], hits: ["", "", ""]}
  ],
  shipsSunk: 0,
  shipLength: 3,
  fire: function(guess) {
    console.log("fire");
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("DOWN!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sunk my ship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
        do {
          locations = this.generateShip();
        } while (this.collision(locations));
        this.ships[i].locations = locations;
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      // horizontal
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      // vertical
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // horizontal
        newShipLocations.push(row + "" + (col + i));
      } else {
        // vertical
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};

var controller = {
  guesses: 0,
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my ships, in " + this.guesses + " guesses.");
        document.getElementById("guessInput").disabled = true;
        document.getElementById("fireButton").disabled = true;
      }
    }
  }
}

function parseGuess(guess) {
  if (guess !== null && guess.match(/^[A-G][0-6]$/g)) {
    var row = guess.charCodeAt(0) - 65;
    var column = guess.charAt(1);
    return row + column;
  }
  alert("Invalid input, please use format like: A0");
  return null;
}

const init = () => {
  var fireButton = document.getElementById("fireButton");
  if (fireButton) {
    fireButton.onclick = handleFireButton;
  }
  var guessInput = document.getElementById("guessInput")
  if (guessInput) {
    guessInput.onkeypress = handleKeyPress;
  }
  model.generateShipLocations();
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
	var guess;
  if (guessInput) {
    guess = guessInput.value;
    console.log(guess);
    controller.processGuess(guess);
    guessInput.value = "";
  }
}

function handleKeyPress(key) {
  var fireButton = document.getElementById("fireButton");
  if (key.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
window.onload = init;
