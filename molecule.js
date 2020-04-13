class Molecule {
    constructor(_i) {
        //this.position = createVector(random(radiusMax, width - radiusMax), random(radiusMax, height - radiusMax));
        this.position = createVector(0,0);
        this.velocity = createVector(random(-2, 2), random(-2, 2));
        this.arrayPosition = _i;
        this.radius = random(radiusMin, radiusMax);
        this.intersecting = false;
        this.bounce = true;
        
        this.top = false;
        this.bottom = false;
        this.right = false; 
        this.left = false;
    }

    render() {
        //noStroke()
        stroke(200, 200, 200);
        strokeWeight(3)

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
        this.position.add(this.velocity);
    }

    checkEdges() {

        if (this.position.x < this.radius || this.position.x > width - this.radius) {

            this.velocity.x = this.velocity.x * -1
        }

        if (this.position.y < this.radius || this.position.y > height - visual - this.radius) {
            this.velocity.y = this.velocity.y * -1
        }
    }
    
     breakApart(molecule)
        {
    
    var tempVec = p5.Vector.sub(this.position,molecules[molecule].position);
    var heading = tempVec.heading();
    var moveDis = abs(tempVec.mag() - this.radius - molecules[molecule].radius);
    
    var dis = dist(this.position.x,this.position.y,molecules[molecule].position.x,molecules[molecule].position.y);
    
    var dx = Math.cos(heading) * (moveDis/2);
    
    var dy = Math.sin(heading) * (moveDis/2);
    
    this.position.x += dx;
    this.position.y += dx;
    
    molecules[molecule].position.x -= dy;
    molecules[molecule].position.y -= dy;
            
            }
    
    checkIntersecting(_indexValue) {
        
        
        let dist = p5.Vector.sub(this.position, molecules[_indexValue].position);
        //console.log(dist)
        if (dist.mag() < this.radius + molecules[_indexValue].radius) {
            //console.log("changed")
            this.intersecting = true;
            molecules[_indexValue].intersecting = true;
     
                  
                
            
            if (this.bounce) {
                
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

                this.velocity.x -= dvx;
                this.velocity.y -= dvy;
                molecules[_indexValue].velocity.x += dvx;
                molecules[_indexValue].velocity.y += dvy;
                this.breakApart(_indexValue);
            }
            
            return true;
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
        
    
    }
      
      CheckHealth(_indexValue){
          let otherMolecule = molecules[_indexValue];
          if (otherMolecule.constructor.name == "Infector"){
              console.log("Shit Happens");
              
              molecules[this.arrayPosition] = new Infector(this.arrayPosition);
              molecules[this.arrayPosition].position = this.position;
              molecules[this.arrayPosition].velocity = this.velocity;
              molecules[this.arrayPosition].radius = this.radius;
          }
      }
    
      render() {
        //noStroke()
        stroke(200, 200, 200);
        strokeWeight(3)

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
        fill(0, 255, 255, 255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.arrayPosition, 0, 0);
        pop();
    }

}

class Infector extends Molecule {
    constructor(_i) {
        super(_i);
        
    
    }
    
    CheckHealth(_indexValue){
          let otherMolecule = molecules[_indexValue];
          if (otherMolecule.constructor.name == "Healthy"){
              console.log("Shit Happens");
              molecules[otherMolecule.arrayPosition] = new Infector(otherMolecule.arrayPosition);
              molecules[otherMolecule.arrayPosition].position = otherMolecule.position;
              molecules[otherMolecule.arrayPosition].velocity = otherMolecule.velocity;
              molecules[otherMolecule.arrayPosition].radius = otherMolecule.radius;
          }
      }
    
    
      render() {
        //noStroke()
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

        ellipse(0, 0, this.radius * 2, this.radius * 2);

        noStroke();
        fill(255, 255, 255, 255);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.arrayPosition, 0, 0);
        pop();
    }

}