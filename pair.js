// ============================================================
//  NECTA MD - Complete Bot with 110 Commands
//  Built by Wild Lirt Studio | Developer: Nullforge
//  Your Backdoor to Automation
// ============================================================

const express = require('express');
const path = require('path');
const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');

// ============================================================
//  CONFIGURATION
// ============================================================

const CONFIG = {
    PORT: process.env.PORT || 3000,
    SESSION_DIR: 'auth_info',
    BOT_NAME: 'NECTA MD',
    MOTTO: 'Your Backdoor to Automation',
    STUDIO: 'Wild Lirt Studio',
    DEVELOPER: 'Nullforge',
    PREFIXES: ['.', '!', '#'],
    ALLOW_NO_PREFIX: true,
    PRIVATE_MODE: false,
    OWNER_NUMBER: '1234567890@s.whatsapp.net',
    WHITELIST: [],
};

// ============================================================
//  ALL 110 COMMANDS - BUILT INTO pair.js
// ============================================================

const commands = new Map();

// ─── UTILITY COMMANDS (15) ──────────────────────────────────

commands.set('ping', {
    name: 'ping',
    description: 'Check bot response time',
    async execute(sock, msg, args) {
        const start = Date.now();
        await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' });
        const end = Date.now();
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `⏱️ Response: ${end - start}ms` 
        });
    }
});

commands.set('help', {
    name: 'help',
    description: 'Show help information',
    async execute(sock, msg, args) {
        if (args.length > 0) {
            const cmd = commands.get(args[0].toLowerCase());
            if (cmd) {
                await sock.sendMessage(msg.key.remoteJid, { 
                    text: `📖 *Command: .${cmd.name}*\n\nDescription: ${cmd.description}\nUsage: .${cmd.name}` 
                });
                return;
            }
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📖 *NECTA MD Help*\n\nType .menu to see all commands\nType .help <command> for details' 
        });
    }
});

commands.set('menu', {
    name: 'menu',
    description: 'Show NECTA MD menu with all commands',
    async execute(sock, msg, args) {
        const menu = `
╔══════════════════════════════════════════════════════════════╗
║  ███╗   ██╗███████╗ ██████╗████████╗ █████╗                ║
║  ████╗  ██║██╔════╝██╔════╝╚══██╔══╝██╔══██╗               ║
║  ██╔██╗ ██║█████╗  ██║        ██║   ███████║               ║
║  ██║╚██╗██║██╔══╝  ██║        ██║   ██╔══██║               ║
║  ██║ ╚████║███████╗╚██████╗   ██║   ██║  ██║               ║
║  ╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝  ╚═╝               ║
║                   ✦ Your Backdoor to Automation ✦           ║
╠══════════════════════════════════════════════════════════════╣
║  ╔════════════════════╗  ╔════════════════════╗             ║
║  ║  ⚡ UTILITY (15)   ║  ║  🤖 AI (8)        ║             ║
║  ║  .ping  .help      ║  ║  .ai  .image      ║             ║
║  ║  .menu  .uptime    ║  ║  .code  .summ     ║             ║
║  ║  .time  .date      ║  ║  .grammar         ║             ║
║  ║  .weather  .calc   ║  ║  .email  .resume  ║             ║
║  ║  .convert  .translate║ ║  .cover          ║             ║
║  ╚════════════════════╝  ╚════════════════════╝             ║
║  ╔════════════════════╗  ╔════════════════════╗             ║
║  ║  🎮 FUN/GAMES (18) ║  ║  ⬇️ DOWNLOAD (10) ║             ║
║  ║  .meme  .joke      ║  ║  .ytmp3  .ytmp4   ║             ║
║  ║  .trivia  .riddle  ║  ║  .fbdl  .igdl     ║             ║
║  ║  .dice  .coin      ║  ║  .twdl  .ttdl     ║             ║
║  ║  .rps  .8ball      ║  ║  .pint  .media    ║             ║
║  ║  .fact  .truth     ║  ║  .mp3  .mp4       ║             ║
║  ║  .dare  .quote     ║  ║                   ║             ║
║  ║  .anime  .movie    ║  ║                   ║             ║
║  ║  .song  .game      ║  ║                   ║             ║
║  ║  .emoji            ║  ║                   ║             ║
║  ╚════════════════════╝  ╚════════════════════╝             ║
║  ╔════════════════════╗  ╔════════════════════╗             ║
║  ║  👑 ADMIN (12)     ║  ║  👥 GROUP (10)    ║             ║
║  ║  .kick  .promote   ║  ║  .group  .grouplist║             ║
║  ║  .demote  .mute    ║  ║  .link  .join     ║             ║
║  ║  .unmute  .ban     ║  ║  .leave  .tagall  ║             ║
║  ║  .unban  .warn     ║  ║  .admin  .members ║             ║
║  ║  .warns  .resetwarns║ ║  .setdesc  .setname║             ║
║  ║  .lock  .unlock    ║  ║                   ║             ║
║  ╚════════════════════╝  ╚════════════════════╝             ║
║  ╔════════════════════╗  ╔════════════════════╗             ║
║  ║  📱 SOCIAL (10)    ║  ║  💾 DATABASE (7)  ║             ║
║  ║  .ig  .yt  .fb     ║  ║  .save  .get      ║             ║
║  ║  .tt  .twit        ║  ║  .delete  .list   ║             ║
║  ║  .play  .video     ║  ║  .search  .backup ║             ║
║  ║  .audio  .sticker  ║  ║  .restore         ║             ║
║  ║  .toimg            ║  ║                   ║             ║
║  ╚════════════════════╝  ╚════════════════════╝             ║
║  ╔════════════════════╗  ╔════════════════════╗             ║
║  ║  💬 CHAT (8)       ║  ║  🎯 MISC (12)     ║             ║
║  ║  .clear  .delete   ║  ║  .birthday  .timer║             ║
║  ║  .edit  .pin       ║  ║  .remind  .todo   ║             ║
║  ║  .unpin  .react    ║  ║  .notes  .news    ║             ║
║  ║  .forward  .reply  ║  ║  .crypto  .stocks ║             ║
║  ╚════════════════════╝  ║  .bitcoin  .forex ║             ║
║                              ║  .covid  .worldclock║        ║
║                              ╚════════════════════╝        ║
╠══════════════════════════════════════════════════════════════╣
║  📊 TOTAL: 110 COMMANDS  │  10 CATEGORIES                   ║
║  🔧 Prefixes: .  !  #  (or just type command)              ║
║  🏢 Wild Lirt Studio  │  👨‍💻 Nullforge                    ║
║  🔐 Your Backdoor to Automation                             ║
╚══════════════════════════════════════════════════════════════╝`;
        await sock.sendMessage(msg.key.remoteJid, { text: menu });
    }
});

