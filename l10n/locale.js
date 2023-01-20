const vscode = require('vscode');
const t = vscode.l10n.t;

const locale = {
    unknown_error: t('An unknown error has occured. The extension may not be able to function correctly. Details'),
    load_funcList_s: t('{0} - Successfully loaded', 'BDFD Function List'),
    load_funcList_f: t('{0} - Failed to load. Details', 'BDFD Function List'),
    qp_funcList_intents: t('Intents'),
    qp_funcList_premium: t('Premium'),
    qp_funcList_openWiki: t('Open wiki'),
    qp_funcList_select: t('Select Function'),
    qp_colors_foregroundColor: t('Foreground Color'),
    qp_colors_foreground: t('Foreground'),
    qp_colors_foregroundChange: t("Change the function's foreground color"),
    qp_colors_foregroundChanging: t('Changing Foreground Color'),
    qp_colors_fontStyle: t('Font Style'),
    qp_colors_font: t('Font'),
    qp_colors_fontChange: t("Change the function's font style"),
    qp_colors_fontChanging: t('Changing Font Style'),
    qp_colors_example: t('Example'),
    version_bar_text: t('Extension Version'),
    customize_bar_text: t('Customize Highlighting'),
    customize_bar_command_title: t('Show Editor'),
    functions_bar_text: t('Function List'),
    functions_bar_command_title: t('Show List'),
};

module.exports = locale;