import StyleDictionary from "style-dictionary";
import { register } from '@tokens-studio/sd-transforms';
import ThemesLoader from "sd-themes-loader";

register(StyleDictionary, {
    withSDBuiltins: false,
});

StyleDictionary.registerFormat({
    name: 'css/theme/variables',
    format: function (dictionary) {
        const className = this.themeName;

        /*
        const dictionary = {
            allTokens: [
                {
                    name: 'color-content-primary',
                    $value: '#fff',
                },
                {
                    name: 'color-content-secondary',
                    $value: '#000',
                },
            ]
        }
        */
        return `.${className} {
${dictionary.allTokens.map(function (token) {
    return `--${token.name}: ${token.$value};`;
}).join('\n')}
}`;
    }
});

StyleDictionary.registerTransform({
    name: 'assets/background',
    type: 'value',
    filter: function (token) {
        return token.$type === 'asset';
    },
    transform: function (token) {
        const svg = token.$value;

        return "url(/" + svg + ")";
    }
});


// () -> parámetros función
// {} -> objeto/cuerpo función
// [] -> listas

// load
const loader = ThemesLoader(StyleDictionary);

// /src/main.css
async function main () {
    const holder = await loader.load("/tokens");

    const globalConfig = {
        platforms: {
            web: {
                files: [
                    {
                        destination: 'build/global/variables.css',
                        format: 'css/variables'
                    }
                ],

                transforms: [
                    'name/kebab',
                    'ts/resolveMath',
                    'size/pxToRem',
                    'ts/typography/fontWeight',
                    'ts/size/lineheight',
                ]
            }
        }
    };

    const desktopConfig = {
        expand: true,
        platforms: {
            web: {
                files: [
                    {
                        destination: 'build/desktop/variables.css',
                        format: 'css/variables',
                        filter: 'NotSourced'
                    }
                ],

                transforms: [
                    'name/kebab',
                    'ts/resolveMath',
                    'size/pxToRem',
                    'ts/typography/fontWeight',
                    'ts/size/lineheight',
                ]
            }
        }
    };

    const mobileConfig = {
        expand: true,
        platforms: {
            web: {
                files: [
                    {
                        destination: 'build/mobile/variables.css',
                        format: 'css/variables',
                        filter: 'NotSourced'
                    }
                ],

                transforms: [
                    'name/kebab',
                    'ts/resolveMath',
                    'size/pxToRem',
                    'ts/typography/fontWeight',
                    'ts/size/lineheight',
                ]
            }
        }
    };

    const lightConfig = {
        platforms: {
            web: {
                files: [
                    {
                        destination: 'build/light/variables.css',
                        format: 'css/theme/variables',
                        filter: 'NotSourced',
                        themeName: 'light',
                    }
                ],

                transforms: [
                    'name/kebab',
                    'ts/resolveMath',
                    'size/pxToRem',
                    'assets/background'
                ]
            }
        }
    };

    const darkConfig = {
        platforms: {
            web: {
                files: [
                    {
                        destination: 'build/dark/variables.css',
                        format: 'css/theme/variables',
                        filter: 'NotSourced',
                        themeName: 'dark',
                    }
                ],

                transforms: [
                    'name/kebab',
                    'ts/resolveMath',
                    'size/pxToRem',
                    'assets/background'
                ]
            }
        }
    };
    // holder.print();

    holder.getThemeByName('global').addConfig(globalConfig).build();
    holder.getThemeByName('desktop').addConfig(desktopConfig).build();
    holder.getThemeByName('mobile').addConfig(mobileConfig).build();
    holder.getThemeByName('light').addConfig(lightConfig).build();
    holder.getThemeByName('dark').addConfig(darkConfig).build();

    holder.print();
}

main();

// esto es un comentario
// string, number, boolean, object, array

// const name = "Pablo";

// const person = {
//     isAmazing: true,
//     name: "Pablo",
//     lastname: "Fernandez",
//     age: 32,
//     list: ["test", 2],
// }

// console.log(person);
// console.log(person.age);
// console.log(person.isAmazing);
// console.log(person.list);
