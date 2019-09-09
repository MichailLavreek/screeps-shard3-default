const Energy = require("./energy");

let SupporterCreepAI = {
    /** @param {Creep[]} creeps **/
    run: (creeps) => {
        creeps.map(creep => {
            const spawn = Game.spawns['Spawn1'];
            const room = spawn.room;

            if (creep.carry.energy === 0) {
                creep.memory.goingForEnergy = true;
            }

            if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.goingForEnergy = false;
            }

            if (creep.memory.goingForEnergy) {

                Energy.goForEnergy(creep);

            } else {

                let structures = room.find(FIND_STRUCTURES, {filter: (s) => [STRUCTURE_EXTENSION, STRUCTURE_TOWER].includes(s.structureType) && s.energy < s.energyCapacity});
                let extensions = structures.filter(structure => structure.structureType === STRUCTURE_EXTENSION);
                let target;

                if ((spawn.energyCapacity * 0.5) > spawn.energy) {
                    SupporterCreepAI.transfer(creep, spawn);
                    return;
                }

                if (extensions.length > 0) {
                    target = creep.pos.findClosestByPath(extensions);

                    SupporterCreepAI.transfer(creep, target);
                    return;
                }

                let towers = structures.filter(structure => structure.structureType === STRUCTURE_TOWER);
                let storage = room.storage;
                console.log(storage);

                let targets = [...extensions, spawn, ...towers];
                target = targets.find(structure => structure.energy < structure.energyCapacity);

                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {ignoreCreeps: false});
                }
            }
        });
    },

    transfer: (creep, target) => {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {ignoreCreeps: false});
        }
    }
};

module.exports = SupporterCreepAI;