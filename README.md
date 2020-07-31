# Jolastu

Jolastu is yet another Discord bot designed for music playing and giveaways. This bot was a mix of efforts from xFuney and bredo228 over some months, and this code is a refactor of another bot that was in the works prior.

# Run Instructions

Install all dependencies using ``npm install``, run with ``npm run test``.

If there is no bot configuration in your application data, you will be taken through a 'runonce' setup to configure the bot.

# Environment Variables

**JOLASTU_TOKEN** is required to be set to a Discord token. Runonce setup will not function without it.

**KEY_YT** should be set to a YouTube API key, so that you can use the music system. Without this, the music functions will be disabled.
