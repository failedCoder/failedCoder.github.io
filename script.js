//var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

window.onload = function () {
    
    game.state.add('menu', menuState);

    game.state.add('play',playState);

    game.state.add('end',endState);

    game.state.start('menu');
};

//main menu

menuState = {};

var mainTheme;
var selectTheme;

var sensei;

var senseiTalk = [
    "SENSEI:",
    "",
    "The world is in danger!",
    "The ancient dragon has awoken from his slumber",
    "Collect as many carrots as you can and kill him",
    "",
    "",
    "GLHF M8"


];

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 200;
var lineDelay = 400;

menuState.preload = function(){

    game.load.image('background','slike/monitor.png');
    game.load.image('button','slike/button.png');
    game.load.image('master','slike/master.png');

    game.load.audio('main','music/main.mp3');
    game.load.audio('select','music/menuSelect.mp3');
}

menuState.create = function(){

    game.add.sprite(0,0,'background');

    game.add.button(300, 400, 'button', startGame,this);

    sensei=game.add.sprite(100,100,'master');

    text = game.add.text(200, 100, '', { font: "15px Arial", fill: "#19de65" });

    nextLine();

    mainTheme = game.add.audio('main',0.5);

    mainTheme.play();

}

function startGame(){

    mainTheme.stop();

    game.state.start('play'); 

}

function nextLine() {

    if (lineIndex === senseiTalk.length)
    {
        return;
    }

    line = senseiTalk[lineIndex].split(' ');

    wordIndex = 0;

    game.time.events.repeat(wordDelay, line.length, nextWord, this);

    lineIndex++;

}

function nextWord() {

    text.text = text.text.concat(line[wordIndex] + " ");

    wordIndex++;

    if (wordIndex === line.length)
    {
        text.text = text.text.concat("\n");

        game.time.events.add(lineDelay, nextLine, this);
    }

}

//playstate 

playState = {};

playState.preload = function() { 

    game.load.image('sky', 'slike/sky1.png');
    game.load.image('platform','slike/ground.png');
    game.load.image('pod','slike/pod.png');
    game.load.image('voda','slike/voda1.png');
    game.load.image('master','slike/master.png');
    game.load.image('carrot','slike/carrot.png');
    game.load.image('pod2','slike/pod2.png');
    game.load.image('pod3','slike/pod3.png');
    game.load.image('pod4','slike/wetstone.png');
    game.load.image('platform2','slike/ground2.png');
    game.load.image('kill','slike/kill.png');

    game.load.spritesheet('zmajo','slike/zmajo.png', 96 , 64);
    game.load.spritesheet('boom','slike/explosion.png', 64, 64);
    game.load.spritesheet('invader','slike/invader.png',32,32);
    game.load.spritesheet('coin','slike/coin.png',32,32);
    game.load.spritesheet('character', 'slike/preuzmi.png', 32, 48);
    game.load.spritesheet('door','slike/door.png',144,96);

    
    game.load.audio('ding','music/ding.mp3');
    game.load.audio('crush','music/crush.mp3');
    game.load.audio('death','music/death.mp3');
    game.load.audio('playTheme','music/playTheme.mp3');
    game.load.audio('slain','music/slain.mp3');

}

var platforms;
var door;
var water;
var stab;

var player;
var dragon;
var explosion;
var enemies;

var coins;
var carrots;

var tweenF;
var tweemE;
var tweenT;

var score = 0;
var scoreText;

var ding;
var crush;
var death;
var playTheme;
var slain;

var cursors;
var reset;

