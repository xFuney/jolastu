'use strict';

// Stuff for handling commands in the bootstrapper.

const fs = require('fs');
const path = require('path');

// Commands shall be loaded the same way as old Jolastu, but executed slightly differently.
const commandsDirectory = fs.readdirSync('./bot/commands/').filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandsDirectory) {
    commands[file.split('.').slice(0, -1).join('.')] = require("../bot/commands/" + file);
}

module.exports.loadCommands = function() {
    return commands;
}

module.exports.getVersions = function() {
    var versions = [];
    var temp = [];

    for (const file of commandsDirectory) {
        temp[file.split('.').slice(0, -1).join('.')] = require("../bot/commands/" + file);

        //console.log(temp[file.split('.').slice(0, -1).join('.')])
        if ( temp[file.split('.').slice(0, -1).join('.')].version !== undefined) {
            versions.push(temp[file.split('.').slice(0, -1).join('.')]);
        }
    }
    
    return versions;
}