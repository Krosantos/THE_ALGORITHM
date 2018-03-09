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
        const totalWins = _.sum(_.values(this.winTable));
        const totalLosses = _.sum(_.values(this.lossTable));
        const P_win = 1 - this.playerSkill[player1] / this.playerSkill[player2];
        return _.reduce(cards, (result, card) => {
            const timesCardSeen = this.winTable[card] + this.lossTable[card];
            if (!timesCardSeen) {
                return result;
            }

            const P_cardGivenWin = Math.max(this.winTable[card] / totalWins, 0.1); // assume no one card can possibly be worse than a 20% chance of winning
            const P_card = timesCardSeen / (totalWins + totalLosses);
            const card_value = P_cardGivenWin / P_card;
            return P_cardGivenWin * result;
        }, P_win);
    }
}