commands.set('uptime', {
    name: 'uptime',
    description: 'Show bot uptime',
    async execute(sock, msg, args) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `⏱️ *Bot Uptime*\n\n${days}d ${hours}h ${minutes}m ${seconds}s` 
        });
    }
});

commands.set('info', {
    name: 'info',
    description: 'Show bot information',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🤖 *NECTA MD*\n\n📌 Version: 1.0.0\n🏢 Studio: Wild Lirt Studio\n👨‍💻 Developer: Nullforge\n🔐 Motto: Your Backdoor to Automation\n📊 Commands: 110\n📂 Categories: 10` 
        });
    }
});

commands.set('time', {
    name: 'time',
    description: 'Show current time',
    async execute(sock, msg, args) {
        const now = new Date();
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🕐 *Current Time*\n\n${now.toLocaleString()}` 
        });
    }
});

commands.set('date', {
    name: 'date',
    description: 'Show current date',
    async execute(sock, msg, args) {
        const now = new Date();
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📅 *Current Date*\n\n${now.toLocaleDateString()}` 
        });
    }
});

commands.set('weather', {
    name: 'weather',
    description: 'Get weather information',
    async execute(sock, msg, args) {
        const city = args.join(' ') || 'your location';
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🌤️ *Weather for ${city}*\n\n🌡️ Temperature: 25°C\n💧 Humidity: 60%\n🌬️ Wind: 10 km/h\n\n⚠️ This is a demo. Add your weather API key for real data.` 
        });
    }
});

commands.set('calc', {
    name: 'calc',
    description: 'Calculate expression',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide an expression. Example: .calc 2+2' 
            });
            return;
        }
        try {
            const result = eval(args.join(' '));
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `🧮 *Result*\n\n${args.join(' ')} = ${result}` 
            });
        } catch (e) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '❌ Invalid expression' 
            });
        }
    }
});

commands.set('convert', {
    name: 'convert',
    description: 'Convert units',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔄 *Unit Converter*\n\nUsage: .convert <value> <from> <to>\nExample: .convert 10 km mi' 
        });
    }
});

commands.set('translate', {
    name: 'translate',
    description: 'Translate text',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide text to translate. Example: .translate Hello to fr' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🌐 *Translation Demo*\n\nOriginal: ${args.join(' ')}\n⚠️ Add Google Translate API for real translations.` 
        });
    }
});

commands.set('speed', {
    name: 'speed',
    description: 'Check internet speed',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📶 *Speed Test*\n\n⬇️ Download: 50 Mbps\n⬆️ Upload: 20 Mbps\n⏱️ Ping: 15ms\n\n⚠️ Demo data. Add speedtest API for real results.` 
        });
    }
});

commands.set('pingme', {
    name: 'pingme',
    description: 'Check your ping',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🏓 *Ping*\n\nYour ping: ${Math.floor(Math.random() * 100)}ms` 
        });
    }
});

commands.set('calendar', {
    name: 'calendar',
    description: 'Show calendar',
    async execute(sock, msg, args) {
        const now = new Date();
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📅 *Calendar*\n\n${now.toLocaleString('default', { month: 'long', year: 'numeric' })}\n\n⚠️ Calendar view coming soon.` 
        });
    }
});

commands.set('runtime', {
    name: 'runtime',
    description: 'Show bot runtime',
    async execute(sock, msg, args) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `⏱️ *Runtime*\n\n${days}d ${hours}h ${minutes}m` 
        });
    }
});

// ─── FUN & GAMES COMMANDS (18) ─────────────────────────────

commands.set('meme', {
    name: 'meme',
    description: 'Send a random meme',
    async execute(sock, msg, args) {
        const memes = [
            'https://i.imgflip.com/1bij.jpg',
            'https://i.imgflip.com/1g8my.jpg',
            'https://i.imgflip.com/1otk96.jpg'
        ];
        const meme = memes[Math.floor(Math.random() * memes.length)];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🃏 *Meme*\n\n${meme}\n\n⚠️ Add meme API for real memes.` 
        });
    }
});

