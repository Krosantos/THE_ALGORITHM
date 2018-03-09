const _ = require('lodash')
const NaiveBayesClassifier = require('./naive_bayes')
const classifier = new NaiveBayesClassifier()

classifier.trainGames(require('./gamesHistory'));

const exampleCards = ['Take Inventory', 'Khenra Scrapper', 'Hour of Promise', 'Mummy Paramount'];
console.log(classifier.test(exampleCards, 'Aaron', 'Tymko'));
console.log(classifier.playerSkill);

const run = (n) => {
    const dizzecks = [
        'Merfolk',
        'Jim Davis',
        'SpellSlinger',
        'Explore',
        'GLORY'
    ]

    const playas = [
        'J-Bar',
        'Tymko',
        'Aaron'
    ]

    let observas = [
        'Aaron'
    ]

    const activeDizzecks = _.sampleSize(dizzecks, n);
    let activePlayas = _.sampleSize(playas, n);
    const waitingPlayas = _.xor(activePlayas, playas);
    activePlayas = _.map(activePlayas, ((playa, i) => ({
        playa,
        dizzeck: _.nth(activeDizzecks, i)
    })));

    return {
        playas: activePlayas,
        observas: waitingPlayas
    }
}

module.exports = run;
