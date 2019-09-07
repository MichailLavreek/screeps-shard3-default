const source = require('source');

module.exports = {
    /** @param {Creep} creep **/
    run: (creep) => {
        // console.log(JSON.stringify(creep));
        // console.log(JSON.stringify(creep.memory));
        if (creep.carry.energy === creep.carryCapacity || creep.carry.energy === 0) {
            creep.memory.buildInProgress = creep.carry.energy !== 0;
        }

        let target;
        if (creep.memory.buildInProgress) {
            source.stopHarvest(creep);
            let constructionSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);

            if (constructionSites.length === 0) {
                // if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1'], {ignoreCreeps: false});
                // }
            }

            target = constructionSites[0];

            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {ignoreCreeps: false});
            }
        } else {
            source.harvest(creep);
        }
    }
};