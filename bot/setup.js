'use strict';

// Jolastu Bot Setup (runonce)
// Funey, 2020.

// Get appropriate libraries (Settings, prompting)
const Settings = require("../common/Settings");
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

// Language "database" for possible I18n??

const Strings = {
    "English": {
        // Entry point text.
        USER_ENTRY_1: "Seeing as this is your first time running Jolastu, you're going to have to do some configuration so you can use the bot straight away.",
        USER_ENTRY_2: "Anything you type here will be immediately written to the configuration - if you make any mistakes just break out of the program.",

        // Section blocks.
        SECTION_ONE_TITLE: "-== SECTION ONE - Bot Appearance ==-",
        SECTION_TWO_TITLE: "-== SECTION TWO - Administrative Configuration ==-",

        // Questions - Section One.
        QUESTION_BOT_NAME: "What would you like to name your bot?",
        QUESTION_BOT_IMG: "Please provide a valid image URL for your bot (used in embeds)",
        QUESTION_BOT_PREFIX: "Please provide a prefix for your bot (e.g. !)",

        // Questions - Section Two.
        QUESTION_BOT_OWNERID: "What is the Discord User ID of the bot owner (e.g. 205419202318696448)",

        // Patches stuff.
        PATCHES_INIT: "Starting patch configuration...",
        PATCHES_START: "-== STARTING CONFIGURATION FOR PATCH WITH NAME '",
        PATCHES_START_SPLIT: "' ==-",

        // Success messages.
        CONFIG_COMPLETE: "Configuration completed. Pleae restart the bot.",

        // ERRORS START HERE
        ERROR_NO_TOKEN: "You haven't provided a Discord token - this is required in order to connect to Discord. Please set up an environment variable containing your token with name 'JOLASTU_TOKEN'.",
        ERROR_SETUP_FAILED: "Setup failed. Exiting..."
    }
}

// Oh yes, and also make sure we have the language SET (also for I18n).
const Language = "English";

// Start settings stuff.
console.log(Strings[Language].USER_ENTRY_1 + "\n\n" + Strings[Language].USER_ENTRY_2);

if (!process.env.JOLASTU_TOKEN) {
    console.log("\n" + Strings[Language].ERROR_NO_TOKEN);
    console.log("\n"+ Strings[Language].ERROR_SETUP_FAILED);
    process.exit(1);
}

// Section One start.
console.log("\n" + Strings[Language].SECTION_ONE_TITLE + "\n")

// Bot name.
var BOT_NAME = prompt(Strings[Language].QUESTION_BOT_NAME + ": ");
BOT_NAME = BOT_NAME || "Cat Bot";
console.log("\n");
Settings.writeConfig('bot_name', BOT_NAME);
console.log("\n");

// Bot image.
var BOT_IMAGE = prompt(Strings[Language].QUESTION_BOT_IMG + ": ");
BOT_IMAGE = BOT_IMAGE || "https://i.imgur.com/BBcy6Wc.jpg";
console.log("\n");
Settings.writeConfig('bot_image', BOT_IMAGE);
console.log("\n");

// Bot prefix.
var BOT_PREFIX = prompt(Strings[Language].QUESTION_BOT_PREFIX + ": ");
BOT_PREFIX = BOT_PREFIX || "!";
console.log("\n");
Settings.writeConfig('bot_prefix', BOT_PREFIX);
console.log("\n");

// Section Two start.
console.log("\n" + Strings[Language].SECTION_TWO_TITLE + "\n")

// Bot owner ID.
var BOT_OWNERID = prompt(Strings[Language].QUESTION_BOT_OWNERID + ": ");
BOT_OWNERID = BOT_OWNERID || "!";
console.log("\n");
Settings.writeConfig('bot_owner_id', BOT_OWNERID);
console.log("\n");


// PATCHES CONFIG
console.log(Strings[Language].PATCHES_INIT)



const patchDirectory = fs.readdirSync("./patches").filter(file => file.endsWith('.js'));
const patches = []

for (const file of patchDirectory) {
    patches[file.split('.').slice(0, -1).join('.')] = require("../patches/"+file);
    if (patches[file.split('.').slice(0, -1).join('.')].config !== undefined) {
        // Run the initialisation task.
        console.log(Strings[Language].PATCHES_START+file.split('.').slice(0, -1).join('.')+Strings[Language].PATCHES_START_SPLIT)
        patches[file.split('.').slice(0, -1).join('.')].config();
    }
}

// Config done.
console.log(Strings[Language].CONFIG_COMPLETE + "\n")
Settings.writeConfig('setup_done', true);
//console.log("\n")
process.exit(0)
