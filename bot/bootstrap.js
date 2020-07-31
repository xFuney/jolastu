'use strict';

// Jolastu Bootstrap
// Funey, 2020

// Initialise everything we're going to use.

// Internal libraries.
const Logging = require('../common/Logging')
const Settings = require('../common/Settings')
const Command = require('../common/Command')
const Patches = require('../common/Patches')

// NodeJS Standard Libraries.
const fs = require('fs');
const path = require('path');

// External (npm) libraries.
const Discord = require('discord.js');
const client = new Discord.Client();
const ms = require("ms");
const { GiveawaysManager } = require("discord-giveaways");

// Versioning stuff.
client.versions = {
    "framework": "Jolastu v0.1.0"
}

var BOT_CONFIG = Settings.loadConfig();


// Initialisation of Discord Giveaway Manager.

const manager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;

// Load commands

var commands = Command.loadCommands();

// Fire on ready event.
client.on('ready', () => {
    BOT_CONFIG = Settings.loadConfig();
    // Intentionally logged normally as to reaffirm user that botcode has loaded.
    console.log(`Bot has connected to Discord, and is currently logged in as ${client.user.tag}!`);
    
    client.user.setActivity(`over /r/iPod and some other servers.`, { type: 'WATCHING'});

    Patches.execPatches(client, Discord);

});

// This is some old Jolastu code till I can be bothered to rewrite message handler.
client.on('message', msg => {
    // Regardless if this message is meant for us or not, run it through the antispam.
    //console.log("[MSG] Received message - running through antispam system.")
    //antiSpam.message(msg);

    BOT_CONFIG = Settings.loadConfig();
    commands = Command.loadCommands();
    //console.log("[MSG] Checking if this message was meant for us.")
    // Efficiency measure, make sure command is meant for us before even bothering to look.
    if (msg.content.substring(0,BOT_CONFIG.bot_prefix.length) == BOT_CONFIG.bot_prefix) {
        //console.log("[CMD] Message was intended for us, we can start parsing now.")
        // Remove the prefix from the command to ensure we can split arguments.
        //console.log("[CMD] Removing prefix to ensure argument split.")
        var ParsedMessage = msg.content.substring(BOT_CONFIG.bot_prefix.length, msg.content.length - BOT_CONFIG.bot_prefix.length + 2)
        //console.log("[CMD] ParsedMessage variable is currently " + ParsedMessage)
        // Split by spacebar, as that is our argument delimiter.
        //console.log("[CMD] Splitting parsed message to extract arguments.")
        var Arguments = ParsedMessage.split(" ")
        //console.log(Arguments)
        
        // We know that this is intended for us, so fully parse now.
        //console.log("[CMD] Starting full parse to run command...")
        var i;
        //console.log(commands)
        for (const catName in commands) {
            // So we're now getting category names, we can now refer to category objects!
            for (const commandName in commands[catName].commands) {
                let currentCmd = commands[catName].commands[commandName]

                if (Arguments[0] == commandName) {
                    // Execute
                    //console.log("[CMD] Executing...");
                    
                    // We no longer need to pass EVERYTHING now, since things are handled on a per-library basis!
                    // Just give them Client/Discord objects so they can act as us and all *should* be fine :D
                    currentCmd.execute(msg, Arguments, client, Discord)
                }
            }
            
        }
    }
})


client.login(process.env.JOLASTU_TOKEN)