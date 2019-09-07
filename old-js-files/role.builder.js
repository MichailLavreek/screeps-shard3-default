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
                let walls = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES).filter(structure => structure.structureType === STRUCTURE_WALL);
                let damagedWalls = walls.filter(structure => structure.hits < structure.hitsMax).sort((a, b) => Math.floor(a.hits / 10000) - Math.floor(b.hits / 10000));

                if (damagedWalls.length > 0) {
                    let repairResult = creep.repair(damagedWalls[0]);
                    if (repairResult === ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedWalls[0]);
                    }
                    return;
                }

                // if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1'], {ignoreCreeps: false});
                    return;
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