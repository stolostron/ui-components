/* Copyright Contributors to the Open Cluster Management project */

const sass = require('sass');

module.exports = {
    addons: ['@storybook/addon-essentials', '@storybook/addon-storysource', '@storybook/addon-a11y'],
    stories: ['../src/**/*.stories.tsx', '../src/**/*.stories.jsx'],
    webpackFinal: async config => {
        config.module.rules.push(
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: { implementation: sass },
                    },
                ],
            },
        );
        config.resolve.extensions.push('.ts', '.tsx');
        return config;
    },
};
