import loadExperiments from './experiments/loader';
import loadContextMenuUtils from './contextMenuUtils/loader';
import loadCommonCommands from './commonCommands/loader';
import loadStatusItems from './statusItems/loader';

export const statusItems = loadStatusItems();

function features() {           
    loadCommonCommands();
    loadContextMenuUtils();
    loadExperiments();
}

exports.activate = features;
