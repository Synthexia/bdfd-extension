import { StatusItems } from ".";

export default function loadStatusItems() {
    return [
        StatusItems.initFunctionListItem(),
        StatusItems.initExtensionVersionItem(),
        StatusItems.initCustomizeTokensItem(),
        StatusItems.initSyncFeatureItem()
    ];
}
