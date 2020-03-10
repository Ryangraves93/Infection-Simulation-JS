let molecules = [];
const numOfMolecules = 50;
const gridCols = 5;
const gridRows = 5;
let gridWidth;
let gridHeight;
let intersectCount = 0;
let radiusMin = 40;
let radiusMax = 40;

let gridMolecules = [];

function setup() {
    createCanvas(1000, 1000);
    pixelDensity(1)
    background(127);

    for (let i = 0; i < numOfMolecules; i++) {
        molecules.push(new Molecule(i));
    }

    gridWidth = width / gridCols;
    gridHeight = height / gridRows;
    smooth();
    //noLoop();
    gridifyBalls();

}

function draw() {

    background(127);

    make2dArray();
    
    resetBalls();
     
    splitIntoGrids();
    checkIntersections();
    
    drawGrid();
   
    renderGrid();
    

}



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
    console.log(Inum);
    
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
                        molecules[indexValue01].checkIntersecting(indexValue02)
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
            textSize(16);
            textAlign(RIGHT);
            text(numArray, j * gridWidth + gridWidth - 5, i * gridHeight + 20);

            fill(255, 50, 0, 150);
            text(intersectCount, j * gridWidth + gridWidth - 5, i * gridHeight + gridHeight - 5);

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