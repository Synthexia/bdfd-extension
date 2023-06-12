import { StatusItems } from ".";

const loadStatusItems = () => [
    StatusItems.initFunctionListItem(),
    StatusItems.initCustomizeTokensItem(),
    StatusItems.initSyncFeatureItem(),
    StatusItems.initExtensionVersionItem()
];

export default loadStatusItems;
