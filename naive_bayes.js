const _ = require('lodash');
const decks = require('./decks');

module.exports = class NaiveBayesClassifier {
    constructor() {
        this.winTable = {};
        this.lossTable = {};
        this.playerSkill = {};
    }

    trainGames(games) {
        _.forEach(games, ({ cards, player1, player2, winner }) => {
            const isWin = winner === player1;
            _.forEach(cards, (card) => this.trainCard(card, isWin));
            this.trainPlayers(player1, player2, winner);
        });
    }

    initializePlayer(player) {
        const DEFAULT_ELO = 1000;
        if (!this.playerSkill[player]) {
            this.playerSkill[player] = DEFAULT_ELO
        }
    }

    trainPlayers(player1, player2, winner) {
        this.initializePlayer(player1);
        this.initializePlayer(player2);

        const expectedResult = this.getExpectedResult(player1, player2);
        const actualResult = winner === player1 ? 1 : 0;
        const K = 300;
        this.playerSkill[player1] += K * (actualResult - expectedResult);
        this.playerSkill[player2] += K * ((1 - actualResult) - (1 - expectedResult));
    }

    getExpectedResult(player1, player2) {
        this.initializePlayer(player1);
        this.initializePlayer(player2);
        return 1 / (1 + 10 ** ((this.playerSkill[player2] - this.playerSkill[player1]) / 400));
    }

    trainCard(card, isWin) {
        if (!this.winTable[card]) {
            this.winTable[card] = 0;
        }
        if (!this.lossTable[card]) {
            this.lossTable[card] = 0;
        }
        if (isWin) {
            this.winTable[card]++;
        } else {
            this.lossTable[card]++;
        }
    }

    test(cards, player1, player2) {
        this.initializePlayer(player1);
        this.initializePlayer(player2);

        const P_win = this.playerSkill[player1] / (this.playerSkill[player1] + this.playerSkill[player2]);
        let P_winGivenCards = P_win;
        let P_lossGivenCards = 1 - P_win;

        _.forEach(cards, (card) => {
            const timesCardSeen = (this.winTable[card] || 0) + (this.lossTable[card] || 0);
            if (timesCardSeen) {
                P_winGivenCards *= Math.max(this.winTable[card] || 0 / timesCardSeen, 0.2);
                P_lossGivenCards *= Math.max(this.lossTable[card] || 0 / timesCardSeen, 0.2);
            }
        });

        return P_winGivenCards / P_lossGivenCards;
    }

    testDecks(cards1, cards2, player1, player2) {
        const p_p1_win = this.test(cards1, player1, player2);
        const p_p2_win = this.test(cards2, player2, player1);
        const p = p_p1_win / p_p2_win;
        const winningPlayer = p > 1 ? player1 : player2;
        if (p === 1) {
            return 'A tie is predicted'
        }
        return `${winningPlayer} is the predicted winner, with confidence ${(Math.abs(1 - p) * 100).toFixed(4)}%`;
    }

    predictGame(players) {
        return this.testDecks(decks[players[0].dizzeck], decks[players[1].dizzeck], players[0].playa, players[1].playa);
    }
}
