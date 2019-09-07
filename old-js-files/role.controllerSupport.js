const source = require('source');

module.exports = {
    /** @param {Creep} creep **/
    run: (creep) => {
        if (creep.carry.energy === creep.carryCapacity || creep.carry.energy === 0) {
            creep.memory.upgradingInProgress = creep.carry.energy !== 0;
        }

        let target;
        if (creep.memory.upgradingInProgress) {
            source.stopHarvest(creep);
            target = Game.spawns['Spawn1'].room.controller;

            if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {ignoreCreeps: false});
            }
        } else {
            source.harvest(creep);
        }
    }
};