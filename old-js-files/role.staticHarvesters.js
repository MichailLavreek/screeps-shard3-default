
module.exports = {

    run: (harvesters) => {

        let spawn = Game.spawns['Spawn1'];
        let room = spawn.room;
        let sources = room.find(FIND_SOURCES);

        sources.forEach((source, index) => {
            if (!harvesters[index]) {
                console.log('!harvesters[index]');
                return;
            }

            let harvester = harvesters[index];
            console.log(17, harvester);

            if (harvester.energy < harvester.energyCapacity) {
                let harvestResult = harvester.harvest(source);
                console.log(21, harvestResult);

                if (harvestResult === ERR_NOT_IN_RANGE) {
                    harvester.moveTo(source);
                }
            } else {
                let containerNearSource = source.pos.findClosestByRange(FIND_SOURCES, 2, {filter: (s) => s.structureType === STRUCTURE_CONTAINER});
                console.log(29, containerNearSource);
                let transferResult = harvester.transfer(containerNearSource, RESOURCE_ENERGY);
                console.log(31, transferResult);
            }
        });
    }
};