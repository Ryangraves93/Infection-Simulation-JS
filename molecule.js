class Molecule {
    constructor(_i) {
        //this.position = createVector(random(radiusMax, width - radiusMax), random(radiusMax, height - radiusMax));
        this.position = createVector(0, 0);
        this.velocity = createVector(random(-2, 2), random(-2, 2));
        this.arrayPosition = _i;
        this.radius = random(radiusMin, radiusMax);
        this.intersecting = false;
        this.bounce = true;
        this.rectCorner = 0;
        this.top = false;
        this.bottom = false;
        this.right = false;
        this.left = false;
        this.rectWidth = 65;
        this.rectHeight = 65;



        this.infected = false;
        this.quarentined = false;
    }

    render() {
        //noStroke()
        //stroke(200, 200, 200);
        //strokeWeight(3)

        if (this.intersecting) {
            fill(255, 50, 0, 255);
        }
        else {
            fill(0, 50, 50, 125);
        }

        push()
        translate(this.position.x, this.position.y);

        ellipse(0, 0, this.radius * 2, this.radius * 2);

        noStroke();
        fill(255, 255, 255, 255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.arrayPosition, 0, 0);
        pop();
    }

    step() {
         if (this.infected == false) {
            this.position.add(this.velocity);
        }
        else if (this.infected == true) {
            this.quarentine();
        }
    }

    quarentine() {
        rectMode(CENTER);
       
        rect(this.position.x, this.position.y, this.rectHeight, this.rectWidth);
        this.rectCorner = (this.position.x - (this.rectHeight / 2)) - (this.rectWidth / 2);
        this.quarentined = true;

    }

    checkEdges() {
        if (this.position.x < this.radius || this.position.x > width - this.radius) {

            this.velocity.x = this.velocity.x * -1
        }

        if (this.position.y < this.radius || this.position.y > height - this.radius) {
            this.velocity.y = this.velocity.y * -1
        }


    }

    breakApart(molecule) {

        var tempVec = p5.Vector.sub(this.position, molecules[molecule].position);
        var heading = tempVec.heading();
        var moveDis = abs(tempVec.mag() - this.radius - molecules[molecule].radius);

        var dis = dist(this.position.x, this.position.y, molecules[molecule].position.x, molecules[molecule].position.y);

        var dx = Math.cos(heading) * (moveDis / 2);

        var dy = Math.sin(heading) * (moveDis / 2);

        this.position.x += dx;
        this.position.y += dx;

        molecules[molecule].position.x -= dy;
        molecules[molecule].position.y -= dy;
    }

    checkIntersecting(_indexValue) {

        let otherMolecule = molecules[_indexValue];
        if (otherMolecule.quarentined) {
        let top = false;
        let left = false;
        let right = false;
        let bottom = false;
        var testX = this.position.x;
        var testY = this.position.y;
        
        if (this.position.x < otherMolecule.position.x - (this.rectWidth/2)){ 
            testX = otherMolecule.position.x - (this.rectWidth/2);
            console.log("Left") // Left Edge 
            left = true;}
        else if ( this.position.x > otherMolecule.position.x + (this.rectWidth/2)){
            testX = otherMolecule.position.x + (this.rectWidth/2);
            console.log("Right")
            right = true;} // Right Edge
        if (this.position.y < otherMolecule.position.y - (this.rectHeight/2)){
            testY = otherMolecule.position.y - (this.rectHeight/2);
            console.log("Top")
            top = true;} // Top Edge
        else if(this.position.y > otherMolecule.position.y +  (this.rectHeight/2)){
            testY = otherMolecule.position.y + (this.rectHeight/2);
            console.log("Bottom")
            bottom = true;} // Bottom Edge
        

             var distX = this.position.x - testX;
             var distY = this.position.y - testY;
             var distance = sqrt((distX*distX) + (distY*distY));
            console.log(distance);
             if (distance <= this.radius){
                 if(right == true)
                 {
                    this.velocity.x = this.velocity.x * -1
                 }
                 else if (left == true)
                 {
                    this.velocity.x = this.velocity.x * 1
                 }
                 else if (top == true)
                 {
                    this.velocity.y = this.velocity.y * -1;
                 }
                 else if (bottom == true)
                 {
                    this.velocity.y = this.velocity.y * 1
                 }
             }
      
        return false;
        }
        else if (this.quarentined)
        {
            return false;
        }
           else {

                let dist = p5.Vector.sub(this.position, molecules[_indexValue].position);
                //console.log(dist)
                if (dist.mag() < this.radius + molecules[_indexValue].radius) {
                    //console.log("changed")
                    this.intersecting = true;
                    molecules[_indexValue].intersecting = true;
                    if (this.bounce) {
                        {
                            let dx = this.position.x - molecules[_indexValue].position.x;
                            let dy = this.position.y - molecules[_indexValue].position.y;
                            let dist = Math.sqrt(dx * dx + dy * dy);

                            let normalX = dx / dist;
                            let normalY = dy / dist;

                            let midpointX = (this.position.x.x + molecules[_indexValue].position.x) / 2;
                            let midpointY = (this.position.x.y + molecules[_indexValue].position.y) / 2;

                            let dVector = (this.velocity.x - molecules[_indexValue].velocity.x) * normalX;
                            dVector += (this.velocity.y - molecules[_indexValue].velocity.y) * normalY;

                            let dvx = dVector * normalX;
                            let dvy = dVector * normalY;

                           
                            this.velocity.y -= dvy;
                            molecules[_indexValue].velocity.x += dvx;
                            molecules[_indexValue].velocity.y += dvy;
                            this.breakApart(_indexValue);
                        }

                        return true;
                    }
                }
            }

          }
        
    
    // if(this.quarentined)
    // {
    //     //console.log(this.rectCorner);
    //     {
    //       

    //             }
    //         }
    //     }
    // }




    reset() {

        this.intersecting = false;
        this.top = false;
        this.bottom = false;
        this.right = false;
        this.left = false;
    }
}
class Healthy extends Molecule {
    constructor(_i) {
        super(_i);
        this.infected = false;

    }

