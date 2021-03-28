const url = require('url');
const path = require('path');
const fs = require('fs');
const env = require('dotenv').config().parsed;

const Discord = require('discord.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const https = require('https');
const { fetchJson } = require('fetch-json');
const marked = require('marked');

const passport = require('passport');
const session = require('express-session');
const Strategy = require('passport-discord').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;

const Topgg = require("@top-gg/sdk");

const i18n = require('i18n');
const moment = require('moment');
const { Server } = require('http');
const { count } = require('console');
require('moment-duration-format');
let crew = [];

module.exports = (client) => {
    const port = env.PORT || 80

    const dataDir = path.resolve(`${process.cwd()}${path.sep}website`);
    const pagesDir = path.resolve(`${dataDir}${path.sep}pages`);

	//app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.set('trust proxy', 5);
	app.use(morgan('tiny'));
	app.use('/assets', express.static(path.resolve(`${dataDir}${path.sep}assets`), { maxAge: '3s' }));
	

    passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});

    passport.use(new Strategy({
		clientID: client.appInfo.id,
		clientSecret: client.config.oauth,
		callbackURL: client.config.callbackURL,
		scope: ['identify', 'email', 'guilds', 'guilds.join']
	},
	(accessToken, refreshToken, profile, done) => {
		process.nextTick(() => done(null, profile));
    }));
    
    app.use(session({
		secret: 'v0Gh8g8CFgXuJ9DnRQvz2342425A',
		resave: false,
		saveUninitialized: false,
	}));

    app.use(passport.initialize());
    app.use(passport.session());
    
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    
    function checkAuth(req, res, next) {
        if(req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect('/login');
    }

    function cAuth(req, res) {
        if(req.isAuthenticated()) return;
        req.session.backURL = req.url;
        res.redirect('/login');
    }

    function checkAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.id === client.config.ownerID) return next();
        req.session.backURL = req.originalURL;
		res.redirect('/');
    }

	function getCrew() {
		client.config.crew.map(crewID => {
			client.users.fetch(crewID).then(u => {
				crew.push(u);
			});
		});
	};

	getCrew();



	//////////////////////////////
	///	        Routes         ///
	//////////////////////////////

    app.get('/', (req, res) => {
		
		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		res.render(path.resolve(`${pagesDir}${path.sep}home.ejs`), {
				client: client,
				auth: req.isAuthenticated() ? true : false,
				user: req.isAuthenticated() ? req.user : null,
				moment: moment,
				uptime: moment.duration(client.uptime).format(' D [dias], H [h], m [m], s [s]'),
				i18n: i18n,
				crew: crew,
				lang: req.query.lang,
				page: 'home'
		});
    });

	app.get('/commands', (req, res) => {
		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

        res.render(path.resolve(`${pagesDir}${path.sep}commands.ejs`), {
            client: client,
            auth: req.isAuthenticated() ? true : false,
			user: req.isAuthenticated() ? req.user : null,
			i18n: i18n,
			lang: req.query.lang,
			page: 'commands'
        });
	});
	
	app.get('/profile', checkAuth, (req, res) => {

		client.usersdata.ensure(req.user.id, client.config.default.user_settings);

		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		res.render(path.resolve(`${pagesDir}${path.sep}profile.ejs`), {
			client: client,
			user: req.user,
			auth: true,
			i18n: i18n,
			lang: req.query.lang,
			page: 'profile',
			moment: moment,
		});
	});

	app.get('/faq', async (req, res) => {
		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		res.render(path.resolve(`${pagesDir}${path.sep}faq.ejs`), {
				client: client,
				auth: req.isAuthenticated() ? true : false,
				user: req.user,
				i18n: i18n,
				lang: req.query.lang,
				page: 'faq'
		});
	});

	app.get('/gift/:giftID', checkAuth, async(req, res) => {
		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		if(!req.user.id) return res.redirect('/profile');
		let giftID = req.params.giftID;

		if(client.presentes.get(giftID)) {
			res.render(path.resolve(`${pagesDir}${path.sep}redeem.ejs`), {
				client: client,
				auth: req.isAuthenticated() ? true : false,
				user: req.user,
				i18n: i18n,
				lang: req.query.lang,
				gift: client.presentes.get(giftID),
				page: 'redeem'
			});
		} else {
			res.redirect('/profile#logs');
		}

	});

	app.get('/gift/:giftID/redeem', checkAuth, async (req, res) => {

		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		if(!req.user.id) return res.redirect('/profile');
		let giftID = req.params.giftID;

		if(client.presentes.get(giftID)) {
			let gift = client.presentes.get(giftID);

			if(!gift.redeemedAt) {
				
				await redeem(gift.guildID, req.user.id, giftID);

				async function redeem(guildID, toID, giftID) {
					if(!client.presentes.get(giftID)) return;
					if(!guildID) return;
					if(!giftID) return;
			
					if(client.guilds.cache.get(guildID)) {
						if(client.presentes.get(giftID)) {
							var presente = client.presentes.get(giftID);
							if(toID !== null) {
								if(presente.toID.length === 18 && presente.toID === toID || toID === presente.fromID) {
									if(!presente.redeemedAt) {
											client.economy.addMoney(guildID, toID, presente.value);
											client.presentes.set(giftID, Date.now(), "redeemedAt");
											client.log(`GIFT`, `[${giftID}] ${client.users.cache.get(toID).tag} [${toID}] resgatou um presente de ${presente.fromID}`);
			
											client.usersdata.push(presente.fromID, {
												type: 'GIFT_REDEEMED',
												data: {
													redeemedBy: toID,
													fromID: presente.fromID,
													toID: toID,
													redeemedAt: Date.now(),
													giftID: giftID,
													value: presente.value,
													time: Date.now()
												}
											}, "profile.logs");
									
											client.usersdata.push(toID, {
												type: 'GIFT_REDEEMED_YOU',
												data: {
													redeemedBy: toID,
													fromID: presente.fromID,
													toID: toID,
													redeemedAt: Date.now(),
													giftID: giftID,
													value: presente.value,
													time: Date.now()
												}
											}, "profile.logs");
			
									return true;
									}
								}
							}
						}
					}
				}

				res.redirect('/profile')

			} else {
				res.redirect('/profile');
			}

		} else {
			res.redirect('/profile');
		}
	})

	app.get('/dashboard', checkAuth, (req, res) => {
		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		const { Permissions } = require('discord.js');
		const permissions = (perm) => {
			return new Permissions(perm);
		}

		res.render(path.resolve(`${pagesDir}${path.sep}dashboard.ejs`), {
			client: client,
			user: req.user,
			auth: true,
			permissions: permissions,
			i18n: i18n,
			lang: req.query.lang,
			page: 'dashboard'
		});
	});

	app.get('/g/:guildID', (req, res) => {
		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		const fetch = require('node-fetch');

		let guildID = req.params.guildID;
		if(guildID) {
			client.stats.inc(guildID, 'page_visits');

			let guild = client.guilds.cache.get(guildID);
			if(guild) {
				let data = client.settings.get(guild.id);
				if(data.profile.show === true) {
					res.render(path.resolve(`${pagesDir}${path.sep}guild.ejs`), {
						client: client,
						auth: req.isAuthenticated() ? true : false,
						user: req.isAuthenticated() ? req.user : null,
						guild: guild,
						profile: data.profile,
						moment: moment,
						i18n: i18n,
						lang: req.query.lang,
						page: 'guild',
					});
				} else {
					res.redirect('/guilds');
				}
			} else {
				res.redirect('/guilds');	
			}
		} else {
			res.redirect('/guilds');
		}
	});

	app.get('/g/:guildID/join', (req, res) => {

		if(client.guilds.cache.get(req.params.guildID)) {
	
			let guild = client.guilds.cache.get(req.params.guildID)

			let original_invite;
			let invite = client.settings.get(guild.id).profile.invite;
			let custom_invite = client.settings.get(guild.id).profile.custom_invite;

			try {
				if(custom_invite && custom_invite.includes("https://noid.one/") && client.settings.get(guild.id).profile.isVerified) {
					original_invite = custom_invite;
				} else if(invite) {
					fetch(`https://discordapp.com/api/invite/${invite.replace("https://discord.gg/", "").replace("http://discord.gg/", "")}`)
					.then((res) => res.json())
					.then((json) => {
					if (json.message === 'Unknown Invite') {
						guild.channels.cache.first().createInvite({temporary: false, maxAge: 0, reason: `Joined member from noid.one/g/${guild.id}`}).then(invite => {
							original_invite = invite;
						});
					} else {
						original_invite = invite;
					};
					});
				} else {
					try {
						guild.channels.cache.first().createInvite({temporary: false, maxAge: 0, reason: `Joined member from noid.one/g/${guild.id}`}).then(invite => {
							original_invite = invite;
						});
					} catch(err) {
						console.log('Error at generating an invite!')
					}                         
				}
			} catch(err) {
				original_invite = false;
			}

			client.stats.inc(guild.id, 'bot_website_refers');

			res.redirect(original_invite);
		} else {
			res.redirect('/')
		}
	});

	app.get('/store/:guildID', (req, res) => {
		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		let guildID = req.params.guildID;
		if(guildID) {
			client.stats.inc(guildID, 'store_visits');

			let guild = client.guilds.cache.get(guildID);
			if(guild) {
				let data = client.settings.get(guild.id);
				if(data.profile.show === true) {
					res.render(path.resolve(`${pagesDir}${path.sep}guildstore.ejs`), {
						client: client,
						auth: req.isAuthenticated() ? true : false,
						user: req.isAuthenticated() ? req.user : null,
						guild: guild,
						data: data,
						moment: moment,
						i18n: i18n,
						lang: req.query.lang,
						page: 'guildstore',
					});
				} else {
					res.redirect('/guilds');
				}
			} else {
				res.redirect('/guilds');	
			}
		} else {
			res.redirect('/guilds');
		}
	});

	app.get('/g/:guildID/vote', checkAuth, (req, res) => {
		if(client.guilds.cache.get(req.params.guildID)) {
			client.votes.vote(req.params.guildID, req.user.id);
			return res.redirect(`/g/${req.params.guildID}`);
		} else {
			res.redirect(`/g/${req.params.guildID}`);
		}
	});

	app.get('/config/:objectID', checkAuth, (req, res) => {
		// /config/objectID?type=guild || user
		if(req.query.lang === 'pt_br' || req.query.lang === 'en' || req.query.lang === 'es') {
			i18n.setLocale(req.query.lang)
		} else {
			i18n.setLocale('pt_br')
		}

		const { Permissions } = require('discord.js');
		const permissions = (perm) => {
			return new Permissions(perm);
		}

		let isObjectGuild = req.query.type === 'guild';
		let isObjectUser = req.query.type === 'user';

		let object = req.params.objectID;
		let ctn;
		let finalObject;

		if(isObjectGuild) {
			if(client.guilds.cache.get(object)) {
				let g;
				let guildsArray = req.user.guilds;
				let guild;

				for (g of guildsArray) {
					if(g.id === object) {
						guild = g;
					}
				}

				if(req.user.id === client.config.ownerID ||permissions(guild.permissions).has('MANAGE_GUILD')) {
					ctn = true;
					finalObject = client.guilds.cache.get(object);
					finalObjectType = 'guild';
				} else {
					res.redirect('/');
				}
			} else {
				res.redirect('/');
			}
		} else if(isObjectUser) {
			if(client.users.cache.get(object)) {
				if(object === req.user.id) {
					client.usersdata.ensure(req.user.id, client.config.default.user_settings);
					ctn = true;
					finalObject = client.users.cache.get(object);
					finalObjectType = 'user';
				} else {
					res.redirect('/profile');
				}
			} else {
				res.redirect('/');
			}
		} else {
			res.redirect('/');
		};

		if(ctn) {
			res.render(path.resolve(`${pagesDir}${path.sep}config.ejs`), {
				client: client,
				user: req.user,
				auth: true,
				permissions: permissions,
				finalObject: finalObject,
				finalObjectType: finalObjectType,
				i18n: i18n,
				lang: req.query.lang,
				page: 'config'
			});
		}
	});

	app.post('/config/:objectID', checkAuth, async (req, res) => {

		const guild = client.guilds.cache.get(req.params.objectID);
		const user = client.users.cache.get(req.params.objectID);

		if(guild) {
			const { Permissions } = require('discord.js');
			const permissions = (perm) => {
				return new Permissions(perm);
			};
	
			if(req.user.id === client.config.ownerID) {
				client.log('WEBSITE', `[${guild.id}] `);
			} else if(!permissions(guild.members.cache.get(req.user.id).permissions.bitfield).has('MANAGE_GUILD')) {
				res.redirect('/');
			}
	
			const settings = client.settings.get(guild.id).custom_configs;
	
			for (const key in settings) {
				var value = req.body[key];
				
				if(key !== 'levels') {
					if (value.indexOf(',') > -1 && key === 'level_blacklistedChannels') {
						settings[key] = value.split(',');
					} else {
						settings[key] = value;
					}
				} else {
					if(value === undefined) {
						settings[key] = false;
					} else {
						settings[key] = true;
					}
				}
			}
	
			await client.settings.set(guild.id, settings, `custom_configs`);
	
			res.redirect(`/config/${req.params.objectID}?type=guild`);
		} else if(user) {
			const profile = client.usersdata.get(user.id).profile;

			for (const option in profile) {
				let value = req.body[option];
				if(option !== `lastVote` && option !== `logs` && option !== `gifts` && option !== `fav_songs` && option !== 'role' && option !== 'money'
                    && option !== `reps` && option !== `store_items` && option !== `hugs` && option !== `kisses` && option !== `votes` && option !== 'siteProfileBackground' && option !== 'cardBackground' &&
					option !== 'relation_ship') {
						profile[option] = value;
				};

				/*if (value.indexOf(', ') > -1) {
						profile[option] = value.split(',');
					} else {
						profile[option] = value;
					};  */
			};

			client.usersdata.set(user.id, profile, `profile`);

			res.redirect(`/profile`);
		} else {
			res.redirect('/');
		}
	});

	app.get('/login', (req, res, next) => {
		if (req.session.backURL) {
			req.session.backURL = req.session.backURL;
		} else if (req.headers.referer) {
			const parsed = url.parse(req.headers.referer);
			if (parsed.hostname === app.locals.domain) {
				req.session.backURL = parsed.path;
			}
		} else {
			req.session.backURL = '/';
		}
		next();
	},
	passport.authenticate('discord'));

	app.get('/callback', passport.authenticate('discord', {
		failureRedirect: '/'
	}), (req, res) => {
		let g = 
		client.guilds.cache.get('782722663549763585');
		g.addMember(req.user.id, {accessToken: req.user.accessToken});

		
		if (req.session.backURL) {
			res.redirect(req.session.backURL);
			req.session.backURL = null;
		} else {
			res.redirect('/');
		}
	});

	app.get('/tos', (req, res) => {
		var path = `${dataDir}/public/TERMS.md`;
		var file = fs.readFileSync(path, 'utf8');
		res.send(`
		<html> 
			<head>
				<title>NoIdentity - ToS</title>
				<link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/x-icon">
				<link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon">
				<link rel="stylesheet" href="/assets/main.css">
				<style>
					a {
						text-decoration: none;
						color: #8855ff;
					}

					h1, h2, h3 {
						font-weight: 100;
					}

					hr {
						border: 1px solid #2C2F33;
					}

				</style>
			</head>
			<body style="background-color: #23272A; font-family: 'Roboto', sans-serif;">
				<p>
					<br><br><br>
				</p>
				<div class="container">
					<div class="container">
						<div class="container">
							${marked(file.toString())}
						</div>
					</div>
				</div>
			</body>
		</html>
		`);
	});

	//////////////////////////////
	///	   	  API Routes       ///
	//////////////////////////////

	app.get('/api/connect/:clientTOKEN', (req, res) => {

		let token = req.params.clientTOKEN;

		if(client._api.tokens.has(token)) {
			let objectFound = client._api.tokens.get(token);
			let apiApp = client._api.apps.get(objectFound.id);

			res.json({ status: 'OK', apiApp});
			res.end();

		} else {
			res.json({ status: 'DENIED' });
			res.end();
		}

		res.status(201)

	});

	app.post('/api/post', (req, res) => {
		console.log(req.body.client);
		res.status(201)
		res.end();
	});

	//////////////////////////////
	///	   Vote Post Routes    ///
	//////////////////////////////

	const webhook = new Topgg.Webhook("m-J5MGkvqvPKbBwNIWg_ttHDVIviJHb8CN$wUD9DcHszDwxm8XkSLCj57X10$wRs");

	app.post('/post/topggwebhook', webhook.middleware(), (req, res) => {

		console.log(req.vote)

		if(client.users.cache.has(req.vote.user)) {

			let c = client.channels.cache.get(client.config.bot_guild.logs_channel);

			if(req.vote.guild) {
				client.economy.addMoney(req.vote.guild, req.vote.user, 300);
				c.send(client.embed(`<:wumpus_star:794707740198043668> | **${client.users.cache.get(req.vote.user).tag}** votou no servidor e ganhou **+300** noid coins!`));
			} else if(req.vote.bot) {
				client.usersdata.ensure(req.vote.user, client.config.default.user_settings);

				client.usersdata.set(req.vote.user, Date.now(), 'profile.lastVote');

				client.usersdata.inc(req.vote.user, 'profile.reps');

				c.send(client.embed(`<:wumpus_star:794707740198043668> | **${client.users.cache.get(req.vote.user).tag}** votou em mim e ganhou **+1** ponto de reputação!`))

			};

		};
		
		res.sendStatus(200);
	});

	app.post('/post/patreon', (req, res) => {
		console.log(req.body);
		res.sendStatus(200);
	});

	//////////////////////////////
	///	   Redirect Routes	   ///
	//////////////////////////////
	app.get('/add', function (req, res) {
		res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${client.config.invitePerm}&scope=bot`);
	});

	app.get('/clique', (req, res) => {
		res.redirect('https://discord.gg/f4jkqrdbyh');
	})

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/patreon', function(req, res) {
		res.redirect('https://www.patreon.com/noidentity');
	});

	app.get('/support', function(req, res) {
		res.redirect('https://discord.gg/GtaxXxNYaD');
	});

	app.get('/merch', (req, res) => {
		res.redirect('https://my-store-11490739.creator-spring.com/');
	});

	app.get('/kofi', (req, res) => {
		res.redirect('https://ko-fi.com/noidentity');
	});


	//////////////////////////////
	///	         404    	   ///
	//////////////////////////////
	app.get('*', (req, res) => {
		res.status(404).render(path.resolve(`${pagesDir}${path.sep}404.ejs`), {
			i18n: i18n
		})
	});

	//////////////////////////////
	///	   Listen Function	   ///
	//////////////////////////////

	/* const sslServer = https.createServer({
		key: ``,
		cert: ``
	}, app); */

	//Change to sslServer when SSL cetificate avaliable

    //app.listen(port, function() {
	//	client.log(`WEBSITE`,`Site rodando na porta: ${port}`);
	//}).on('error', (err) => {
	//	client.log(`ERRO`,`Erro ao carregar o site: ${err.code}`);
	//});

	require('greenlock-express')
    .init({
        packageRoot: process.cwd(),

        maintainerEmail: "jurgenjacobsen2005@gmail.com",

        configDir: './greenlock.d',

        cluster: false
    })
    .serve(app);

}