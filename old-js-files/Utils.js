
let Utils = {
    memoryClear: () => {
        Object.keys(Memory.creeps).filter(x => !Game.creeps[x]).map(x => delete Memory.creeps[x]);
    },

    /** @param {Room} room
     *  @param x
     *  @param y
     */
    displayRoomInfo: (room, x, y) => {
        let totalDamageToRepair = (room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_WALL, STRUCTURE_RAMPART].includes(structure.structureType)).map(structure => structure.hitsMax - structure.hits).reduce((a, b) => a + b) / 1000000).toFixed(2);
        let creeps = room.find(FIND_CREEPS);

        let harvesters = creeps.filter(creep => creep.memory.role === 'harvester');
        let controllerSupports = creeps.filter(creep => creep.memory.role === 'controllerSupport');
        let builders = creeps.filter(creep => creep.memory.role === 'builder');
        let supporters = creeps.filter(creep => creep.memory.role === 'supporter');

        let infoTitle = `Room info`;
        let infoText1 = `energy: ${room.energyAvailable}/${room.energyCapacityAvailable}  |  controller: ${room.controller.level} (${((room.controller.progress / room.controller.progressTotal) * 100).toFixed(1)}%)`;
        let infoText2 = `construction sites: ${room.find(FIND_CONSTRUCTION_SITES).length} | damage to be repaired: ${totalDamageToRepair}M`;
        let infoText3 = `creeps (h/cs/b/s): ${harvesters.length}/${controllerSupports.length}/${builders.length}/${supporters.length}`;
        // let infoText4 = `new creep cost (cs,b/h/s): ${newCreepWorkerBody.map(type => BODYPART_COST[type]).reduce((a, b) => a + b)}/${newCreepHarvesterBody.map(type => BODYPART_COST[type]).reduce((a, b) => a + b)}/${newCreepSupporterBody.map(type => BODYPART_COST[type]).reduce((a, b) => a + b)}`;

        room.visual.text(infoTitle, x, y, {color: 'yellow', font: '20px', align: 'left'});
        room.visual.text(infoText1, x, y + 1, {color: 'green', font: '16px', align: 'left'});
        room.visual.text(infoText2, x, y + 2, {color: 'green', font: '16px', align: 'left'});
        room.visual.text(infoText3, x, y + 3, {color: 'green', font: '16px', align: 'left'});
        // spawn.room.visual.text(infoText4, x, y + 4, {color: 'green', font: '16px', align: 'left'});
    }
};

module.exports = Utils;
