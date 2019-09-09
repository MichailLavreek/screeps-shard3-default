
module.exports = {
    /** @param {StructureTower[]} towers **/
    run: (towers) => {
        towers.map(tower => {
            let room = Game.spawns['Spawn1'].room;

            let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
            let structures = room.find(FIND_STRUCTURES);
            let roads = structures.filter(structure => structure.structureType === STRUCTURE_ROAD);
            let containers = structures.filter(structure => structure.structureType === STRUCTURE_CONTAINER);

            let damagedRoads = roads.filter(structure => structure.hits < (structure.hitsMax * 0.9)).sort((a, b) => a.hits - b.hits);
            let damagedContainers = containers.filter(structure => structure.hits < (structure.hitsMax * 0.9)).sort((a, b) => a.hits - b.hits);

            if (hostileCreeps.length > 0) {
                tower.attack(hostileCreeps[0]);
            }

            if (tower.energy < tower.energyCapacity * 0.75) {
                return;
            }

            if (damagedContainers.length > 0) {
                tower.repair(damagedContainers[0]);
            } else if (damagedRoads.length > 0) {
                tower.repair(damagedRoads[0]);
            }
        });
    }
};