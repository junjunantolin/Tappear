class title extends Phaser.Scene{
    constructor(){
        super('title');
    }
    preload() {
        
        this.load.image('play', 'assets/images/play.png');

        
    }

    create() {
        this.Em = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        this.titleText = this.add.text(110, 100, 'TAPPEAR', { font: "60px Arial", fill: '#FFD700' });
        const helloButton = this.add.image(250, 450, 'play').setScale(.4);
        helloButton.setInteractive();
        helloButton.on('pointerdown', () => {
            this.scene.start("actualGame");
        });

    }

    update() {
        

    }
}
