var score = 0;
var scoreText;
var overText;
let game;
let gameOptions = {

    
    wallTime: 100,

    
    ballSpeed: 500,

    
    ballSpeedUp: 20
}
window.onload = function() {
    let gameConfig = {
        width: 480,
        height: 640,
        scene: playGame, title,
        backgroundColor: 0x222222,
        physics: {
            default: "arcade"
        }
    }
    game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}
class playGame extends Phaser.Scene{
    constructor(){
        super("actualGame");
    }
    preload(){
        this.load.image("ball", "assets/sprites/ball.png");
        this.load.image("wall", "assets/sprites/wall.png");
    }
    create(){
        scoreText = this.add.text(120, 100, '0', { fontSize: '150px', fill: '#8F0202' });
        overText = this.add.text(70, 200, '', { fontSize: '60px', fill: '#8F0202' });
        this.gameOver = false;
        this.canActivateWall = true;
        this.ballSpeed = gameOptions.ballSpeed;
        this.wallGroup = this.physics.add.group();
        this.theBall = this.physics.add.image(game.config.width / 2, game.config.height * 4 / 5, "ball");
        this.theBall.body.setCircle(25)
        this.theBall.setBounce(1)
        this.createWall(32, game.config.height / 2, 32, game.config.height - 96);
        this.createWall(game.config.width - 32, game.config.height / 2, 32, game.config.height - 96);
        this.createWall(game.config.width / 2, 32, game.config.width - 32, 32);
        this.lowerWall = this.createWall(game.config.width / 2, game.config.height - 32, game.config.width - 32, 32);
        this.physics.add.collider(this.theBall, this.wallGroup, function(ball, wall){
            this.canActivateWall = true;
            if(wall.x == this.lowerWall.x && wall.y == this.lowerWall.y){
                this.ballSpeed += gameOptions.ballSpeedUp;
                let ballVelocity = this.physics.velocityFromAngle(Phaser.Math.Between(220, 320), this.ballSpeed);
                this.theBall.setVelocity(ballVelocity.x, ballVelocity.y);
                score += 1;
                scoreText.setText(score);
            }
        }, null, this);
        this.input.on("pointerdown", this.activateWall, this);
    }
    createWall(posX, posY, width, height){
        let wall = this.physics.add.image(posX, posY, "wall");
        wall.displayWidth = width;
        wall.displayHeight = height;
        this.wallGroup.add(wall);
        wall.setImmovable();
        return wall;
    }
    activateWall(){
        if(this.theBall.body.speed == 0){
            let ballVelocity = this.physics.velocityFromAngle(Phaser.Math.Between(220, 320), this.ballSpeed)
            this.theBall.setVelocity(ballVelocity.x, ballVelocity.y);
            this.lowerWall.alpha = 0.1;
            this.lowerWall.body.checkCollision.none = true;
            return;
        }
        if(this.canActivateWall){
            this.canActivateWall = false;
            this.lowerWall.alpha = 1;
            this.lowerWall.body.checkCollision.none = false;
            let wallEvent = this.time.addEvent({
                delay: gameOptions.wallTime,
                callbackScope: this,
                callback: function(){
                    this.lowerWall.alpha = 0.1;
                    this.lowerWall.body.checkCollision.none = true;
                }
            });
        }
    }
    update(){
        if((this.theBall.y > game.config.height || this.theBall.y < 0) && !this.gameOver){
            this.gameOver = true;
            overText.setText('GAME OVER!');
            scoreText.setText('');
            this.cameras.main.shake(800, 0.05);
            this.time.addEvent({
                delay: 800,
                callbackScope: this,
                callback: function(){
                    this.scene.start("title");
                }
            });
        }
    }
}
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