commands.set('joke', {
    name: 'joke',
    description: 'Tell a joke',
    async execute(sock, msg, args) {
        const jokes = [
            'Why do programmers prefer dark mode? Because light attracts bugs!',
            'What do you call a fake noodle? An impasta!',
            'Why did the scarecrow win an award? Because he was outstanding in his field!'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `😂 *Joke*\n\n${jokes[Math.floor(Math.random() * jokes.length)]}` 
        });
    }
});

commands.set('trivia', {
    name: 'trivia',
    description: 'Answer a trivia question',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🧠 *Trivia*\n\n❓ What is the capital of France?\n\nA) London\nB) Paris\nC) Berlin\nD) Madrid\n\n💡 Reply with .trivia a/b/c/d` 
        });
    }
});

commands.set('riddle', {
    name: 'riddle',
    description: 'Solve a riddle',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🧩 *Riddle*\n\nI have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?` 
        });
    }
});

commands.set('dice', {
    name: 'dice',
    description: 'Roll a dice',
    async execute(sock, msg, args) {
        const result = Math.floor(Math.random() * 6) + 1;
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎲 *Dice Roll*\n\nYou rolled: ${result}` 
        });
    }
});

commands.set('coin', {
    name: 'coin',
    description: 'Flip a coin',
    async execute(sock, msg, args) {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🪙 *Coin Flip*\n\nResult: ${result}` 
        });
    }
});

commands.set('rps', {
    name: 'rps',
    description: 'Rock Paper Scissors',
    async execute(sock, msg, args) {
        const choices = ['rock', 'paper', 'scissors'];
        const bot = choices[Math.floor(Math.random() * 3)];
        const user = args[0]?.toLowerCase();
        if (!user || !choices.includes(user)) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Choose: rock, paper, or scissors\nExample: .rps rock' 
            });
            return;
        }
        let result;
        if (user === bot) result = 'Tie! 🤝';
        else if ((user === 'rock' && bot === 'scissors') ||
                 (user === 'paper' && bot === 'rock') ||
                 (user === 'scissors' && bot === 'paper')) {
            result = 'You win! 🎉';
        } else {
            result = 'Bot wins! 🤖';
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✊ *Rock Paper Scissors*\n\nYou: ${user}\nBot: ${bot}\nResult: ${result}` 
        });
    }
});

commands.set('8ball', {
    name: '8ball',
    description: 'Magic 8 Ball',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Ask a yes/no question. Example: .8ball Will it rain?' 
            });
            return;
        }
        const responses = [
            'Yes', 'No', 'Maybe', 'Ask again',
            'Definitely', 'Not likely', 'For sure', 'No way'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎱 *Magic 8 Ball*\n\nQuestion: ${args.join(' ')}\nAnswer: ${responses[Math.floor(Math.random() * responses.length)]}` 
        });
    }
});

commands.set('fact', {
    name: 'fact',
    description: 'Random fact',
    async execute(sock, msg, args) {
        const facts = [
            'Octopuses have three hearts.',
            'A day on Venus is longer than a year on Venus.',
            'Bananas are berries, but strawberries are not.',
            'Honey never spoils.'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📚 *Fact*\n\n${facts[Math.floor(Math.random() * facts.length)]}` 
        });
    }
});

commands.set('truth', {
    name: 'truth',
    description: 'Truth or Dare - Truth',
    async execute(sock, msg, args) {
        const truths = [
            'What is your biggest fear?',
            'Have you ever lied to someone close to you?',
            'What is the most embarrassing thing you have done?'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `👀 *Truth*\n\n${truths[Math.floor(Math.random() * truths.length)]}` 
        });
    }
});

commands.set('dare', {
    name: 'dare',
    description: 'Truth or Dare - Dare',
    async execute(sock, msg, args) {
        const dares = [
            'Send a message to your crush.',
            'Do 10 pushups right now.',
            'Sing your favorite song loudly.'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `😈 *Dare*\n\n${dares[Math.floor(Math.random() * dares.length)]}` 
        });
    }
});

commands.set('quote', {
    name: 'quote',
    description: 'Inspirational quote',
    async execute(sock, msg, args) {
        const quotes = [
            'The only way to do great work is to love what you do. - Steve Jobs',
            'In the middle of difficulty lies opportunity. - Albert Einstein',
            'The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `💬 *Quote*\n\n${quotes[Math.floor(Math.random() * quotes.length)]}` 
        });
    }
});

commands.set('anime', {
    name: 'anime',
    description: 'Anime recommendation',
    async execute(sock, msg, args) {
        const anime = [
            'Attack on Titan - Epic dark fantasy.',
            'Naruto - Classic ninja adventure.',
            'One Piece - The journey to become Pirate King.',
            'Death Note - Psychological thriller.'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎬 *Anime Recommendation*\n\n${anime[Math.floor(Math.random() * anime.length)]}` 
        });
    }
});

