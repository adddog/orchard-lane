const { resolve, join } = require("path")
const fs = require("fs")
const postcss = require("postcss")

module.exports = ctx => {
    const { cwd } = ctx
    return {
        //map: ctx.options.map,
        //parser: ctx.options.parser || (ctx.file.extname === '.sss' ? 'sugarss' : false),
        plugins: [
            /*require("postcss-external-vars")(
                JSON.parse(
                    fs.readFileSync(
                        join(cwd, "client/src/css/colors.json")
                    )
                )
            ),*/
            require("postcss-import")({
                root: cwd,
                path: [
                    resolve(cwd, "client/src/css/"),
                    resolve(cwd, "client/src/css/components/"),
                    resolve(cwd, "client/src/css/utilities/"),
                    resolve(cwd, "client/src/css/vars/")
                ]
            }),
            require("postcss-nested")(),
            require("postcss-extend")(),
            require("postcss-sassy-mixins")(),
            require("postcss-custom-properties")(),
            require("postcss-color-function")(),
            require("postcss-calc")(),
            /*require('postcss-magic-animations')({
                disableCheckCssVariables: true,
            }),*/
            require("postcss-icss-keyframes")(),
            require('postcss-animations')(),
            require("postcss-nested")(),
            require("postcss-easings"),
            require("postcss-timing-function"),
            require("postcss-inline-svg")({
                path: resolve(cwd, "client/src/css/images/")
            }),
            require("postcss-svgo")(),
            //require('postcss-simple-vars')(),
            /*require('postcss-cssnext')({
              browsers: ['last 2 versions', '> 5%'],
              extensions: {
                '--phone': '(min-width: 544px)',
                '--tablet': '(min-width: 768px)',
                '--desktop': '(min-width: 992px)',
                '--large-desktop': '(min-width: 1200px)',
              },
            }),*/
            require("postcss-custom-media")({
                extensions: {
                    "--phone": "(min-width: 360px)",
                    "--phablet": "(min-width: 540px)",
                    "--tablet": "(min-width: 768px)",
                    "--tablet-max": "(max-width: 768px)",
                    "--desktop": "(min-width: 992px)",
                    "--large-desktop": "(min-width: 1200px)"
                }
            }),
            require("autoprefixer")({
                browsers: ["last 2 versions", "Safari 8", "ie > 9"]
            })
            /*require('postcss-custom-properties')(),
            //require('postcss-cssnext')(),*/
        ]
    }
}
