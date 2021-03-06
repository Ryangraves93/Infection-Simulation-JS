class Molecule {
    constructor(_i) {
        //this.position = createVector(random(radiusMax, width - radiusMax), random(radiusMax, height - radiusMax));
        this.position = createVector(0, 0);
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.arrayPosition = _i;
        this.radius = random(radiusMin, radiusMax);
        this.intersecting = false;
        this.bounce = true;
        this.rectCorner = 0;
        this.top = false;
        this.bottom = false;
        this.right = false;
        this.left = false;
        this.rectWidth = this.radius * 2;
        this.rectHeight = this.radius * 2;




        this.infected = false;
        this.quarentined = false;
    }

    render() {
            fill(0, 50, 50, 125);
        

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
         if (this.quarentined == true) {
            this.quarentine();
        }
        else {
            this.position.add(this.velocity);
        }
    }
    checkEdges() {
        if (this.position.x < this.radius || this.position.x > width - this.radius) {

            this.velocity.x = this.velocity.x * -1
        }

        if (this.position.y < this.radius || this.position.y > height - graphHeight - this.radius) {
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
            //console.log("Left") // Left Edge 
            left = true;}
        else if ( this.position.x > otherMolecule.position.x + (this.rectWidth/2)){
            testX = otherMolecule.position.x + (this.rectWidth/2);
            //console.log("Right")
            right = true;} // Right Edge
        if (this.position.y < otherMolecule.position.y - (this.rectHeight/2)){
            testY = otherMolecule.position.y - (this.rectHeight/2);
            //console.log("Top")
            top = true;} // Top Edge
        else if(this.position.y > otherMolecule.position.y +  (this.rectHeight/2)){
            testY = otherMolecule.position.y + (this.rectHeight/2);
            //console.log("Bottom")
            bottom = true;} // Bottom Edge
        

             var distX = this.position.x - testX;
             var distY = this.position.y - testY;
             var distance = sqrt((distX*distX) + (distY*distY));
            //console.log(distance);
             if (distance <= this.radius){
                 if(right == true)
                 {
                    this.velocity.x = this.velocity.x * -1
                 }
                 else if (left == true)
                 {
                    this.velocity.x = this.velocity.x * -1
                 }
                 else if (top == true)
                 {
                    this.velocity.y = this.velocity.y * -1;
                 }
                 else if (bottom == true)
                 {
                    this.velocity.y = this.velocity.y * -1
                 }
             }
             //this.breakApart(_indexValue);
        return false;
        }
        else if (this.quarentined)
        {
            molecules[_indexValue].checkIntersecting(this.arrayPosition);
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

       
            fill(0, 50, 50, 125);
    
        push()
        translate(this.position.x, this.position.y);
        noStroke();
        fill(173, 216, 230, 200);
        ellipse(0, 0, this.radius * 2, this.radius * 2);
        noStroke();
        fill(255, 255, 255, 255);
        pop();


        pop();
    }

}

class Infector extends Molecule {
    constructor(_i) {
        super(_i);
        this.infected = true;
        this.recovered = false;
        this.infectedDuration = random(6000,10000);
        this.timeToInfection = random(1000,4000);
        this.arrayPosition = _i;
        this.dateNow = new Date().getTime();
       this.timeToQuarentine();
        this.quarentined = false;
        
    }
    lerp(){
        
    }
    step() {
        if (this.quarentined) {
           this.quarentine();
       }
       else {
           this.position.add(this.velocity);
       }
   }
    quarentine() {
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
        this.rectCorner = (this.position.x - (this.rectHeight / 2)) - (this.rectWidth / 2);
        this.recovery();
    }

    CheckHealth(_indexValue) {
        let otherMolecule = molecules[_indexValue];
        if (!this.quarentined)
        {
        if (otherMolecule.constructor.name == "Healthy") {
            molecules[otherMolecule.arrayPosition] = new Infector(otherMolecule.arrayPosition);
            molecules[otherMolecule.arrayPosition].position = otherMolecule.position;
            molecules[otherMolecule.arrayPosition].velocity = otherMolecule.velocity;
            molecules[otherMolecule.arrayPosition].radius = otherMolecule.radius;
        }
        }
    }
    timeToQuarentine()
    {
        let app = this;
        setTimeout(function () {
        app.quarentined = true;
        
        },app.timeToInfection)
    }

    lerpColor(a, b, amount) { 
        
        var ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);
    
        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }

    recovery()
    {
        const app = this;
        setTimeout(function (duration) {
         molecules[app.arrayPosition] = new Recovered(app.arrayPosition); 
         molecules[app.arrayPosition].position = app.position;  
         molecules[app.arrayPosition].velocity =app.velocity;
         molecules[app.arrayPosition].radius =app.radius; 
         
        },app.infectedDuration)
    }

    calculateTime() {
        const start = this.dateNow
        const end = start + this.timeToInfection
        const now = new Date().getTime()
        
        return (now - start) / (end - start)
    }

    render() {
        
        fill(51);
        // console.log('whos a good boy', this.dateNow / this.dateNow + this.timeToInfection)
        const colourLerp = this.quarentined
        ? color(238, 210, 2, 200) // BABY LOVE MY BUTT VIV != REAL LOVE
        : this.lerpColor('#add8e6', '#BDAC13', this.calculateTime())


        stroke(200, 200, 200);
        strokeWeight(3)
        fill(0, 50, 50, 125);
        
        push()
        translate(this.position.x, this.position.y);
        noStroke();
        fill(colourLerp);
        ellipse(0, 0, this.radius * 2, this.radius * 2);
        noStroke();
        fill(255, 255, 255, 255);

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
        }
        // else if (otherMolecule.constructor.name == "Infector"){
        //     window.clearTimeout(timeoutHandle);
        //     this.recovery();
        // }
    }

    render() {
           fill(51);
           stroke(200, 200, 200);
           strokeWeight(3)
   
   
          
               fill(0, 50, 50, 125);
           
   
           push()
           translate(this.position.x, this.position.y);
           noStroke();
           fill(100, 10, 100, 200);
           ellipse(0, 0, this.radius * 2, this.radius * 2);
           noStroke();
           fill(255, 255, 255, 255);
           pop();
       }
   
   }
