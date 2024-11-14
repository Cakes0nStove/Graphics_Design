var cells = []; // Array to store cell objects
var torn; // Variable to store the image

// Setup function - called once at the beginning
function setup() {
  createCanvas(700, 500, WEBGL); // Create a canvas with WEBGL renderer
  cells = createCells(4); // Create an initial set of cells
}

// Preload function - used to load external media before setup
function preload(){
  torn = loadImage('blood.jpg'); // Load the 'blood.jpg' image
}

// Draw function - continuously executed
function draw() {
  image(torn, -350, -250); // Display the 'torn' image on the canvas
  
  collideCells(cells); // Check for collisions between cells
  
  for (var i = 0; i < cells.length; i++) {
    cells[i].move(); // Move each cell
    cells[i].draw(); // Draw each cell
  }
}


function Cell(position, velocity, radius, maxaging) {
  // Constructor function for Cell objects
  this.position = position; // Position of the cell
  this.velocity = velocity; // Velocity of the cell
  this.r = radius; // Radius of the cell
  this.maxagaing = maxaging; // Maximum age of the cell
  this.color = color(random(100, 255), random(0, 255), random(100, 255)); // Random color for the cell
  this.age = 0; // Current age of the cell

  this.move = function () {
    // Method to move the cell
    this.edgedetect(); // Check if the cell is at the edge
    this.position.add(this.velocity); // Update the position based on velocity
    this.age++; // Increment the age of the cell
    if(this.age >= this.maxagaing){
      this.mitosis(); // Perform cell division if age exceeds maximum aging
    }
  }
  
  this.draw = function(){
    // Method to draw the cell
    ambientLight(60,0,0); // Set ambient light
    pointLight(
      255, 255, 255, // Light color
      0, 60, 0  // Light position
    );
    directionalLight(
      255,255,255, // Light color
      -1, 1, -1  // Light direction
    );
    push(); // Save the current drawing state
    translate(this.position.x, this.position.y, this.position.z); // Translate to cell's position
    fill('red'); // Set fill color
    noStroke(); // No stroke
    torus((this.age/2)/2); // Draw a torus representing the cell
    pop(); // Restore the previous drawing state
  }
  
  this.edgedetect = function(){
    // Method to detect if the cell is at the edge of the canvas
    if (this.position.x + this.r/2 > width/2 || this.position.x - this.r/2 < -width/2) {
        this.velocity.x = -this.velocity.x; // Reverse velocity if hitting the x-axis edge
    }
      
    if (this.position.y + this.r/2 > height/2 || this.position.y - this.r/2 < -height/2) {
        this.velocity.y = -this.velocity.y; // Reverse velocity if hitting the y-axis edge
    }

    if (this.position.z + this.r/2 > 0 || this.position.z - this.r/2 < -height/2) {
        this.velocity.z = -this.velocity.z; // Reverse velocity if hitting the z-axis edge
    }
  }

  this.mitosis = function(){
    // Method to create two new cells by cell division
    var newVelocity1 = this.velocity.copy().rotate(PI/4); // Create a new velocity by rotating the current velocity
    var newVelocity2 = this.velocity.copy().rotate(-PI/4); // Create another new velocity by rotating in the opposite direction
    cells.push(new Cell(this.position.copy(), newVelocity1, this.r/2, this.maxagaing)); // Create a new cell with the first new velocity
    cells.push(new Cell(this.position.copy(), newVelocity2, this.r/2, this.maxagaing)); // Create another new cell with the second new velocity
    cells.splice(cells.indexOf(this), 1); // Remove the current cell from the array
  }
}

function createCells(n_cells) {
  // Function to create an array of cell objects
  var newcells = [];
  for (var i = 0; i < n_cells; i++) {
    // Loop to create specified number of cells
    var p = createVector(random(-width/2, width/2), random(-height/2, height/2), random(-height/2, height/2)); // Random position for the cell within canvas dimensions
    var v = createVector(3, 5, 2); // Initial velocity for the cell
    var r = round(random(10, 30)); // Random radius for the cell
    var maxaging = round(random(100,300)); // Random maximum aging for the cell
    newcells.push(new Cell(p, v, r, maxaging)); // Create a new cell with random properties and add it to the array
  }
  return newcells; // Return the array of created cells
}

function collideCells(cells) {
  // Function to check for collisions between cells
  for( var i=0; i < cells.length; i++ ){
    // Loop through each cell in the array
    var cell1 = cells[i]; // Select the current cell
    for( var j=0; j< cells.length; j++ ){
      // Nested loop to compare the current cell with all other cells
      var cell2 = cells[j]; // Select another cell
      if( i!=j){
        // Check if the cells are not the same
        if( cell1.position.dist(cell2.position) < cell1.r/2 + cell2.r/2) {
          // Check if the distance between their centers is less than the sum of their radii
          cell1.velocity.mult(-1); // Reverse the velocity of the first cell upon collision
        }
      }
    }
  }
}
