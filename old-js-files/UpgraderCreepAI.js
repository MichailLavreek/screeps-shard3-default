const Energy = require("./energy");

module.exports = {
    /** @param {Creep[]} creeps **/
    run: (creeps) => {
        creeps.map(creep => {
            if (creep.carry.energy === creep.carryCapacity || creep.carry.energy === 0) {
                creep.memory.upgradingInProgress = creep.carry.energy !== 0;
            }

            let target;
            if (creep.memory.upgradingInProgress) {
                target = Game.spawns['Spawn1'].room.controller;

                if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {ignoreCreeps: false});
                }
            } else {
                Energy.goForEnergy(creep);
            }
        });
    }
};