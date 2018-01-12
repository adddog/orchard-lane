const { resolve, join } = require("path")
const fs = require("fs")
const postcss = require("postcss")

module.exports = () => {
    const cwd = __dirname
    return {
        plugins: [
            require("postcss-import")({
                root: cwd,
                path: [
                    resolve(cwd, "client/src/css/"),
                    resolve(cwd, "client/src/css/components/"),
                    resolve(cwd, "client/src/css/utilities/"),
                    resolve(cwd, "client/src/css/vars/"),
                ],
            }),
            require("postcss-nested")(),
            require("postcss-extend")(),
            require("postcss-sassy-mixins")(),
            require("postcss-custom-properties")(),
            require("postcss-color-function")(),
            require("postcss-calc")(),
            require("postcss-icss-keyframes")(),
            require("postcss-animations")(),
            require("postcss-nested")(),
            require("postcss-easings"),
            require("postcss-timing-function"),
            require("postcss-inline-svg")({
                path: resolve(cwd, "client/src/css/images/"),
            }),
            require("postcss-svgo")(),
            require("postcss-custom-media")({
                extensions: {
                    "--phone": "(min-width: 360px)",
                    "--phablet": "(min-width: 540px)",
                    "--tablet": "(min-width: 768px)",
                    "--tablet-max": "(max-width: 768px)",
                    "--desktop": "(min-width: 992px)",
                    "--large-desktop": "(min-width: 1200px)",
                },
            }),
            require("autoprefixer")({
                browsers: ["last 2 versions", "Safari 8", "ie > 9"],
            }),
        ],
    }
}
