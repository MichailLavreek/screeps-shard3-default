const source = require('source');

module.exports = {
    /** @param {Creep} creep **/
    run: (creep) => {
        const spawn = Game.spawns['Spawn1'];
        const room = spawn.room;

        if (creep.carry.energy === 0) {
            creep.memory.isHarvesting = true;
        }

        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.isHarvesting = false;
        }

        if (creep.memory.isHarvesting) {
            source.harvest(creep);
        } else {
            source.stopHarvest(creep);

            let structures = room.find(FIND_MY_STRUCTURES);
            let extensions = structures.filter(structure => structure.structureType === STRUCTURE_EXTENSION);
            let towers = structures.filter(structure => structure.structureType === STRUCTURE_TOWER);

            let targets = [...extensions, spawn, ...towers];
            let notFullTarget = targets.find(structure => structure.energy < structure.energyCapacity);

            let target = notFullTarget || spawn;

            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {ignoreCreeps: false});
            }
        }
    }
};