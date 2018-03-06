const _ = require('lodash')
const bayes = require('bayes')
const classifier = bayes({ tokenizer: _.identity })

_.forEach(require('./gamesHistory'), (game) =>
    classifier.learn(game.deck1, game.winner)
);

const exampleCards = ['Take Inventory', 'Khenra Scrapper', 'Hour of Promise', 'Mummy Paramount'];
console.log(classifier.categorize(exampleCards));

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

    console.log(NN.run({
        playa1: 1,
        playa2: 2,
        dizzeck1: 2,
        dizzeck2: 1
    }));

    return {
        playas: activePlayas,
        observas: waitingPlayas
    }
}

module.exports = run;