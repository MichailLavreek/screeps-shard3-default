
module.exports = {
    /** @param {StructureTower} tower **/
    run: (tower) => {
        let room = Game.spawns['Spawn1'].room;

        let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        let structures = room.find(FIND_STRUCTURES);
        let defenceStructures = structures.filter(structure => [STRUCTURE_WALL, STRUCTURE_RAMPART].includes(structure.structureType));
        let roads = structures.filter(structure => structure.structureType === STRUCTURE_ROAD);
        let containers = structures.filter(structure => structure.structureType === STRUCTURE_CONTAINER);
        let damagedDefenceStructures = defenceStructures.filter(structure => structure.hits < (structure.hitsMax * 0.9)).sort((a, b) => a.hits - b.hits);

        let damagedRoads = roads.filter(structure => structure.hits < (structure.hitsMax * 0.9)).sort((a, b) => a.hits - b.hits);
        let damagedContainers = containers.filter(structure => structure.hits < (structure.hitsMax * 0.9)).sort((a, b) => a.hits - b.hits);

        if (hostileCreeps.length > 0) {
            tower.attack(hostileCreeps[0]);
        }

        if (tower.energy < tower.energyCapacity * 0.8) {
            return;
        }

        if (damagedContainers.length > 0) {
            tower.repair(damagedContainers[0]);
        } else if (damagedRoads.length > 0) {
            tower.repair(damagedRoads[0]);
        } else if (damagedDefenceStructures.length > 0) {
            tower.repair(damagedDefenceStructures[0]);
        }
    }
};