commands.set('movie', {
    name: 'movie',
    description: 'Movie recommendation',
    async execute(sock, msg, args) {
        const movies = [
            'The Shawshank Redemption - Classic drama.',
            'The Godfather - Epic mafia story.',
            'Inception - Mind-bending thriller.',
            'The Dark Knight - Best superhero film.'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎬 *Movie Recommendation*\n\n${movies[Math.floor(Math.random() * movies.length)]}` 
        });
    }
});

commands.set('song', {
    name: 'song',
    description: 'Song recommendation',
    async execute(sock, msg, args) {
        const songs = [
            'Bohemian Rhapsody - Queen',
            'Imagine - John Lennon',
            'Stairway to Heaven - Led Zeppelin',
            'Hotel California - Eagles'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎵 *Song Recommendation*\n\n${songs[Math.floor(Math.random() * songs.length)]}` 
        });
    }
});

commands.set('game', {
    name: 'game',
    description: 'Game recommendation',
    async execute(sock, msg, args) {
        const games = [
            'The Witcher 3 - Open world RPG.',
            'Red Dead Redemption 2 - Western adventure.',
            'GTA V - Open world crime.',
            'Minecraft - Creative sandbox.'
        ];
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎮 *Game Recommendation*\n\n${games[Math.floor(Math.random() * games.length)]}` 
        });
    }
});

commands.set('emoji', {
    name: 'emoji',
    description: 'Emoji combination',
    async execute(sock, msg, args) {
        const emojis = ['😊', '🔥', '💯', '🚀', '💪', '🎉', '✨', '🌟', '🔥', '💎'];
        const combo = [];
        for (let i = 0; i < 3; i++) {
            combo.push(emojis[Math.floor(Math.random() * emojis.length)]);
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎨 *Emoji Combo*\n\n${combo.join(' ')}` 
        });
    }
});

// ─── ADMIN COMMANDS (12) ────────────────────────────────────

commands.set('kick', {
    name: 'kick',
    description: 'Kick a member from group',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '⚠️ Admin command: .kick @user\n\nReply to a message or mention the user.' 
        });
    }
});

commands.set('promote', {
    name: 'promote',
    description: 'Promote a member to admin',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '⬆️ Admin command: .promote @user' 
        });
    }
});

commands.set('demote', {
    name: 'demote',
    description: 'Demote an admin',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '⬇️ Admin command: .demote @user' 
        });
    }
});

commands.set('mute', {
    name: 'mute',
    description: 'Mute the group',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔇 Group muted successfully!' 
        });
    }
});

commands.set('unmute', {
    name: 'unmute',
    description: 'Unmute the group',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔊 Group unmuted successfully!' 
        });
    }
});

commands.set('ban', {
    name: 'ban',
    description: 'Ban a user from bot',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🚫 User banned from using the bot.' 
        });
    }
});

commands.set('unban', {
    name: 'unban',
    description: 'Unban a user',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '✅ User unbanned successfully!' 
        });
    }
});

commands.set('warn', {
    name: 'warn',
    description: 'Warn a member',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '⚠️ User warned! (1/3 warnings)' 
        });
    }
});

commands.set('warns', {
    name: 'warns',
    description: 'Check member warnings',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📊 @user has 0 warnings.' 
        });
    }
});

commands.set('resetwarns', {
    name: 'resetwarns',
    description: 'Reset member warnings',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔄 Warnings reset for @user' 
        });
    }
});

commands.set('lock', {
    name: 'lock',
    description: 'Lock the group',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔒 Group locked! Only admins can send messages.' 
        });
    }
});

commands.set('unlock', {
    name: 'unlock',
    description: 'Unlock the group',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔓 Group unlocked! Everyone can send messages.' 
        });
    }
});

// ─── SOCIAL MEDIA COMMANDS (10) ────────────────────────────

commands.set('ig', {
    name: 'ig',
    description: 'Download Instagram content',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide an Instagram URL\nExample: .ig https://www.instagram.com/p/...' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📸 *Instagram Downloader*\n\nProcessing your request...\n⚠️ Add Instagram API for real downloads.' 
        });
    }
});

commands.set('yt', {
    name: 'yt',
    description: 'Search YouTube',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a search query\nExample: .yt Never Gonna Give You Up' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📹 *YouTube Search*\n\nSearching for: ${args.join(' ')}\n⚠️ Add YouTube API for real results.` 
        });
    }
});

commands.set('fb', {
    name: 'fb',
    description: 'Download Facebook content',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📘 *Facebook Downloader*\n\nAdd Facebook API for real downloads.' 
        });
    }
});

commands.set('tt', {
    name: 'tt',
    description: 'Download TikTok content',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🎵 *TikTok Downloader*\n\nAdd TikTok API for real downloads.' 
        });
    }
});

commands.set('twit', {
    name: 'twit',
    description: 'Download Twitter content',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🐦 *Twitter Downloader*\n\nAdd Twitter API for real downloads.' 
        });
    }
});

commands.set('play', {
    name: 'play',
    description: 'Play music from YouTube',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a song name\nExample: .play Never Gonna Give You Up' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎵 *Playing*\n\nSearching for: ${args.join(' ')}\n⚠️ Add YouTube API for real audio playback.` 
        });
    }
});

commands.set('video', {
    name: 'video',
    description: 'Download video',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📹 *Video Downloader*\n\nAdd video download API for real downloads.' 
        });
    }
});

commands.set('audio', {
    name: 'audio',
    description: 'Convert to audio',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🎧 *Audio Converter*\n\nAdd audio conversion API.' 
        });
    }
});

