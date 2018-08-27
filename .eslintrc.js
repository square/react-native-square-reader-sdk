module.exports = {
    "extends": [
        "airbnb",
        "plugin:react-native/all"
    ],
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": ['.js','.jsx']
            }
        },
    },
    "plugins": [
        "react",
        "react-native"
    ],
    "env": {
        "react-native/react-native": true
    },
    "rules": {
        "react-native/no-unused-styles": 2,
        "react-native/split-platform-components": 2,
        "react-native/no-inline-styles": 2,
        "react-native/no-color-literals": 2,
        'no-use-before-define': 0,
        'react/jsx-filename-extension': 0,
    }
};
