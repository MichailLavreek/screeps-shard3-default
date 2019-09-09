const Energy = {
    /** @param {Creep} creep */
    goForEnergy: (creep) => {
        let target;
        let existsTarget = creep.memory.target;

        if (existsTarget) {
            target = Game.getObjectById(existsTarget);

            if (target.structureType === STRUCTURE_CONTAINER && target.store[RESOURCE_ENERGY] > 0) {
                Energy.withdraw(creep, existsTarget);
                return;
            } else {
                creep.memory.target = null;
            }
        }

        let energyOnGround = creep.room.find(FIND_DROPPED_RESOURCES, {filter: (item) => item.resourceType === RESOURCE_ENERGY && item.amount > 50}).sort((a, b) => b.amount - a.amount);

        if (energyOnGround.length > 0) {
            target = energyOnGround[0];
            creep.memory.target = target.id;
            Energy.pickup(creep, target);
            return;
        }

        let containers = creep.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0}).sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);

        if (!containers || !containers[0]) {
            return;
        }

        target = containers[0];
        creep.memory.target = target.id;
        Energy.withdraw(creep, target);
    },

    withdraw: (creep, target) => {
        if (typeof target === 'string') {
            target = Game.getObjectById(target);
        }

        if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },

    pickup: (creep, target) => {
        if (typeof target === 'string') {
            target = Game.getObjectById(target);
        }

        if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};

module.exports = Energy;