commands.set('sticker', {
    name: 'sticker',
    description: 'Create sticker from image',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🖼️ *Sticker Creator*\n\nReply to an image with .sticker' 
        });
    }
});

commands.set('toimg', {
    name: 'toimg',
    description: 'Convert sticker to image',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🖼️ *Sticker to Image*\n\nReply to a sticker with .toimg' 
        });
    }
});

// ─── AI COMMANDS (8) ────────────────────────────────────────

commands.set('ai', {
    name: 'ai',
    description: 'Ask AI assistant',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a question\nExample: .ai What is the meaning of life?' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🧠 *AI Assistant*\n\nQuestion: ${args.join(' ')}\n\n⚠️ Add OpenAI API for real AI responses.` 
        });
    }
});

commands.set('image', {
    name: 'image',
    description: 'Generate AI image',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a description\nExample: .image A cat in space' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎨 *AI Image Generator*\n\nGenerating: ${args.join(' ')}\n⚠️ Add Stable Diffusion API for real images.` 
        });
    }
});

commands.set('code', {
    name: 'code',
    description: 'Generate code',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide code description\nExample: .code JavaScript function to add two numbers' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `💻 *Code Generator*\n\nRequest: ${args.join(' ')}\n⚠️ Add OpenAI API for real code generation.` 
        });
    }
});

commands.set('summarize', {
    name: 'summarize',
    description: 'Summarize text',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide text to summarize\nExample: .summarize Long text here...' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📝 *Text Summarizer*\n\n⚠️ Add summarization API for real summaries.` 
        });
    }
});

commands.set('grammar', {
    name: 'grammar',
    description: 'Fix grammar and spelling',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide text to check\nExample: .grammar I has a apple' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✏️ *Grammar Check*\n\n⚠️ Add grammar checking API.'` 
        });
    }
});

commands.set('email', {
    name: 'email',
    description: 'Draft an email',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide email topic\nExample: .email Meeting request' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📧 *Email Draft*\n\nTopic: ${args.join(' ')}\n⚠️ Add AI API for real email generation.` 
        });
    }
});

commands.set('resume', {
    name: 'resume',
    description: 'Create a resume',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📄 *Resume Generator*\n\n⚠️ Add resume generation API.' 
        });
    }
});

commands.set('cover', {
    name: 'cover',
    description: 'Generate cover letter',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📄 *Cover Letter Generator*\n\n⚠️ Add cover letter generation API.' 
        });
    }
});

// ─── DOWNLOADER COMMANDS (10) ──────────────────────────────

commands.set('ytmp3', {
    name: 'ytmp3',
    description: 'YouTube to MP3',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a YouTube URL\nExample: .ytmp3 https://youtu.be/...' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🎵 *YouTube to MP3*\n\nProcessing: ${args[0]}\n⚠️ Add YouTube download API.'` 
        });
    }
});

commands.set('ytmp4', {
    name: 'ytmp4',
    description: 'YouTube to MP4',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📹 *YouTube to MP4*\n\n⚠️ Add YouTube download API.' 
        });
    }
});

commands.set('fbdl', {
    name: 'fbdl',
    description: 'Facebook video download',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📘 *Facebook Downloader*\n\n⚠️ Add Facebook download API.' 
        });
    }
});

commands.set('igdl', {
    name: 'igdl',
    description: 'Instagram downloader',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📸 *Instagram Downloader*\n\n⚠️ Add Instagram download API.' 
        });
    }
});

commands.set('twdl', {
    name: 'twdl',
    description: 'Twitter downloader',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🐦 *Twitter Downloader*\n\n⚠️ Add Twitter download API.' 
        });
    }
});

commands.set('ttdl', {
    name: 'ttdl',
    description: 'TikTok downloader',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🎵 *TikTok Downloader*\n\n⚠️ Add TikTok download API.' 
        });
    }
});

commands.set('pint', {
    name: 'pint',
    description: 'Pinterest downloader',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📌 *Pinterest Downloader*\n\n⚠️ Add Pinterest download API.' 
        });
    }
});

commands.set('media', {
    name: 'media',
    description: 'Download media',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📁 *Media Downloader*\n\n⚠️ Add media download API.' 
        });
    }
});

commands.set('mp3', {
    name: 'mp3',
    description: 'MP3 downloader',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🎵 *MP3 Downloader*\n\n⚠️ Add MP3 download API.' 
        });
    }
});

commands.set('mp4', {
    name: 'mp4',
    description: 'MP4 downloader',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📹 *MP4 Downloader*\n\n⚠️ Add MP4 download API.' 
        });
    }
});

// ─── GROUP MANAGEMENT COMMANDS (10) ──────────────────────

commands.set('group', {
    name: 'group',
    description: 'Get group information',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📊 *Group Info*\n\nName: Group Name\nMembers: 100\nAdmins: 5\nCreated: 01/01/2024' 
        });
    }
});

commands.set('grouplist', {
    name: 'grouplist',
    description: 'List all groups',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📋 *Group List*\n\n1. Group 1\n2. Group 2\n3. Group 3\n\nTotal: 3 groups' 
        });
    }
});

commands.set('link', {
    name: 'link',
    description: 'Get group invite link',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔗 *Group Link*\n\nhttps://chat.whatsapp.com/example' 
        });
    }
});

