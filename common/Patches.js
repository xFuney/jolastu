'use strict';

// Stuff for handling patches in the bootstrapper.

const fs = require('fs');
const path = require('path');

// Initialise things for patch loading.
const patchDirectory = fs.readdirSync("./patches").filter(file => file.endsWith('.js'));
const patches = []


for (const file of patchDirectory) {
    patches[file.split('.').slice(0, -1).join('.')] = require("../patches/"+file);
}

module.exports.loadPatches = function() {
    return patches;
}

module.exports.execPatches = function(client, Discord) {
    for (const file of patchDirectory) {
        patches[file.split('.').slice(0, -1).join('.')] = require("../patches/"+file);
        if (patches[file.split('.').slice(0, -1).join('.')].config !== undefined) {
            // Load bot patch
            patches[file.split('.').slice(0, -1).join('.')].run(client, Discord);
        }
    }
}