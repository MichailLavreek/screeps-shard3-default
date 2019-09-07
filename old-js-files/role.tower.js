
module.exports = {
    /** @param {StructureTower} tower **/
    run: (tower) => {
        let room = Game.spawns['Spawn1'].room;

        let hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
        let structures = room.find(FIND_STRUCTURES);
        let walls = structures.filter(structure => structure.structureType === STRUCTURE_WALL);
        let ramparts = structures.filter(structure => structure.structureType === STRUCTURE_RAMPART);
        let roads = structures.filter(structure => structure.structureType === STRUCTURE_ROAD);

        let damagedWalls = walls.filter(structure => structure.hits < structure.hitsMax).sort((a, b) => a.hits - b.hits);
        let damagedRamparts = ramparts.filter(structure => structure.hits < (structure.hitsMax * 0.9)).sort((a, b) => a.hits - b.hits);
        let damagedRoads = roads.filter(structure => structure.hits < (structure.hitsMax * 0.9)).sort((a, b) => a.hits - b.hits);

        if (hostileCreeps.length > 0) {
            tower.attack(hostileCreeps[0]);
        }

        if (tower.energy < tower.energyCapacity * 0.5) {
            return;
        }

        if (damagedRoads.length > 0) {
            tower.repair(damagedRoads[0]);
        } else if (damagedRamparts.length > 0) {
            tower.repair(damagedRamparts[0]);
        }  else if (damagedWalls.length > 0) {
            tower.repair(damagedWalls[0]);
        }
    }
};