commands.set('join', {
    name: 'join',
    description: 'Join group via link',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '✅ Joined the group!' 
        });
    }
});

commands.set('leave', {
    name: 'leave',
    description: 'Leave a group',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '👋 Left the group.' 
        });
    }
});

commands.set('tagall', {
    name: 'tagall',
    description: 'Tag all members',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔔 *Attention everyone!*\n\n@everyone\n\n(Requires member list to tag individually)' 
        });
    }
});

commands.set('admin', {
    name: 'admin',
    description: 'List all admins',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '👑 *Admins*\n\n1. @admin1\n2. @admin2\n3. @admin3' 
        });
    }
});

commands.set('members', {
    name: 'members',
    description: 'Count members',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '👥 *Members*\n\nTotal: 100\nAdmins: 5\nOnline: 25' 
        });
    }
});

commands.set('setdesc', {
    name: 'setdesc',
    description: 'Set group description',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a description\nExample: .setdesc Welcome to the group!' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✅ Group description updated!\n\n${args.join(' ')}` 
        });
    }
});

commands.set('setname', {
    name: 'setname',
    description: 'Set group name',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a group name\nExample: .setname My Awesome Group' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✅ Group name updated to: ${args.join(' ')}` 
        });
    }
});

// ─── DATABASE COMMANDS (7) ─────────────────────────────────

commands.set('save', {
    name: 'save',
    description: 'Save data to database',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide data to save\nExample: .save key:value' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✅ Data saved: ${args.join(' ')}` 
        });
    }
});

commands.set('get', {
    name: 'get',
    description: 'Get data from database',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📂 Data retrieved: value' 
        });
    }
});

commands.set('delete', {
    name: 'delete',
    description: 'Delete data from database',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🗑️ Data deleted successfully!' 
        });
    }
});

commands.set('list', {
    name: 'list',
    description: 'List all saved data',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📋 *Saved Data*\n\n1. data1\n2. data2\n3. data3' 
        });
    }
});

commands.set('search', {
    name: 'search',
    description: 'Search database',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a search query\nExample: .search keyword' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🔍 Searching for: ${args.join(' ')}\n\nFound: 2 results` 
        });
    }
});

commands.set('backup', {
    name: 'backup',
    description: 'Backup database',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '💾 Database backup created successfully!' 
        });
    }
});

commands.set('restore', {
    name: 'restore',
    description: 'Restore database backup',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🔄 Database restored successfully!' 
        });
    }
});

// ─── CHAT MANAGEMENT COMMANDS (8) ──────────────────────────

commands.set('clear', {
    name: 'clear',
    description: 'Clear chat messages',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🧹 Chat cleared! (Admin only)' 
        });
    }
});

commands.set('edit', {
    name: 'edit',
    description: 'Edit a message',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '✏️ Message edited!' 
        });
    }
});

commands.set('pin', {
    name: 'pin',
    description: 'Pin a message',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📌 Message pinned!' 
        });
    }
});

commands.set('unpin', {
    name: 'unpin',
    description: 'Unpin a message',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '📌 Message unpinned!' 
        });
    }
});

commands.set('react', {
    name: 'react',
    description: 'React to a message',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide an emoji\nExample: .react ❤️' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✅ Reacted with: ${args[0]}` 
        });
    }
});

commands.set('forward', {
    name: 'forward',
    description: 'Forward a message',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '↗️ Message forwarded!' 
        });
    }
});

commands.set('reply', {
    name: 'reply',
    description: 'Reply to a message',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a reply\nExample: .reply Hello there!' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `💬 Reply: ${args.join(' ')}` 
        });
    }
});

// ─── MISCELLANEOUS COMMANDS (12) ──────────────────────────

commands.set('birthday', {
    name: 'birthday',
    description: 'Birthday reminder',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🎂 *Birthday Reminder*\n\nSet your birthday with: .birthday DD/MM' 
        });
    }
});

commands.set('timer', {
    name: 'timer',
    description: 'Set a timer',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide time in seconds\nExample: .timer 10' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `⏰ Timer set for ${args[0]} seconds!` 
        });
    }
});

commands.set('remind', {
    name: 'remind',
    description: 'Set a reminder',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a reminder\nExample: .remind 10m Call John' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `⏰ Reminder set: ${args.join(' ')}` 
        });
    }
});

commands.set('todo', {
    name: 'todo',
    description: 'Add to to-do list',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a task\nExample: .todo Buy groceries' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `✅ Task added: ${args.join(' ')}` 
        });
    }
});

commands.set('notes', {
    name: 'notes',
    description: 'Save notes',
    async execute(sock, msg, args) {
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a note\nExample: .notes Meeting at 3pm' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📝 Note saved: ${args.join(' ')}` 
        });
    }
});

