const _ = require('lodash')

const dizzecks = [
    'Merfolk',
    'Jim Davis',
    'SpellSlinger',
    'Explore',
    'GLORY'
]

const playas = [
    'J-Bar',
    'Tymko'
]

const observas = [
    'Aaron'
]

module.exports = (n) => {
    const activeDizzecks = _.sampleSize(dizzecks, n);
    let activePlayas = _.sampleSize(playas, n);
    const waitingPlayas = _.xor(activePlayas, playas);
    activePlayas = _.map(activePlayas, ((playa, i) => ({
        playa,
        dizzeck: _.nth(activeDizzecks, i)
    })));

    return {
        playas: activePlayas,
        observas: _.concat(observas, waitingPlayas)
    }
}