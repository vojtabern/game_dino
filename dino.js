const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.height = 650;
canvas.width = 1100;


const velikost = document.getElementsByClassName('game1');
let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let gravity;
let obstacles=[];
let gameSpeed;
let keys = {};
const imgChodi = document.getElementById("chodi");
const imgEnemy = document.getElementById("enemy");
document.getElementById("but");


//event listeners
document.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt){
    keys[evt.code] = false;

});

class Player {
    constructor (x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w=150;
        this.h = h=150;
        this.c = c;

//nastaveni hrace
        this.dy = 0;
        this.jumpForce = 25;
        this.originalHeight = h;
        this.grounded = false;
        this.jumpTimer = 0;

    }
    Animate() {
        //jump

        if (keys['Space'] || keys['KeyW']) {
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }
        // skrceni
        if (keys['ShiftLeft'] || keys['KeyS']) {
            this.h = this.originalHeight / 2;

        } else{
            this.h = this.originalHeight;
        }
        
        this.y += this.dy;
        

        //gravitace
        if (this.y + this.h < canvas.height){
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0;
            this.grounded = true;
            this.y = canvas.height - this.h;
        }
        this.Draw();

    }
    //skok
    Jump(){
        console.log(this.grounded, this.jumpTimer);
        if(this.grounded && this.jumpTimer == 0){
            this.jumpTimer = 1;
            this.dy = -this.jumpForce;

        }
        /*else if (this.jumpTimer > 0 && this.jumptimer < 15){
            this.jumpTimer++;
            this.dy = -this.jumpForce - (this.jumpTimer/50);

        }*/

    }
    Draw () {  
        
        ctx.beginPath ();
        ctx.fillStyle = this.c;
        ctx.drawImage(imgChodi, this.x, this.y, this.w, this.h);
        /*ctx.fillRect(this.x, this.y, this.w, this.h);*/
        ctx.closePath();
    }
}

class Obstacle {
    constructor (x, y, w, h, c){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.c=c;

        this.dx = -gameSpeed;
    }
    Update(){
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }
    Draw () {
        ctx.beginPath ();
        ctx.fillStyle = this.c;
        ctx.drawImage(imgEnemy, this.x, this.y, this.w, this.h);
        ctx.closePath();
    }


}
class Text{
    constructor (t, x, y, a, c, s){
        this.t = t;
        this.x = x;
        this.y = y;
        this.a = a;
        this.c = c;
        this.s = s;
    }
    Draw () {
        ctx.beginPath ();
        ctx.fillStyle = this.c;
        ctx.font = this.s + "px sans-serif";
        ctx.textAlign = this.a; 
        ctx.fillText(this.t, this.x, this.y);
        ctx.closePath();
    }

}




//spawn nepratel
function spawnObstacle(){
    let size = RandomIntRange(50, 100);
    let type = RandomIntRange(0, 2);
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4');
    

    if (type == 1){
        obstacle.y -= player.originalHeight - 10;
    }
    obstacles.push(obstacle);



}

function RandomIntRange (min, max){
    return Math.round(Math.random()*(max-min)+min);
}

//start
function Start() {
    /*canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;*/
    /*canvas sířka a výška = vnitřní velikosti a šířce okna. */ 
    ctx.font = "20px sans-serif";

    gameSpeed = 3;
    gravity = 1;

    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')){
        highscore = localStorage.getItem('highscore');
    }

    player = new Player(25, 0, 50, 50, '#FF5858');
    //player.Draw();
    scoreText = new Text("Score: "+ score, 25, 25, + "left", "#f5f5f5","20");
    highscoreText = new Text("Highscore: "+ highscore, 25, 50, + "left", "#f5f5f5", "20");


    requestAnimationFrame(Update);
}


//spawn timer
let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update(){
    requestAnimationFrame(Update);
    ctx.clearRect(0,0, canvas.width, canvas.height);


//spawnuje nepřátele
    spawnTimer--;
    if(spawnTimer <= 0){
        spawnObstacle();
        console.log(obstacles);
        spawnTimer=initialSpawnTimer - gameSpeed * 8;

        if (spawnTimer < 60){
            spawnTimer = 60;
        }

    }


    for (let i=0; i < obstacles.length;i++){
        let a = obstacles[i];

        if (a.x + a.width < 0){
            obstacles.splice(i, 1);
        }
        //resetuje hru při kolizi
        if (player.x < a.x + a.w && player.x + player.w > a.x &&
            player.y < a.y + a.h && player.y + player.h > a.y){
                obstacles=[];
                score = 0;
                spawnTimer = initialSpawnTimer;
                gameSpeed = 3;
                window.localStorage.setItem('highscore', highscore);


        }
        
        a.Update();
    } 
 player.Animate();
   





    //stará se o skore
    score++;
    scoreText.t="Score: " + score;
    scoreText.Draw();

    //stara se o highscore
    if (score > highscore){
        highscore = score;
        highscoreText.t = "Highscore: " + highscore +".";
        
    }

    highscoreText.Draw();


    gameSpeed += 0.005;
}

 Start();
