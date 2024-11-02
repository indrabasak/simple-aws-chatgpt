const path = require('path');

/*We are basically telling webpack to take index.js from entry. Then check for all file extensions in resolve.
After that apply all the rules in module.rules and produce the output and place it in main.js in the public folder.*/

module.exports = {
    entry: './src/app/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        /** "extensions"
         * If multiple files share the same name but have different extensions, webpack will
         * resolve the one with the extension listed first in the array and skip the rest.
         * This is what enables users to leave off the extension when importing
         */
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        /** "rules"
         * This says - "Hey webpack compiler, when you come across a path that resolves to a '.js or .jsx'
         * file inside of a require()/import statement, use the babel-loader to transform it before you
         * add it to the bundle. And in this process, kindly make sure to exclude node_modules folder from
         * being searched"
         */
        rules: [
            {
                test: /\.(ts|tsx)$/, //kind of file extension this rule should look for and apply in test
                use: 'babel-loader', //loader which we are going to use
                exclude: /node_modules/, //folder to be excluded
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        // static: ['./dist'],
        compress: true,
        port: 9000,
    }
}