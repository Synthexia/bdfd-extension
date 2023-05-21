import loadExperiments from './experiments/loader';
import loadContextMenuUtils from './contextMenuUtils/loader';
import loadCommonCommands from './commonCommands/loader';
import loadStatusItems from './statusItems/loader';

/**
 * 0 - Function List
 * 
 * 1 - Extension Version
 * 
 * 2 - Customize Tokens
 * 
 * 3 - Sync Feature
 */
export const statusItems = loadStatusItems();

function features() {           
    loadCommonCommands();
    loadContextMenuUtils();
    loadExperiments();
}

exports.activate = features;
