const roleHarvester = require('role.harvester');
const roleControllerSupport = require('role.controllerSupport');
const roleBuilder = require('role.builder');
const settings = require('settings');
const roleTower = require('role.tower');

declare let Memory: any;

export const loop = () => {
    if (!Memory.controller || !Memory.controller.history) {
        Memory.controller = {history: []};
    }

    if (!Memory.structures || !Memory.structures.history) {
        Memory.structures = {history: []};
    }

    Object.keys(Memory.creeps).filter(x => !Game.creeps[x]).map(x => delete Memory.creeps[x]);

    let spawn = Game.spawns['Spawn1'];
    let creeps = Object.keys(Game.creeps).map(creepName => Game.creeps[creepName]);

    let harvesters = creeps.filter(creep => creep.memory.role === 'harvester');
    let controllerSupports = creeps.filter(creep => creep.memory.role === 'controllerSupport');
    let builders = creeps.filter(creep => creep.memory.role === 'builder');

    let towers = spawn.room.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType === STRUCTURE_TOWER);

    let newCreepWorkerBody = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK];

    if (harvesters.length < settings.harvesters) {
        spawn.spawnCreep(newCreepWorkerBody, `Harvester${Math.ceil(Math.random() * 1000)}`, {memory: {role: 'harvester'}})
    }

    if (controllerSupports.length < settings.controllerSupports) {
        spawn.spawnCreep(newCreepWorkerBody, `ControllerSupport${Math.ceil(Math.random() * 1000)}`, {memory: {role: 'controllerSupport'}})
    }

    if (builders.length < settings.builders) {
        spawn.spawnCreep(newCreepWorkerBody, `Builder${Math.ceil(Math.random() * 1000)}`, {memory: {role: 'builder'}})
    }

    harvesters.map(creep => roleHarvester.run(creep));
    controllerSupports.map(creep => roleControllerSupport.run(creep));
    builders.map(creep => roleBuilder.run(creep));

    towers.map(structure => roleTower.run(structure));

    creeps.filter(creep => creep.ticksToLive < 1000).map(creep => spawn.renewCreep(creep));

    let totalDamageToRepair = (spawn.room.find(FIND_STRUCTURES).filter(structure => [STRUCTURE_WALL, STRUCTURE_RAMPART].includes(structure.structureType)).map(structure => structure.hitsMax - structure.hits).reduce((a, b) => a + b) / 1000000).toFixed(2);
    const itemsToMemoryStore = 200;
    const ticksIntervalToStore = 100;
    let controllerMemory = Memory.controller;
    let structuresMemory = Memory.structures;

    if (Game.time % ticksIntervalToStore === 0) {
        controllerMemory.history.push({ts: Game.time, level: spawn.room.controller.level, progress: spawn.room.controller.progress});
        structuresMemory.history.push({ts: Game.time, damageToRepair: totalDamageToRepair});
    }

    if (controllerMemory.history.length > itemsToMemoryStore) {
        controllerMemory.history.splice(0, controllerMemory.history.length - itemsToMemoryStore);
    }

    if (structuresMemory.history.length > itemsToMemoryStore) {
        structuresMemory.history.splice(0, structuresMemory.history.length - itemsToMemoryStore);
    }

    let upControllerEtaString = ``;
    let damageRepairEtaString = ``;

    if (controllerMemory.history.length > 0) {
        let controllerEnergyProgress = controllerMemory.history[controllerMemory.history.length - 1].progress - controllerMemory.history[0].progress;
        let controllerLevelEta = Math.floor((spawn.room.controller.progressTotal / controllerEnergyProgress) * (ticksIntervalToStore * controllerMemory.history.length));
        upControllerEtaString = `, up ETA: ${controllerLevelEta} ticks (${(controllerLevelEta / 60 / 60).toFixed(1)}h)`;
    }

    if (structuresMemory.history.length > 0) {
        let repairProgress = structuresMemory.history[0].damageToRepair - structuresMemory.history[structuresMemory.history.length - 1].damageToRepair;
        let repairEta = Math.floor((totalDamageToRepair / repairProgress) * (ticksIntervalToStore * structuresMemory.history.length));

        damageRepairEtaString = `, ETA: ${repairEta} ticks (${(repairEta / 60 / 60).toFixed(1)}h)`;
    }

    let infoTitle = `Room info`;
    let infoText1 = `energy: ${spawn.room.energyAvailable}/${spawn.room.energyCapacityAvailable}  |  controller: ${spawn.room.controller.level} (${((spawn.room.controller.progress / spawn.room.controller.progressTotal) * 100).toFixed(1)}%)${upControllerEtaString}`;
    let infoText2 = `construction sites: ${spawn.room.find(FIND_CONSTRUCTION_SITES).length} | damage to be repaired: ${totalDamageToRepair}M${damageRepairEtaString}`;
    let infoText3 = `creeps (h/cs/b): ${harvesters.length}/${controllerSupports.length}/${builders.length}`;
    let infoText4 = `new creep cost: ${newCreepWorkerBody.map(type => BODYPART_COST[type]).reduce((a, b) => a + b)}`;

    spawn.room.visual.text(infoTitle, 17, 29, {color: 'yellow', font: '20px', align: 'left'});
    spawn.room.visual.text(infoText1, 17, 30, {color: 'green', font: '16px', align: 'left'});
    spawn.room.visual.text(infoText2, 17, 31, {color: 'green', font: '16px', align: 'left'});
    spawn.room.visual.text(infoText3, 17, 32, {color: 'green', font: '16px', align: 'left'});
    spawn.room.visual.text(infoText4, 17, 33, {color: 'green', font: '16px', align: 'left'});
};
