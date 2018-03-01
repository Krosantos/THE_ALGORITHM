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
    activePlayas = activePlayas.map((playa, i) => ({
        playa,
        dizzeck: activeDizzecks[i]
    }));

    return {
        playas: activePlayas,
        observas: observas.concat(waitingPlayas)
    }
}