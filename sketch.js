let molecules = [];
const numOfMolecules = 60;
const gridCols = 4;
const gridRows = 4;
let gridWidth;
let gridHeight;
let intersectCount = 0;
let radiusMin = 10;
let radiusMax = 20;
let percentOfInfect = 25;
var intialInfection = false;     
var time;
let rectCorner;

let bool = false;
let gridMolecules = [];

function setup() {
   
    createCanvas(1000, 1000);
    pixelDensity(1)
    background(127);

    for (let i = 0; i < numOfMolecules; i++) {
        let randomNum = random();
        if(bool == false){
        if (randomNum < percentOfInfect/100)
            {
                molecules.push(new Infector(i));
                 bool = true;
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
    
//    for (let i = 0; i < numOfMolecules/2; i++) {
//        molecules.push(new Molecule(i));
//    }

    gridWidth = width / gridCols;
    gridHeight = height / gridRows;
    smooth();
    //noLoop();
    gridifyBalls();

}

function draw() {
    time = millis();
    //console.log(time * 1000);
    background(127);

    make2dArray();
    
    resetBalls();
     
    splitIntoGrids();
    checkIntersections();
    
    drawGrid();
   
    renderGrid();

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
    let gridY = height/Jnum;
    
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
            stroke(0, 244, 0, 50);
            rect(j * gridWidth, i * gridHeight, gridWidth, gridHeight);

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

            noStroke();
            fill(255, 255, 255, 255);
            //textSize(16);
            //textAlign(RIGHT);
            //text(numArray, j * gridWidth + gridWidth - 5, i * gridHeight + 20);

            fill(255, 50, 0, 150);
            //text(intersectCount, j * gridWidth + gridWidth - 5, i * gridHeight + gridHeight - 5);

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