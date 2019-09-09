const Utils = require('./utils');

const SupporterCreepAI = require('./SupporterCreepAI');
const UpgraderCreepAI = require('./UpgraderCreepAI');
const BuilderCreepAI = require('./BuilderCreepAI');
const settings = require('./settings');

const TowerStructureAI = require('./TowerStructureAI');
const HarvesterAI = require('./HarvesterAI');

module.exports.loop = () => {
    Utils.memoryClear();

    let spawn = Game.spawns['Spawn1'];
    let creeps = Object.keys(Game.creeps).map(creepName => Game.creeps[creepName]);

    let harvesters = creeps.filter(creep => creep.memory.role === 'harvester');
    let upgraders = creeps.filter(creep => creep.memory.role === 'controllerSupport');
    let builders = creeps.filter(creep => creep.memory.role === 'builder');
    let supporters = creeps.filter(creep => creep.memory.role === 'supporter');

    let towers = spawn.room.find(FIND_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_TOWER});

    let newCreepWorkerBody = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
    let newCreepHarvesterBody = [MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
    let newCreepSupporterBody = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK];

    if (harvesters.length < settings.harvesters) {
        spawn.spawnCreep(newCreepHarvesterBody, `Harvester${Math.ceil(Math.random() * 1000)}`, {memory: {role: 'harvester'}})
    }

    if (supporters.length < settings.supporters) {
        spawn.spawnCreep(newCreepSupporterBody, `Supporter${Math.ceil(Math.random() * 1000)}`, {memory: {role: 'supporter'}})
    }

    if (upgraders.length < settings.controllerSupports) {
        spawn.spawnCreep(newCreepWorkerBody, `ControllerSupport${Math.ceil(Math.random() * 1000)}`, {memory: {role: 'controllerSupport'}})
    }

    if (builders.length < settings.builders) {
        spawn.spawnCreep(newCreepWorkerBody, `Builder${Math.ceil(Math.random() * 1000)}`, {memory: {role: 'builder'}})
    }

    HarvesterAI.run(harvesters);

    if (supporters.length === 0 && spawn.room.energyAvailable < spawn.room.energyCapacityAvailable) {
        SupporterCreepAI.run([...builders, ...upgraders]);
    } else {
        SupporterCreepAI.run(supporters);
        BuilderCreepAI.run(builders);
        UpgraderCreepAI.run(upgraders);
    }

    TowerStructureAI.run(towers);

    Utils.displayRoomInfo(spawn.room, 17, 29);
};