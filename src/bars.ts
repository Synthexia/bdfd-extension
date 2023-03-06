export default function languageStatusBars(bar: any, extensions: any, languages: any, completions: any, l: any) {
    // Extension Version Bar
    const version = extensions.getExtension('nightnutsky.bdfd-bds')?.packageJSON.version;
    const version_bar = bar('bdfd-lsi-version', { language: 'bds' });
    version_bar.name = 'BDFD Extension';
    version_bar.text = l.bars.version.text;
    version_bar.detail = version;

    // Customize Highlighting Bar
    const customize_bar = bar('bdfd-lsi-customize', { language: 'bds' });
    customize_bar.name = 'BDFD Extension';
    customize_bar.text = l.bars.customize.text;
    customize_bar.command = {
        title: l.bars.customize.commandTitle,
        command: 'bdfd.tokencolors'
    };


    // Sync Bar
    const sync_bar = languages.createLanguageStatusItem('bdfd-lsi-sync', { language: 'bds' });
    sync_bar.name = 'BDFD Extension';
    sync_bar.text = '(E) Sync feature enabled';
    sync_bar.command = {
        title: 'Modify Command Data',
        command: 'bdfd.sync.modifyCommandData'
    };
}