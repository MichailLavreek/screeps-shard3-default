const Source = {
    /** @param {Creep} creep */
    getSourceForMining: (creep) => {
        let sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        let sourcesMemory = Memory.sources;

        if (sources.length === 1) {
            return sources[0];
        }

        if (!sourcesMemory) {
            sourcesMemory = sources.map(source => {return {sourceId: source.id, creeps: []}});
        }

        let existsTargetSourceItem = sourcesMemory.find(item => item.creeps.includes(creep.name));

        if (existsTargetSourceItem) {
            return sources.find(item => item.id === existsTargetSourceItem.sourceId);
        }

        // TODO: find better way to unstuck creeps on '5bbcacba9099fc012e636191' source
        let sourceMemoryItemId = sourcesMemory.find(item => item.sourceId === '5bbcacba9099fc012e636191').creeps.length === 0 ? '5bbcacba9099fc012e636191' : '5bbcacba9099fc012e636192';
        let sourceMemoryItem = sourcesMemory.find(item => item.sourceId === sourceMemoryItemId);

        let targetSource = sources.find(source => sourceMemoryItem.sourceId === source.id);
        sourceMemoryItem.creeps.push(creep.name);

        Memory.sources = sourcesMemory;

        return targetSource;
    },

    /** @param {Creep} creep */
    harvest: (creep) => {
        let targetSource = Source.getSourceForMining(creep);

        if (creep.harvest(targetSource) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targetSource);
        }
    },

    /** @param {Creep} creep */
    stopHarvest: (creep) => {
        Source.clearMemoryFromNotExistsCreeps();

        if (!Memory.sources) {
            return;
        }

        Memory
            .sources
            .filter(item => item.creeps.includes(creep.name))
            .map(item => item.creeps.splice(item.creeps.indexOf(creep.name), 1));
    },

    clearMemoryFromNotExistsCreeps: () => {
        let existsCreepNames = Object.keys(Game.creeps);

        Memory
            .sources
            .map(sourceItem => sourceItem.creeps
                .filter(item => !existsCreepNames.includes(item))
                .map(item => sourceItem.creeps.splice(sourceItem.creeps.indexOf(item), 1)));
    }
};

module.exports = Source;
