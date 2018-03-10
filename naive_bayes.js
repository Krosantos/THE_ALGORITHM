const _ = require('lodash');

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

    trainPlayers(player1, player2, winner) {
        const DEFAULT_ELO = 1000;
        if (!this.playerSkill[player1]) {
            this.playerSkill[player1] = DEFAULT_ELO
        }
        if (!this.playerSkill[player2]) {
            this.playerSkill[player2] = DEFAULT_ELO
        }

        const K = 300;
        const expectedResult = this.getExpectedResult(player1, player2);
        const actualResult = winner === player1 ? 1 : 0;
        this.playerSkill[player1] += K * (actualResult - expectedResult);
        this.playerSkill[player2] += K * ((1 - actualResult) - (1 - expectedResult));
    }

    getExpectedResult(player1, player2) {
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

        // TODO: include other deck into calculation

        return P_winGivenCards / P_lossGivenCards;
    }
}