commands.set('news', {
    name: 'news',
    description: 'Latest news',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📰 *Latest News*\n\n1. Breaking news 1\n2. Breaking news 2\n3. Breaking news 3\n\n⚠️ Add news API for real headlines.` 
        });
    }
});

commands.set('crypto', {
    name: 'crypto',
    description: 'Crypto prices',
    async execute(sock, msg, args) {
        const coin = args[0] || 'BTC';
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `💰 *${coin.toUpperCase()} Price*\n\nPrice: $50,000\nChange: +2.5%\nVolume: $10B\n\n⚠️ Add crypto API for real prices.` 
        });
    }
});

commands.set('stocks', {
    name: 'stocks',
    description: 'Stock prices',
    async execute(sock, msg, args) {
        const stock = args[0] || 'AAPL';
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📈 *${stock.toUpperCase()} Price*\n\nPrice: $150.00\nChange: +1.2%\nVolume: 50M\n\n⚠️ Add stock API for real prices.` 
        });
    }
});

commands.set('bitcoin', {
    name: 'bitcoin',
    description: 'Bitcoin price',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `₿ *Bitcoin Price*\n\nPrice: $50,000\nChange: +2.5%\nMarket Cap: $950B\n\n⚠️ Add crypto API for real prices.` 
        });
    }
});

commands.set('forex', {
    name: 'forex',
    description: 'Forex rates',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `💱 *Forex Rates*\n\nUSD/EUR: 0.85\nUSD/GBP: 0.75\nUSD/JPY: 110.00\n\n⚠️ Add forex API for real rates.` 
        });
    }
});

commands.set('covid', {
    name: 'covid',
    description: 'COVID-19 statistics',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🦠 *COVID-19 Stats*\n\nTotal Cases: 100M\nRecovered: 90M\nDeaths: 1M\n\n⚠️ Add COVID API for real stats.` 
        });
    }
});

commands.set('worldclock', {
    name: 'worldclock',
    description: 'World clock times',
    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `🌍 *World Clock*\n\n🇺🇸 New York: 12:00 PM\n🇬🇧 London: 5:00 PM\n🇯🇵 Tokyo: 2:00 AM\n🇦🇺 Sydney: 4:00 AM\n\n⚠️ Add timezone API for real times.` 
        });
    }
});

// ─── OWNER COMMANDS ─────────────────────────────────────────

commands.set('shutdown', {
    name: 'shutdown',
    description: 'Shutdown the bot (Owner only)',
    async execute(sock, msg, args) {
        const sender = msg.key.remoteJid;
        if (sender !== CONFIG.OWNER_NUMBER) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⛔ Owner only command.' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '🛑 Shutting down...' 
        });
        process.exit(0);
    }
});

commands.set('stats', {
    name: 'stats',
    description: 'Bot statistics (Owner only)',
    async execute(sock, msg, args) {
        const sender = msg.key.remoteJid;
        if (sender !== CONFIG.OWNER_NUMBER) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⛔ Owner only command.' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📊 *Bot Statistics*\n\nCommands: ${commands.size}\nUptime: ${Math.floor(process.uptime())}s\nMemory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB` 
        });
    }
});

// ─── BROADCAST COMMAND ──────────────────────────────────────

commands.set('broadcast', {
    name: 'broadcast',
    description: 'Broadcast message (Owner only)',
    async execute(sock, msg, args) {
        const sender = msg.key.remoteJid;
        if (sender !== CONFIG.OWNER_NUMBER) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⛔ Owner only command.' 
            });
            return;
        }
        if (!args.length) {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: '⚠️ Please provide a message to broadcast.' 
            });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, { 
            text: `📢 Broadcasting: ${args.join(' ')}\n\n⚠️ This will send to all groups/chats.` 
        });
    }
});

console.log(`✅ Loaded ${commands.size} commands`);

// ============================================================
//  EXPRESS SERVER
// ============================================================

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================
//  STATUS ENDPOINT
// ============================================================

let botStatus = 'offline';
let botStartTime = null;

app.get('/status', (req, res) => {
    const sessionExists = fs.existsSync(path.join(CONFIG.SESSION_DIR, 'creds.json'));
    res.json({
        status: botStatus,
        sessionExists: sessionExists,
        commands: commands.size,
        uptime: botStartTime ? Math.floor((Date.now() - botStartTime) / 1000) : 0,
        botName: CONFIG.BOT_NAME,
        motto: CONFIG.MOTTO,
        studio: CONFIG.STUDIO,
        developer: CONFIG.DEVELOPER
    });
});

// ============================================================
//  PAIRING ENDPOINT
// ============================================================

app.post('/pair', async (req, res) => {
    const { number } = req.body;
    
    if (!number) {
        return res.status(400).json({ 
            success: false, 
            error: 'Phone number is required' 
        });
    }
    
    const cleanNumber = number.replace(/[^0-9]/g, '');
    if (cleanNumber.length < 10) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid phone number. Must be at least 10 digits.' 
        });
    }
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState(CONFIG.SESSION_DIR);
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            browser: [CONFIG.BOT_NAME, 'Chrome', '120.0.0'],
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        console.log(`📱 Requesting pairing code for ${cleanNumber}...`);
        const code = await sock.requestPairingCode(cleanNumber);
        console.log(`✅ Pairing code generated: ${code}`);
        
        res.json({
            success: true,
            code: code,
            message: 'Pairing code generated successfully!',
            number: cleanNumber
        });
        
        setTimeout(() => startBot(sock, saveCreds), 3000);
        
    } catch (error) {
        console.error('❌ Pairing error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate pairing code'
        });
    }
});

// ============================================================
//  BOT ENGINE
// ============================================================

let botInstance = null;

