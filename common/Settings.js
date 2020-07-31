'use strict';

// Settings handler for Jolastu
// Funey, 2020.

// Load libraries.

const fs = require('fs');
const path = require("path");

const Logging = require('./Logging');

const DefaultConfiguration = {
    bot_owner_id: 12345678901234567890,
    bot_name: "Cat Bot",
    bot_prefix: "!",
    bot_env: "dev",
    bot_image: "https://i.imgur.com/BBcy6Wc.jpg",
    music_leaveAfterDone: true,
    bredo_servermon__enable: true,
    bredo_servermon__cpuThreshold: 25,
    bredo_servermon__intervalSeconds: 5,
    bredo_servermon__sysop: "1983235073250327508",
    bredo_servermon__sysop_log_channel: "18214210472107408",
    infraction_logging_enabled: true,
    infraction_log_channel: "18214210472107408",
    setup_done: false
}

// Allows for settings to be handled globally? How cool.
module.exports.loadConfig = function(FileName) {
    FileName = FileName || "bot_config.json";

    Logging.log('SETTINGS', 'Reading configuration from file "' + FileName + '"...')

    let configDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
    if (fs.existsSync(path.join(configDir, "/" + FileName))) {
        Logging.log('SETTINGS', 'Configuration file "' + FileName + '" exists. Returning.')
        return require(path.join(configDir, "/" + FileName))
    } else {
        Logging.log('SETTINGS', 'Configuration file "' + FileName + '" does NOT exist. Creating configuration based off DefaultConfiguration and returning.', 1)
        fs.writeFileSync(path.join(configDir, "/" + FileName), JSON.stringify(DefaultConfiguration))
        return DefaultConfiguration;
    }
}

module.exports.writeConfig = function (property, value, fileName) {
    // Make sure the filename gets set to something if it wasn't declared.
    fileName = fileName || "bot_config.json";

    Logging.log('SETTINGS', 'Changing property "' + property + '" in configuration file "' + fileName + '"...')
    let configDir = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")

    if (fs.existsSync(path.join(configDir, "/" + fileName))) {
        Logging.log('SETTINGS', 'Configuration file "' + fileName + '" exists. Making changes.')
        var CurrentConfig = require(path.join(configDir, "/" + fileName));
        CurrentConfig[property] = value;
        Logging.log('SETTINGS', 'Saving changes made to "' + fileName + '".')
        fs.writeFileSync(path.join(configDir, "/" + fileName), JSON.stringify(CurrentConfig))
    } else {
        Logging.log('SETTINGS', 'Configuration file "' + fileName + '" does not exist. Cannot make changes - returning.');
        return false;
    }
}