playState.create = function() {   


    game.world.resize(2000, 600);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');


    //platforms and floors

    platforms = game.add.group();

    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 45, 'pod');

    ground.scale.setTo(1, 2);

    ground.body.immovable = true;
  
    var ground2 = platforms.create(1100,500,'pod2');

    ground2.body.immovable = true;

    var ground3 = platforms.create(1228,500,'pod2');

    ground3.body.immovable=true; 

    var ground4 = platforms.create(1356,500,'pod2');

    ground4.body.immovable=true;

    var ground5 = platforms.create(1484,400,'pod4');

    ground5.body.immovable=true; 

    var ground6 = platforms.create(1784,game.world.height-45,'pod3');

    ground6.body.immovable=true;

    ground6.scale.setTo(1,2);

    var ledge = platforms.create(200, 400, 'platform');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'platform');

    ledge.body.immovable = true;

    ledge = platforms.create(400, 150, 'platform');

    ledge.body.immovable = true;

    ledge=platforms.create(980,350,'platform2');

    ledge.body.immovable = false;

    ledge=platforms.create(1150,200,'platform2');

    ledge.body.immovable = false;

    ledge=platforms.create(1300,100,'platform2'); 

    ledge.body.immovable = false;

    ledge=platforms.create(1300,400,'platform2'); 

    ledge.body.immovable = true;


    //score

    scoreText = game.add.text(16, 16, 'score:' +score, { fontSize: '16px', fill: '#000' });

    scoreText.fixedToCamera = true;


    //door

    door = game.add.sprite(1850,game.world.height-140,'door');

    game.physics.arcade.enable(door);

    door.enableBody = true;


    //water

    water=game.add.group();

    water.enableBody = true;

    var water1=water.create(800,game.world.height-30,'voda');  //samo djeca u grupi mogu imati body.immovable=true!!

    water1.body.immovable = true;


     //money

    coins = game.add.group();

    coins.enableBody = true;

    coins.create(1305,60,'coin');

    coins.create(1700,360,'coin');

    //mrkve

    carrots = game.add.group();

    carrots.enableBody=true;


    for (var i = 1; i < 11; i++)
    {
        var carrot = carrots.create(i * 75, 520, 'carrot');

        carrot.body.gravity.y = 100;

    }

     for (var i = 0; i < 11; i++)
    {
        var carrot = carrots.create(i * 75, 100, 'carrot');

        carrot.body.gravity.y = 100;

    }

     for (var i = 15; i < 20; i++)
    {
        var carrot = carrots.create(i *75, 400, 'carrot');

        carrot.body.gravity.y = 100;

    }  


    //enemies

    enemies = game.add.group();

    enemies.enableBody = true;

    enemies.create(230,370,'invader');

    enemies.create(430,120,'invader');



    dragon = game.add.group(); 

    dragon.enableBody = true;

    dragon.create(1520,340,'zmajo');


    explosion = game.add.sprite(1470,360,'boom');

    game.physics.arcade.enable(explosion);

    explosion.enableBody = true;


    //player character
 
    player = game.add.sprite(5, game.world.height - 105, 'character');

    game.physics.arcade.enable(player);

    player.body.gravity.y = 450;

    player.body.collideWorldBounds = true;


    //animations

    player.animations.add('left', [4,5,6,7], 5, true);

    player.animations.add('right', [8,9,10,11], 5, true);

    door.animations.add('open', [0,1,2,3,4,5,6,7,8,9,10,11,12],false);

    dragon.callAll('animations.add','animations','fly',[6,7,8],5,true);

    explosion.animations.add('burn',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],10,true);
    
    enemies.callAll('animations.add', 'animations', 'blink', [0,1,2,3], 10, true);

    coins.callAll('animations.add','animations','spin',[0,1,2,3,4,5,6],10,true);


    //tweens

    tweenF = game.add.tween(explosion).to({ x: 1400 }, 1000, Phaser.Easing.Linear.None, true, 0, 2000, false); //tween zamjenit bulletom?

    tweenE = game.add.tween(enemies).to({ x: 300 }, 2200, Phaser.Easing.Linear.None, true, 0, 1000, true);


    //controlls

    cursors = game.input.keyboard.createCursorKeys();

    reset = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


    //playstate audio

    ding = game.add.audio('ding',0.2,false);

    ding.allowMultiple = true;

    crush = game.add.audio('crush',0.5,false);

    playTheme = game.add.audio('playTheme',0.5,false);

    playTheme.play();

    slain = game.add.audio('slain',1,false);



}

playState.update = function() {

    //collision

    var hitPlatform = game.physics.arcade.collide(player, platforms);

    var hitEnemies = game.physics.arcade.collide(player,enemies,enemiesInteraction,null,this);

    var hitExplosion = game.physics.arcade.collide(player,explosion,boom,null,this);

    var hitDragon = game.physics.arcade.collide(player,dragon,killDragon,null,this);

    var hitPlatforms=game.physics.arcade.collide(carrots, platforms);

    var hitCarrots=game.physics.arcade.overlap(player,carrots,collectCarrots,null,this);

    var hitCoins=game.physics.arcade.overlap(player,coins,collectCoins,null,this);

    var hitWater = game.physics.arcade.collide(player,water,drown,null,this);

    var hitDoors = game.physics.arcade.overlap(player,door,enterDoors,null,this);


    //updates controlls,camera and animations

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        
        player.body.velocity.x = -150;

        player.animations.play('left');

        game.camera.x -= 2;

    }

    else if (cursors.right.isDown)
    {
        
        player.body.velocity.x = 150;

        player.animations.play('right');

        game.camera.x += 2;

    }

    else
    {

         player.animations.stop();

         player.frame = 0; 

    }

    if (cursors.up.isDown && player.body.touching.down)
    {

        player.body.velocity.y = -400;

    }


    //game over screen

    if(player.alive === false){

        var gameOver = game.add.text(250, 300, 'Press SPACE to restart', { font: '32px Arial', fill: 'gray' });

        gameOver.fixedToCamera = true;


          if(reset.isDown){

            game.state.restart();

            playTheme.stop();

        }
    }
     
    
    //playing animations


    explosion.animations.play('burn');
    
    coins.callAll('play',null,'spin');

    enemies.callAll('play', null, 'blink');

    dragon.callAll('play',null,'fly');

}

//colliison functions

function collectCarrots(player,carrots){

    carrots.kill();

    ding.play();

    score += 100;

    scoreText.text = 'Score: ' + score;

}

function collectCoins(player,coins){

    coins.kill();

    ding.play();

    score += 1000;

    scoreText.text = 'Score: ' + score; 

}

function drown(player,water){

    player.kill();

}

function boom(player,explosion){

    player.kill();

}

function killDragon(player,dragon){

    dragon.kill();

    explosion.kill();

    door.animations.play('open');

    stab = game.add.image(1600,400,'kill');

    stab.anchor.setTo(0.5,1);

    game.time.events.add(Phaser.Timer.SECOND * 1, fadeStab, this);

    slain.play();

    function fadeStab() {

    game.add.tween(stab).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

    }

    score += 500;

    scoreText.text = 'Score: ' + score;
}

function enemiesInteraction(player,enemies){

    crush.play();

    if(player.body.touching.left === true || player.body.touching.right === true){

        player.kill();

    }
    else if(player.body.touching.bottom === true){

        score += 200;

        scoreText.text = 'Score: ' + score;

    }

}

function enterDoors(player,door){

    playTheme.stop();

    game.state.start('end');

}


endState = {};

endState.preload = function(){

    game.load.image('dead','slike/dead.png');

    game.load.audio('victory','music/victory.mp3');

var restart;
var victory;

}

endState.create = function(){
    
    game.add.sprite(0,0,'dead');

    victory = game.add.audio('victory',1,true);

    victory.play();
    
    restart = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

endState.update = function(){

    if(restart.isDown){

            victory.stop();

            game.state.start('menu');

        }
}