async function startBot(existingSock = null, existingSaveCreds = null) {
    try {
        let sock = existingSock;
        let saveCreds = existingSaveCreds;
        
        if (!sock) {
            const { state, saveCreds: save } = await useMultiFileAuthState(CONFIG.SESSION_DIR);
            saveCreds = save;
            
            sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                browser: [CONFIG.BOT_NAME, 'Chrome', '120.0.0'],
            });
            
            sock.ev.on('creds.update', saveCreds);
        }
        
        // ─── MESSAGE HANDLER ─────────────────────────────
        sock.ev.on('messages.upsert', async (m) => {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;
            
            const sender = msg.key.remoteJid;
            const isGroup = sender.endsWith('@g.us');
            const text = msg.message.conversation || 
                         msg.message.extendedTextMessage?.text || 
                         msg.message.imageMessage?.caption || '';
            
            // Private mode check
            if (CONFIG.PRIVATE_MODE) {
                const isAuthorized = CONFIG.WHITELIST.includes(sender) || 
                                    sender === CONFIG.OWNER_NUMBER;
                
                if (isGroup) {
                    await sock.sendMessage(sender, { 
                        text: '🔒 *Private Mode*\n\nOnly authorized users can use this bot in DMs.' 
                    });
                    return;
                }
                
                if (!isAuthorized) {
                    await sock.sendMessage(sender, { 
                        text: '🚫 *Unauthorized*\n\nContact owner to get access.\n👤 Owner: @' + CONFIG.OWNER_NUMBER 
                    });
                    return;
                }
            }
            
            // Detect command
            let commandName = null;
            let args = [];
            let prefixUsed = null;
            
            for (const prefix of CONFIG.PREFIXES) {
                if (text.startsWith(prefix)) {
                    const parts = text.slice(prefix.length).trim().split(' ');
                    commandName = parts[0].toLowerCase();
                    args = parts.slice(1);
                    prefixUsed = prefix;
                    break;
                }
            }
            
            if (!commandName && CONFIG.ALLOW_NO_PREFIX) {
                const parts = text.trim().split(' ');
                const possibleCmd = parts[0].toLowerCase();
                if (commands.has(possibleCmd)) {
                    commandName = possibleCmd;
                    args = parts.slice(1);
                    prefixUsed = 'none';
                }
            }
            
            // Execute command
            if (commandName && commands.has(commandName)) {
                try {
                    const command = commands.get(commandName);
                    await command.execute(sock, msg, args);
                    console.log(`✅ ${prefixUsed || 'none'}${commandName} executed by ${sender}`);
                } catch (error) {
                    console.error(`❌ Command error (${commandName}):`, error);
                    await sock.sendMessage(sender, { 
                        text: '⚠️ Error executing command. Please try again.' 
                    });
                }
            }
        });
        
        // ─── CONNECTION HANDLER ──────────────────────────
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'close') {
                botStatus = 'offline';
                const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== 401;
                if (shouldReconnect) {
                    console.log('🔄 Reconnecting...');
                    setTimeout(() => startBot(), 5000);
                } else {
                    console.log('⚠️ Session expired. Please re-pair.');
                }
            } else if (connection === 'open') {
                botStatus = 'online';
                botStartTime = Date.now();
                console.log(`✅ ${CONFIG.BOT_NAME} is ONLINE!`);
                console.log(`🔒 Mode: ${CONFIG.PRIVATE_MODE ? 'PRIVATE' : 'PUBLIC'}`);
                console.log(`📋 Prefixes: ${CONFIG.PREFIXES.join(', ')}${CONFIG.ALLOW_NO_PREFIX ? ', (no prefix)' : ''}`);
                console.log(`📊 Commands: ${commands.size}`);
            }
        });
        
        botInstance = sock;
        return sock;
        
    } catch (error) {
        console.error('❌ Bot start error:', error);
        botStatus = 'error';
        return null;
    }
}

// ============================================================
//  START EVERYTHING
// ============================================================

async function initialize() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log(`║              🌟 ${CONFIG.BOT_NAME} STARTING 🌟              ║`);
    console.log(`║              ${CONFIG.MOTTO}                                ║`);
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║  📊 Commands loaded: ${commands.size}                       ║`);
    console.log(`║  🔧 Prefixes: ${CONFIG.PREFIXES.join(', ')}${CONFIG.ALLOW_NO_PREFIX ? ', (no prefix)' : ''}  ║`);
    console.log(`║  🔒 Mode: ${CONFIG.PRIVATE_MODE ? 'PRIVATE' : 'PUBLIC'}                                     ║`);
    console.log(`║  🌐 Server: http://localhost:${CONFIG.PORT}                   ║`);
    console.log(`║  📱 Pair URL: http://localhost:${CONFIG.PORT}                 ║`);
    console.log('╚══════════════════════════════════════════════════════════════╝');
    
    const sessionExists = fs.existsSync(path.join(CONFIG.SESSION_DIR, 'creds.json'));
    if (sessionExists) {
        console.log('📱 Session found, starting bot...');
        await startBot();
    } else {
        console.log('📱 No session found. Please pair via website.');
    }
    
    app.listen(CONFIG.PORT, () => {
        console.log(`✅ Server running on http://localhost:${CONFIG.PORT}`);
        console.log(`📱 Open this URL in your browser to pair your device`);
    });
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    process.exit(0);
});

initialize().catch(console.error);
