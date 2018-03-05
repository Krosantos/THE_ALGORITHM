const _ = require('lodash')
const brain = require('brain.js');
const NN = new brain.NeuralNetwork();

const run = (n) => {
    NN.train(require('./spain'));

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