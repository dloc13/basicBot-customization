 (function () {

    //Define our function responsible for extending the bot.
    function extend() {

        //If the bot hasn't been loaded properly, try again in 1 second(s).
        if (!window.bot) {
            return setTimeout(extend, 1 * 1000);
        }

        //Precaution to make sure it is assigned properly.
        var bot = window.bot;
        //Load custom settings set below
        bot.retrieveSettings();

        /*
         Extend the bot here, either by calling another function or here directly.
         Model code for a bot command:
         bot.commands.commandCommand = {
         command: 'cmd',
         rank: 'user/bouncer/mod/manager',
         type: 'startsWith/exact',
         functionality: function(chat, cmd){
         if(this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
         if( !bot.commands.executable(this.rank, chat) ) return void (0);
         else{
         //Commands functionality goes here.
         }
         }
         }
         */ 
		 
		bot.commands.newsCommand = {
            command: 'news',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'startsWith', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
						var msg = chat.message;
						var lastSpace = msg.lastIndexOf(' ');
						var parameter = msg.substring(lastSpace + 1);
						var selectedRSSFeed = -1;
						
						simpleAJAXLib = {
						
								init: function () {
									for (var i = 0; i < bot.settings.rssFeeds.length; i++) {
										//Match the parameter with the rssFeeds array. If non match, display the howto.
										if (parameter == bot.settings.rssFeeds[i][0]) {
											this.fetchJSON(bot.settings.rssFeeds[i][1]);
											selectedRSSFeed = i;
										} else if (selectedRSSFeed == -1 && bot.settings.rssFeeds.length - 1 == i) {
												var rssOptions = "/me Please use one of the following parameters (ie.'!news rock'): '" + bot.settings.rssFeeds[0][0] + "'";
												for (var i = 1; i < bot.settings.rssFeeds.length; i++) {
													rssOptions += ", '";
													rssOptions += bot.settings.rssFeeds[i][0];
													rssOptions += "'";
												}
												rssOptions += ".";
												
												API.sendChat(rssOptions);
										}
									}
								},
						 
								fetchJSON: function (url) {
									var root = 'https://query.yahooapis.com/v1/public/yql?q=';
									var yql = 'select * from xml where url="' + url + '"';
									var proxy_url = root + encodeURIComponent(yql) + '&format=json&diagnostics=false&callback=simpleAJAXLib.display';
									document.getElementsByTagName('body')[0].appendChild(this.jsTag(proxy_url));
								},
						 
								jsTag: function (url) {
									var script = document.createElement('script');
									script.setAttribute('type', 'text/javascript');
									script.setAttribute('src', url);
									return script;
								},
						 
								display: function (results) {
									if (selectedRSSFeed != -1) {
									
										//var rNumber = Math.floor(Math.random()*bot.settings.rssFeeds[selectedRSSFeed][2]);
										if (bot.settings.rssFeeds[selectedRSSFeed][3] != bot.settings.rssFeeds[selectedRSSFeed][2] - 1) {
											bot.settings.rssFeeds[selectedRSSFeed][3] += 1;
										} else {
											bot.settings.rssFeeds[selectedRSSFeed][3] = 0;
										}
										
										var long_url = results.query.results.rss.channel.item[bot.settings.rssFeeds[selectedRSSFeed][3]].link;
											
										if (bot.settings.rssFeeds[selectedRSSFeed][0] === "oneliners") {
											var oneliner = results.query.results.rss.channel.item[bot.settings.rssFeeds[selectedRSSFeed][3]].description;
											oneliner = oneliner.replace('<![CDATA[','').replace(']','').replace('<p>','').replace('</p>','');
											API.sendChat(
												oneliner
											);
										} else {
											API.sendChat(
											results.query.results.rss.channel.item[bot.settings.rssFeeds[selectedRSSFeed][3]].title 
											+ " (" 
											+ long_url
											+ ")");
										}
									}
								}
						}
						simpleAJAXLib.init();
                }
            }
        }; 
		 
		bot.commands.rulereminderCommand = {
            command: 'rulereminder',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'manager', //Minimum user permission to use the command
            type: 'startsWith', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
					var msg = chat.message;
					bot.settings.ruletime = msg.substring(cmd.length + 1);
						if (cmd.length !== chat.message.length) {
							if (!isNaN(parseInt(bot.settings.ruletime,10))) {
								clearInterval(bot.settings.ruletimer);
								bot.settings.ruletimer = setInterval(function() {API.sendChat("Please take a minute to read our room rules! http://goo.gl/wQxAOW")},1000*60*parseInt(bot.settings.ruletime,10));
								API.sendChat("/me enabled the reminder for every " + parseInt(bot.settings.ruletime,10) + " minutes");
							}
						} else {
							clearInterval(bot.settings.ruletimer);
							API.sendChat("/me disabled the reminder");
						}
                }
            }
        };
                
        bot.commands.eightBallCommand = {
            command: '8ball',  //The command to be called. With the standard command literal this would be: !8ball
            rank: 'user', //Minimum user permission to use the command
            type: 'startsWith',
            functionality: function (chat, cmd) {
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    var messages = new Array();
                    messages[0] = "No.";
                    messages[1] = "Not today.";
                    messages[2] = "It is decidedly so.";
                    messages[3] = "Without a doubt.";
                    messages[4] = "Yes definitely.";
                    messages[5] = "You may rely on it.";
                    messages[6] = "As I see it yes.";
                    messages[7] = "Most likely.";
                    messages[8] = "Outlook good.";
                    messages[10] = "Signs point to yes.";
                    messages[11] = "Reply hazy try again.";
                    messages[12] = "Ask again later.";
                    messages[13] = "Better not tell you now.";
                    messages[14] = "Cannot predict now.";
                    messages[15] = "Concentrate and ask again.";
                    messages[16] = "Don't count on it.";
                    messages[17] = "My reply is no.";
                    messages[18] = "My sources say no.";
                    messages[19] = "Outlook not so good.";
                    messages[20] = "Very doubtful.";
                    
                    var randomnumber = Math.floor(Math.random() * 21);
                    API.sendChat(messages[randomnumber]);
                }
            }
        };
        bot.commands.baconCommand = {
            command: 'bacon',  //The command to be called. With the standard command literal this would be: !bacon
            rank: 'user', //Minimum user permission to use the command
            type: 'exact', //Specify if it can accept variables or not (if so, these have to be handled yourself through the chat.message
            functionality: function (chat, cmd) {
                if (this.type === 'exact' && chat.message.length !== cmd.length) return void (0);
                if (!bot.commands.executable(this.rank, chat)) return void (0);
                else {
                    API.sendChat("/me Bacon!!!");
                }
            }
        };
		
        //Load the chat package again to account for any changes
        bot.loadChat();

    }

    //Change the bots default settings and make sure they are loaded on launch

    localStorage.setItem("basicBotsettings", JSON.stringify({
        botName: "basicBot",
        language: "english",
        chatLink: "https://rawgit.com/dloc13/basicBot/master/lang/en.json",
		quizmaxpoints: 100,
		quizstate: false,
		ruletimer: 1,
		ruletime: 30,
		rssFeeds: [
			["baseball","http://sports.espn.go.com/espn/rss/mlb/news",16,0],
			["progrock","http://progressiverockcentral.com/feed/",10,0],
			["rock","http://www.rollingstone.com/music.rss",25,0],
			["metal","http://www.metalstorm.net/rss/news.xml",15,0],
			["jokes","http://www.jokesareawesome.com/rss/latest/25/",25,0],
			["oneliners","http://www.jokespalace.com/category/one-liners/feed/",10,0],
			["chicagobears","http://feeds.feedburner.com/chicagobears/news?format=xml",15,0],
			["football","http://www.nfl.com/rss/rsslanding?searchString=home",8,0]
		],
        maximumAfk: 120,
        afkRemoval: true,
        maximumDc: 60,
        bouncerPlus: true,
        lockdownEnabled: false,
        lockGuard: false,
        maximumLocktime: 10,
        cycleGuard: true,
        maximumCycletime: 10,
        timeGuard: true,
        maximumSongLength: 20,
        autodisable: true,
        commandCooldown: 30,
        usercommandsEnabled: true,
        lockskipPosition: 3,
        lockskipReasons: [
            ["theme", "This song does not fit the room theme. "],
            ["op", "This song is on the OP list. "],
            ["history", "This song is in the history. "],
            ["mix", "You played a mix, which is against the rules. "],
            ["sound", "The song you played had bad sound quality or no sound. "],
            ["nsfw", "The song you contained was NSFW (image or sound). "],
            ["unavailable", "The song you played was not available for some users. "]
        ],
        afkpositionCheck: 15,
        afkRankCheck: "ambassador",
        motdEnabled: false,
        motdInterval: 5,
        motd: "I'm a rock star among geeks, wonks, and nerds.",
        filterChat: true,
        etaRestriction: false,
        welcome: true,
        opLink: null,
        rulesLink: null,
        themeLink: null,
		cleanupChat: false,
        fbLink: "https://www.facebook.com/groups/995813493781055/",
        youtubeLink: null,
        website: null,
        intervalMessages: [],
        messageInterval: 5,
        songstats: false,
        commandLiteral: "!",
        blacklists: {
            NSFW: "https://rawgit.com/dloc13/basicBot-customization/master/blacklists/ExampleNSFWlist.json",
            OP: "https://rawgit.com/dloc13/basicBot-customization/master/blacklists/ExampleOPlist.json"
        }
    }));
	
    //Start the bot and extend it when it has loaded.
    $.getScript('https://rawgit.com/dloc13/basicBot/master/basicBot.js', extend);

}).call(this);
