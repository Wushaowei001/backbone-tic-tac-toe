var TicTacToe = TicTacToe || {};

TicTacToe.Game = Backbone.View.extend({
    playerX: 'X',
    playerO: '0',
    board: null,

    el: '.stage',

    events: {
        'click .play'    : 'play',
        'click .restart' : 'restartGame',
        'click .cpu'     : 'againstCpu',
        'click .multi'   : 'multiPlayer'
    },

    initialize: function() {
        this.board = new TicTacToe.Board();
        
        this.configureListeners();
        this.configureGame();
    },
    
    configureListeners: function() {
        this.listenTo(this.board, 'move', this.moveSound);
        this.listenTo(this.board, 'winner', this.showModalWinner);
         this.listenTo(this.board, 'tie', this.showModalTie);
        
        this.board.configureListeners();
    },
    
    configureGame: function() {
        if (!this.hasCpuConfig()) {
            return this.showModalSetup();
        }
        
        this.setPlayerConfig(this.isAgainstCpu());
    },

    play: function(e) {
        this.hideModalWinner();
        this.hideModalTie();
        
        this.board.restart();
    },

    showModalSetup: function() {
        this.$('.overlay, .setup').removeClass('hide');
    },

    hideModalSetup: function() {
        this.$('.overlay, .setup').addClass('hide');
    },

    againstCpu: function() {
        this.setAgainstCpu(true);
        this.hideModalSetup();
    },

    multiPlayer: function() {
        this.setAgainstCpu(false);
        this.hideModalSetup();
    },
    
    isAgainstCpu: function() {
        return sessionStorage.getItem('cpu') === 'true';
    },
    
    hasCpuConfig: function() {
        return sessionStorage.getItem('cpu') != undefined;
    },

    setAgainstCpu: function(againstCpu) {
        sessionStorage.setItem('cpu', againstCpu);
        
        this.setPlayerConfig(againstCpu);
    },
    
    setPlayerConfig: function(againstCpu) {
        this.board.setPlayers(
            new TicTacToe.Player({label: this.playerX}),
            againstCpu ? new TicTacToe.Cpu({label: this.playerO})
                       : new TicTacToe.Player({label: this.playerO})
        );
    },

    playAudio: function(audio) {
        this.$('audio')[0].src = 'assets/audio/' + audio;
        this.$('audio')[0].play();
    },
    
    moveSound: function() {
        this.playAudio('button.mp3');
    },

    restartGame: function() {
        this.board.restart();
        sessionStorage.removeItem('cpu');
        
        this.configureGame();
    },

    showModalWinner: function(player) {
        this.playAudio('winner.mp3');
        
        this.$('.success b').text(player.getLabel());
        this.$('.overlay, .success').removeClass('hide');
    },

    hideModalWinner: function() {
        this.$('.overlay, .success').addClass('hide');
    },
    
    showModalTie: function() {
//        this.playAudio('tie.mp3'); for the future =)
        
        this.$('.overlay, .tie').removeClass('hide');
    },
    
    hideModalTie: function() {
        this.$('.overlay, .tie').addClass('hide');
    }
});
