import fsModule from 'fs';

const fs = fsModule.promises;

function Theme ({ name, group, tokenFiles }) {
    return {
        name,
        group,
        tokenFiles,
        addConfig(config) { 
            this.config = Object.assign(config, {
                source: this.tokenFiles,
            });
        },
    };
}

Theme.of = (tokensPath, themeEntry, metadata) => Theme({
    name: themeEntry.name,
    group: themeEntry.group,
    tokenFiles: metadata.tokenSetOrder
        .filter(tokenSet => themeEntry.selectedTokenSets[tokenSet] && themeEntry.selectedTokenSets[tokenSet] && themeEntry.selectedTokenSets[tokenSet] !== 'disabled')
        .map(tokenSet => `${process.cwd()}/${tokensPath}/${tokenSet.replaceAll(' ', '')}.json`),
 
});

function ThemesHolder (themes) {

    return {
        getThemeByName(name) {
            return themes.find(theme => theme.name === name);
        },

        addConfig(name, config) {
            this.getThemeByName(name).addConfig(config);
        }
    }
}

ThemesHolder.of = (themes, path, metadata) => {
    return ThemesHolder(themes.map(theme => Theme.of(path, theme, metadata)));
}

async function loadThemes (tokensPath) {
    const themes = JSON.parse(await fs.readFile(process.cwd() + `${tokensPath}/$themes.json`, 'utf-8')); 
    const metadata = JSON.parse(await fs.readFile(process.cwd() + `${tokensPath}/$metadata.json`))

    return ThemesHolder.of(themes, tokensPath, metadata);
}

export default loadThemes;
