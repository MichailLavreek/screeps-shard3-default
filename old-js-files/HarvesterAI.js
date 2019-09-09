
let HarvesterAI = {

    run: (creeps) => {

        let spawn = Game.spawns['Spawn1'];
        let room = spawn.room;
        let sources = room.find(FIND_SOURCES);

        sources.forEach((source, index) => {
            if (!creeps[index]) {
                return;
            }

            let containerNearSource = source.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_CONTAINER});
            let harvester = creeps[index];

            if (harvester.carry.energy < harvester.carryCapacity) {
                if (!harvester.pos.isEqualTo(containerNearSource.pos)) {
                    harvester.moveTo(containerNearSource);
                } else {
                    harvester.harvest(source);
                }
            } else {
                let freeSpace = containerNearSource.storeCapacity - containerNearSource.store[RESOURCE_ENERGY];
                if (freeSpace === 0) {
                    return;
                }

                let amountToDrop = freeSpace > harvester.carry[RESOURCE_ENERGY] ? harvester.carry[RESOURCE_ENERGY] : freeSpace;
                harvester.drop(RESOURCE_ENERGY, amountToDrop);
            }
        });
    }
};

module.exports = HarvesterAI;