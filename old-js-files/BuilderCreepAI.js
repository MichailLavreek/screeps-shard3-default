const Energy = require("./energy");

module.exports = {
    /** @param {Creep[]} creeps **/
    run: (creeps) => {
        creeps.map(creep => {
            if (creep.carry.energy === creep.carryCapacity || creep.carry.energy === 0) {
                creep.memory.buildInProgress = creep.carry.energy !== 0;
            }

            let target;
            if (creep.memory.buildInProgress) {
                let constructionSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);

                if (constructionSites.length === 0) {
                    let damagedStructures = creep.room.find(FIND_STRUCTURES, {filter: (s) => [STRUCTURE_WALL, STRUCTURE_RAMPART].includes(s.structureType) && s.hits < s.hitsMax}).sort((a, b) => Math.floor(a.hits / 10000) - Math.floor(b.hits / 10000));

                    if (damagedStructures.length > 0) {
                        let repairResult = creep.repair(damagedStructures[0]);
                        if (repairResult === ERR_NOT_IN_RANGE) {
                            creep.moveTo(damagedStructures[0]);
                        }
                        return;
                    }

                    creep.moveTo(Game.spawns['Spawn1'], {ignoreCreeps: false});
                    return;
                }

                target = constructionSites[0];

                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {ignoreCreeps: false});
                }
            } else {
                Energy.goForEnergy(creep);
            }
        });

    }
};