'use strict';

// I'm rewriting Jolastu a second time. Come and fight me.
// ~ Funey, 2020

// Do stuff before entering the actual bot.js file
// Stuff like validating configuration and stuff, good stuff.

// Get the Settings library.
const Settings = require('../common/Settings');

const BotSettings = Settings.loadConfig();

if (!BotSettings.setup_done) {
    // Bot hasn't completed setup yet and is dumb. We can't start right now.
    // Throw the user into a configuration state.

    require('./setup');
}

// If we are at this point, the bot was configured successfully - hand off to the bootstrap.
require('./bootstrap')

