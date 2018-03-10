const _ = require('lodash')
const decks = require('./decks');
const NaiveBayesClassifier = require('./naive_bayes')
const classifier = new NaiveBayesClassifier()

classifier.trainGames(require('./gamesHistory'));

const run = (n) => {
    const dizzecks = _.keys(decks);

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

    console.log(classifier.predictGame(activePlayas));
    console.log({
        playas: activePlayas,
        observas: waitingPlayas
    });
}

run(2);
module.exports = run;
