let molecules = [];
var numOfMolecules = 10;
const gridCols = 4;
const gridRows = 4;
let gridWidth;
let gridHeight;
let intersectCount = 0;
let radiusMin = 10;
let radiusMax = 15;
let percentOfInfect = 25;
var intialInfection = false;     
var time;
let rectCorner;
let canvasHeight = 1000;
let bool = false;
let gridMolecules = [];

let visualHeight = 200;
let graphHeight = 150;
let graphOffset = 275;
let visualData = [];
let graphTopOffset = 55;
let graphWidth = 300;
var numOfInfected = 3;
let num = 100;

var myNumber = 40;
//let myColor = color(255, 0, 0);
var myChoice = ['one', 'two', 'three'];

var isRyanDumb = true;

let gui

var test;


function setup() {
    gui = createGui('My awesome GUI');

    gui.addGlobals('numOfInfected', 'numOfMolecules', 'myChoice', 'isRyanDumb');
    
    createCanvas(canvasHeight, 1000);
    pixelDensity(1)
    background(127);

   init();
    
//    for (let i = 0; i < numOfMolecules/2; i++) {
//        molecules.push(new Molecule(i));
//    }

    gridWidth = width / gridCols;
    gridHeight = (height - graphHeight)/ gridRows;
    smooth();
    //noLoop();
    // gridifyBalls();

}

function init() {
    console.log('running init!!')
    test = numOfInfected;
    bool = false;
    molecules = []
    console.log('big baby boy viv', molecules)
    for (let i = 0; i < numOfMolecules; i++) {
        let randomNum = random();
        if(bool == false){
        if (randomNum < percentOfInfect/100)
            {
                molecules.push(new Infector(i));
                if (i > numOfInfected)
                {
                    bool = true;
                }
            }
        else
            {
                molecules.push(new Healthy(i));        
            }
        
        }
    else {
        molecules.push(new Healthy(i));   
    }
    }
    gridifyBalls();
}

function draw() {
    if (numOfMolecules !== molecules.length || numOfInfected !== test) init()

    background(127);

    make2dArray();
    
    resetBalls();
     
    splitIntoGrids();
    checkIntersections();
    drawGrid();
    renderGrid();
    renderGraph();

}

// function renderGraph (){
//     let Healthy = molecules.filter(function (molecule){
//       return.molecule.constructor.name === "Healthy";
//                                   }
// });
    
//     let infected = molecules.filter(function (molecule){
//         return.molecule.constructor.name === "Infected";
//     });
    
//     let healthyHeight = map(healthy.length, 0 , numOfMolecules, 0 , visualHeight);
//     let infectedHeight = map(infected.length, 0 , numOfMolecules, 0 , visualHeight);
    
    
// }
function make2dArray() {
    gridMolecules = [];

    for (let i = 0; i < gridRows; i++) {
        gridMolecules.push([])
        for (let j = 0; j < gridCols; j++) {
            gridMolecules[i].push([])
        }
    }
}

function gridifyBalls() {
    let Inum = ceil(sqrt(numOfMolecules));
    let Jnum = Inum;

    
    let gridX = width/Inum;
    let gridY = (height - graphHeight)/Jnum;
    
    molecules.forEach(function (molecule, index)
    {
        let iPos = index%Inum;
        let jPos = Math.floor(index/Jnum);
        
        molecule.position.x = iPos * gridX + 50;
        molecule.position.y = jPos * gridY + 50;
        console.log(index);
        //iPos = floor(iPos);
        //console.log(iPos);
    });
    
    
}

function checkIntersections() {

    
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            let tempArray = gridMolecules[i][j];
            let numInArray = tempArray.length
            if (numInArray > 1) {
                for (let z = 0; z < numInArray; z++) {
                    for (let w = z + 1; w < numInArray; w++) {
                        let indexValue01 = tempArray[z];
                        let indexValue02 = tempArray[w];
                        if(molecules[indexValue01].checkIntersecting(indexValue02)){
                            molecules[indexValue01].CheckHealth(indexValue02);

                        }
                    }
                }
            }
        }
    }
}

