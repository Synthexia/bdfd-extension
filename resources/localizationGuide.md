# Introduction
There're many languages, but the developer isn't a polyglot to know every existing language.

If you want to see the extension in your native language and you know English **well**, you can help localize the extension.\
This page is a short localization guide.

# Localization Guide

## Basic Rules
1. You must be a native speaker of the language you're localizing.
    > The only exception can be if you really know the localized language well, or you work in a team with a native speaker of this language.
2. Localize wisely. Don't try to troll by providing intentionally incorrect localization.
3. Please don't use Google Translate or other similar apps while localizing if you're actually bad at English. It will be shameless.

## Preparation
1. You should be able to work with GitHub projects in a basic way.
    > If not, read the documentation for the stuff you need right now - About [Pull Requests](https://docs.github.com/en/pull-requests) and [Forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks).
2. Fork the project.

## Adding a Localization
This section contains a guide if there's no localization for your language yet.

1. Create a file in `l10n` directory that will contain the localization.
2. Name this file as `bundle.l10n.<id>.json`. Replace `<id>` with the correct id for your language according to [Curated List of Languages](https://mozilla-l10n.github.io/firefox-languages/).
3. Copy the actual strings available for localization from the [strings-without-comments.json](./files/localization//strings-without-comments.json) file (and check out the [strings.jsonc](.//files/localization/strings.jsonc) file to view comments for some strings, this actually will help you in some cases).
4. Localize them.
5. Create a pull request.
6. Wait for review.

## Updating a Localization
This section contains a guide if you're updating an existing localization.

1. Find the file containing the localization of your language in `l10n` directory.
2. Make sure its content is up to date. If not, refer to [Adding a Localization](#adding-a-localization) section and add the missing strings.
3. Update the localization.
4. Create a pull request.
5. Wait for review.
