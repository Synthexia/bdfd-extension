# Change Log

## Release Stage

### 1.1.0
- Auto Completions Update.
  - Added detailed list of arguments.
  - Added tabstops for arguments (you will be able to disable/partially disable them in the future updates).
- Markdown support (Discord-like).
  - Only works with the proper syntax (by priority), i.e `**~~hello world~~**` won't work but `~~**hello world**~~` will.
  > Not yet added: Code-blocks due to current implementation issues.
- Code Refactoring ([Main](src/bdfd.ts) and [Language Bars](src/bars.ts)).
- Updated localization.
  - The `sync > commandList > afterSync > message` entry was updated.

### 1.0.0 (First Major Release)
- New Experiments:
  - Auto Completions
    > Note that they're still a bit unstable.
  - BDFD Sync
    > For more info, read the [Sync Guide](./Sync%20Resources/SYNC.md).
- Extension Source Code Update.
  > Switching to TypeScript, refactoring, etc.
- Fixed some bugs.
- Added highlighting for the new functions.
- Deleted snippets in favor of the future auto completions that available as an experimental feature right now.
- Updated README page.
  > Added the new badge.
  > General page update.
- Updated localization.
  - Added the new entries.
  - Updated Arabic localization (by [Musical](https://github.com/MusicalxD)).
- Added the Escape action to the context menu. An action to automatically escape special BDScript characters (`$`, `;`, etc).

## Preview Stage

### 0.5.0
- Added the new localization.
  > Ukrainian (by [RainbowKey](https://github.com/Rainb0wKey) and [Muhammad8999](https://github.com/Muhammad8999))
- Gradual Updating of Snippets.
  > Updated main code for snippets
- Created Localization Resources - a Localization Guide.

### 0.4.0
- New (Language) Status Bar.
- Added missing localizations.
- Added new localizations.
  > Deutsch/German (by [worte](https://github.com/wuaht)) and Nepalese (by [Rajat](https://github.com/rajatcj))
- Gradual Updating of Snippets.
- For now, "updated" snippets are disabled by default. You can enable them in extension's settings.
- Added highlighting for the new functions.
- Updated README page.
  > Added badges.

### 0.3.2
- Fixed an unexpected minor error when switching active editor.

### 0.3.1 ... 0.3.0
- Added localization support.
  > Currently added: Russian (by [NightNutSky](https://github.com/NightNutSky)), Arabic (by [Musical](https://github.com/MusicalxD)), Polish (by [MineBartekSA](https://github.com/MineBartekSA)), Hindi (by [Laza](https://github.com/LazaDev))
- Now the status bar hides if the active editor's language isn't BDScript.
- The extension's main code was a bit updated.

### 0.2.0
- Added the ability to reset all functions' foreground colors and font styles to default
  > Command: `>BDFD: Reset Functions' Foreground Colors and Font Styles to default`
- Gradual Updating of Snippets. Updates related to this will be released as patch updates. New snippets will gradually replace the old ones.
- README Update.

### 0.1.0
- Public release

## Private Alpha Stage

### 0.12.0-alpha
- If Statements Snippets prefixes were renamed
- Added new snippets

### 0.11.0-alpha
- Now you can set your own colors and font styles for function categories!
  > Command: `>BDFD: Customize Functions' Foreground Colors and Font Styles`
- Removed non-existent escape (`\[`) from the Escape snippet
- Added a status bar showing the extension version (perhaps there will be new functionality in the future)


### 0.10.0-alpha
- Main code was refactored and improved
- Added new snippets
- Keybinds now work only if the editor language is BDScript

### 0.9.0-alpha
- Main code was refactored and improved
- Updated BDFD Function List feature
- Updated README

### 0.8.0-alpha
- Added colorful comments
  > $c[ ... ]`, `$c[! ... ]`, `$c[? ... ]`, `$c[+ ... ]`, `$c[- ... ]`
- Added new snippets

### 0.7.0-alpha
- Deleted themes.
- Highlighting is available for any theme.
- Fixed `s` not being highlighted in `$removeButtons`.

### 0.6.0-alpha
- Added snippet/suggestion preview.
- Now accepting snippets and suggestions is done by TAB insted of ENTER.
- Added new snippets.
- Added hotkey for "Escapes" snippet: `ALT + D`.

### 0.5.0-alpha
- Added README and LICENSE.
- New file icons and logo (P.S everything is 2048x2048 pixels).
- New highlights and categories.
- New snippets.

### 0.4.0-alpha
- New highlights and categories.
- Added BDFD Function List. Get the description and tag of any function right from within VS Code!
  > Key bind (short cut): `CTRL + D`.
- Regex update.
- Preparting to add extension settings.

### 0.3.1-alpha
- Added match for `$var` (was removed by mistake).
- New Alpha Testers

### 0.3.0-alpha
- Discord Server
- New categories and colors for them.
- Regex update.

### 0.2.1-alpha
- Some individuals have gained access.

### 0.2.0-alpha ... 0.0.1-alpha
- The changes are hidden.