function drawGrid() {
 
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            noFill();
            strokeWeight(1)
            stroke(0, 100, 0, 50);
            rectMode(CORNER);
            rect(j * gridWidth, i * gridHeight, gridWidth, gridHeight);
            // console.log("Grid width" + gridWidth);
            // console.log("Grid Height" + gridHeight);
            let intersectCount = 0;

            let tempArray = gridMolecules[i][j];
            let numArray = tempArray.length;

            tempArray.forEach(function (indexValue) {

                if (molecules[indexValue].intersecting == true) {
                    intersectCount++
                }
            })

            if (numArray == 0) {
                numArray = ""
            }

        }
    }
   
}

function splitIntoGrids() {


    molecules.forEach(function (molecule) {
        let iNum = floor(molecule.position.y / gridHeight);
        let jNum = floor(molecule.position.x / gridWidth);
        
        if(iNum<0){iNum=0}
        if(iNum>gridRows-1){iNum=gridRows-1}
        if(jNum<0){jNum=0}
        if(jNum>gridCols-1){jNum=gridCols-1}
        
        gridMolecules[iNum][jNum].push(molecule.arrayPosition);
        
        //Left
        if (molecule.position.x % gridWidth < molecule.radius && molecule.position.x > gridWidth) {    
            gridMolecules[iNum][jNum - 1].push(molecule.arrayPosition);
            this.left = true;
        }
        //Right
        if (molecule.position.x % gridWidth > gridWidth - molecule.radius && molecule.position.x < width - gridWidth) {
            gridMolecules[iNum][jNum + 1].push(molecule.arrayPosition);
            this.right = true;
        }
        //Bottom
        if (molecule.position.y % gridHeight < molecule.radius && molecule.position.y > gridHeight) {   
            gridMolecules[iNum-1][jNum].push(molecule.arrayPosition);
            this.bottom = true;
            
        }
        //Top
        if (molecule.position.y % gridHeight > gridHeight - molecule.radius && molecule.position.y < height -gridWidth) {
            gridMolecules[iNum+1][jNum].push(molecule.arrayPosition);
            this.top = true;
        }
        
        //Top left
        if (molecule.top == true && molecule.left == true)
            {
                gridMolecules[iNum + 1][jNum - 1].push(molecule.arrayPosition);
            }
        //Top Right
        if (molecule.top == true && molecule.right == true)
            {
                gridMolecules[iNum + 1][jNum + 1].push(molecule.arrayPosition);
            }
        if (molecule.bottom == true && molecule.left == true)
            {
                gridMolecules[iNum - 1][jNum - 1].push(molecule.arrayPosition);
            }
        if (molecule.bottom == true && molecule.right == true)
            {
                gridMolecules[iNum - 1][jNum + 1].push(molecule.arrayPosition);
            }
    });

    
}

function renderGrid() {


    molecules.forEach(function (molecule) {
         molecule.step();
        molecule.checkEdges(); 
        molecule.render();

    });

   
}

function resetBalls() {
 
    for (let i = 0; i < numOfMolecules; i++) {
        molecules[i].reset();
    }
   
}

function renderGraph() {
    let healthy = molecules.filter(function (molecule){
        return molecule.constructor.name === "Healthy";
    });

    let infected = molecules.filter(function (molecule){
        return molecule.constructor.name === "Infector";
    });

    let healthyHeight = map(healthy.length,0,numOfMolecules,0, graphHeight);
    let infectedHeight = map(infected.length,0,numOfMolecules,0, graphHeight);

    if(visualData.length > graphWidth)
    {
        visualData.shift();
    }

    visualData.push({
        healthy:healthyHeight, 
        infected: infectedHeight
    });

    push();
    translate(0,height - visualHeight)
  
    visualData.forEach(function (data,index) {  
        fill(255,0,0);
        noStroke();    
        rectMode(CORNER);
        rect(graphOffset + index,graphTopOffset +data.healthy,1,data.infected);

        fill(0,255,0);
        noStroke();
        rect(graphOffset + index,graphTopOffset, 1,data.healthy);
    });
   
    pop();


}