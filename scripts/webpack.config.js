const path = require('path')
const NODE_ENV = process.env.NODE_ENV
const IsProduction = NODE_ENV === 'production'
const fs = require('fs')

const resolve = dir => {
    return path.resolve(__dirname, '../', dir)
}

let ver = 'latest', projectName = 'dist'
try {
    const packageJson = fs.readFileSync(resolve('./package.json'))
    const { version, name } = JSON.parse(packageJson)
    ver = version

    const splitIndex = name.indexOf('/')
    projectName = splitIndex > -1 ? name.slice(splitIndex + 1) : name 
}catch(err) {
    console.warn(err.toString())
}

const config = {
    entry: {
        app: resolve('./src/index.js')
    },
    output: {
        path: resolve('dist'),
        publicPath: '/',
        filename: IsProduction ? `${projectName}.${ver}.min.js` : `${projectName}.${ver}.js`,
        libraryTarget: 'umd',
        // 下划线或者中划线变驼峰变量
        library: projectName.replace(/[\_\-](\w)/g, (name, match) => {
            return match.toUpperCase()
        })
    },
    mode: NODE_ENV,
    module: {
        rules: [
            {
                test: /\.(js|mjs|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            }
        ]
    },
    plugins: []
}

module.exports = config