    CheckHealth(_indexValue) {
        let otherMolecule = molecules[_indexValue];
        
        if (otherMolecule.constructor.name == "Infector") {
            //console.log("Shit Happens");

            molecules[this.arrayPosition] = new Infector(this.arrayPosition);
            molecules[this.arrayPosition].position = this.position;
            molecules[this.arrayPosition].velocity = this.velocity;
            molecules[this.arrayPosition].radius = this.radius;

        }
    }

    render() {
        noStroke()
        stroke(200, 200, 200);
        strokeWeight(3)

        if (this.intersecting) {
            fill(255, 50, 0, 255);
        }
        else {
            fill(0, 50, 50, 125);
        }
        //recovery()
        push()
        translate(this.position.x, this.position.y);
        noStroke();
        fill(173, 216, 230, 200);
        ellipse(0, 0, this.radius * 2, this.radius * 2);
        noStroke();
        fill(255, 255, 255, 255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.arrayPosition, 0, 0);
        pop();


        pop();
    }

}

class Infector extends Molecule {
    constructor(_i) {
        super(_i);
        this.infected = true;
        this.recovered = false;
        //this.recovery();
        this.arrayPosition = _i;
       // this.timeoutHandle = window.setTimeout(this.recovery);
        this.quarentined = true;
    }
    


    CheckHealth(_indexValue) {
        let otherMolecule = molecules[_indexValue];
        if (!this.quarentine)
        {
        if (otherMolecule.constructor.name == "Healthy") {
            molecules[otherMolecule.arrayPosition] = new Infector(otherMolecule.arrayPosition);
            molecules[otherMolecule.arrayPosition].position = otherMolecule.position;
            molecules[otherMolecule.arrayPosition].velocity = otherMolecule.velocity;
            molecules[otherMolecule.arrayPosition].radius = otherMolecule.radius;
        }
        }
    }

      test(){

        this.radius = 20;
        this.recovered = true;

    }

    recovery(){
        setTimeout(function recovery() {
            console.log(molecules[this.arrayPosition])
            
         molecules[this.arrayPosition] = new Recovered(this.arrayPosition); 
         molecules[this.arrayPosition].position = this.position;  
         molecules[this.arrayPosition].velocity =this.velocity;
         molecules[this.arrayPosition].radius =this.radius; 
        }.bind(this), 10000)
   
        
    }
    render() {

        fill(51);
        stroke(200, 200, 200);
        strokeWeight(3)


        if (this.intersecting) {
            fill(255, 100, 0, 255);
        }
        else {
            fill(0, 50, 50, 125);
        }

        push()
        translate(this.position.x, this.position.y);
        noStroke();
        fill(238, 210, 2, 200);
        ellipse(0, 0, this.radius * 2, this.radius * 2);
        noStroke();
        fill(255, 255, 255, 255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.arrayPosition, 0, 0);
        pop();
    }

}


class Recovered extends Molecule {
    constructor(_i) {
        super(_i);
        this.infected = false;
        this.recovered = true;
    }

    CheckHealth(_indexValue) {

        
        let otherMolecule = molecules[_indexValue];
        if (otherMolecule.constructor.name == "Healthy") {
            console.log("Have a good day my dude you have not been inflected");
        }
        else if (otherMolecule.constructor.name == "Infector"){
            window.clearTimeout(timeoutHandle);
            this.recovery();
        }
    }

    render() {
           fill(51);
           stroke(200, 200, 200);
           strokeWeight(3)
   
   
           if (this.intersecting) {
               fill(255, 100, 0, 255);
           }
           else {
               fill(0, 50, 50, 125);
           }
   
           push()
           translate(this.position.x, this.position.y);
           noStroke();
           fill(100, 10, 100, 200);
           ellipse(0, 0, this.radius * 2, this.radius * 2);
           noStroke();
           fill(255, 255, 255, 255);
           textSize(30);
           textAlign(CENTER, CENTER);
           text(this.arrayPosition, 0, 0);
           pop();
       }
   
   }
