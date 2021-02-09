
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

const passport = require('passport');
const session = require('express-session');
const Strategy = require('passport-discord').Strategy;

//For time formating
const moment = require('moment');
require('moment-duration-format');

module.exports = (client) => {
    const port = env.PORT || 80

    const dataDir = path.resolve(`${process.cwd()}${path.sep}website`);
    const pagesDir = path.resolve(`${dataDir}${path.sep}pages`);

	app.use(bodyParser.urlencoded({extended: false}));
	app.set('trust proxy', 5);
	app.use(morgan('[:date[clf]] | :remote-addr | :method  |  :url  |  :status  |  :response-time ms'));
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
		scope: ['identify', 'email', 'guilds']
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

	//////////////////////////////
	///	        Routes         ///
	//////////////////////////////

    app.get('/', (req, res) => {
		res.render(path.resolve(`${pagesDir}${path.sep}home.ejs`), {
				client: client,
				auth: req.isAuthenticated() ? true : false,
				user: req.isAuthenticated() ? req.user : null,
				moment: moment,
		});
    });

	app.get('/commands', (req, res) => {
        res.render(path.resolve(`${pagesDir}${path.sep}commands.ejs`), {
            client: client,
            auth: req.isAuthenticated() ? true : false,
			user: req.isAuthenticated() ? req.user : null,
        });
	});
	
	app.get('/profile', checkAuth, (req, res) => {
		res.render(path.resolve(`${pagesDir}${path.sep}profile.ejs`), {
			client: client,
			user: req.user,
			auth: true
		});
	});

	app.get('/dashboard', checkAuth, (req, res) => {
		const { Permissions } = require('discord.js');
		const permissions = (perm) => {
			return new Permissions(perm);
		}

		res.render(path.resolve(`${pagesDir}${path.sep}dashboard.ejs`), {
			client: client,
			user: req.user,
			auth: true,
			permissions: permissions,
		});
	});

	app.get('/edit/:objectID', checkAuth, (req, res) => {
		// /edit/objectID?type=guild || user

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
			res.render(path.resolve(`${pagesDir}${path.sep}edit.ejs`), {
				client: client,
				user: req.user,
				auth: true,
				permissions: permissions,
				finalObject: finalObject,
				finalObjectType: finalObjectType,
			});
		}
	});

	app.post('/edit/:objectID', checkAuth, async (req, res) => {
		const guild = client.guilds.cache.get(req.params.objectID);
		const user = client.users.cache.get(req.params.objectID);

		if(guild) {
			const { Permissions } = require('discord.js');
			const permissions = (perm) => {
				return new Permissions(perm);
			};
	
			if(req.user.id === client.config.ownerID) {
				console.log(`Passe de acesso de administrador`);
			} else if(!permissions(guild.members.cache.get(req.user.id).permissions.bitfield).has('MANAGE_GUILD')) {
				res.redirect('/');
			}
	
			const settings = client.settings.get(guild.id).custom_configs;
	
			for (const key in settings) {
				var value = req.body[key];
	
				if (value.indexOf(',') > -1) {
					settings[key] = value.split(',');
				} else {
					settings[key] = value;
				}
			}
	
			await client.settings.set(guild.id, settings, `custom_configs`);

			await guild.channels.cache.get(client.settings.get(guild.id).custom_configs.radio_channelID).join();
	
			res.redirect(`/edit/${req.params.objectID}?type=guild`);
		} else if(user) {
			const profile = client.usersdata.get(user.id).profile;

			for (const option in profile) {
				let value = req.body[option];

				if (value.indexOf(', ') > -1) {
					profile[option] = value.split(',');
				} else {
					profile[option] = value;
				};
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
		if (req.session.backURL) {
			res.redirect(req.session.backURL);
			req.session.backURL = null;
		} else {
			res.redirect('/');
		}
	});

	//////////////////////////////
	///	   	  API Routes       ///
	//////////////////////////////

	app.get('/api/docs', checkAuth, (req, res) => {
		res.render(path.resolve(`${pagesDir}${path.sep}api_docs.ejs`), {
			client: client,
			user: req.user,
			auth: true,
		});
	});

	app.get('/api/app/:appID/token/:appToken', (req, res) => {
		let appID = req.params.appID;
		let token = req.params.appToken;

		let data = client.apiDocs.apps.get(`${appID}`);
		
		if(data.token === token) {
			res.json(data);
		};
	});

	/* 
	
	app.get('/api/:requested', (req, res) => {
		let apiTOKEN = req.query.token;
		let apiUSER = req.query.user;

		let requested = req.params.requested;

		if(!apiTOKEN) return;
		if(!apiUSER) return;

		if(client.usersdata.get(apiUSER).api.token === apiTOKEN) {
			try {
				res.json(eval(requested));
			} catch(err) { }
		} else {
			res.status(404);
			res.redirect('/');
		};
	});

	*/

	//////////////////////////////
	///	   Redirect Routes	   ///
	//////////////////////////////
	app.get('/invite', function (req, res) {
		res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${client.config.invitePerm}&scope=bot`);
	});

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


	//////////////////////////////
	///	         404    	   ///
	//////////////////////////////
	app.get('*', (req, res) => {
		res.status(404).render(path.resolve(`${pagesDir}${path.sep}404.ejs`))
	});

	//////////////////////////////
	///	   Listen Function	   ///
	//////////////////////////////

	/* const sslServer = https.createServer({
		key: ``,
		cert: ``
	}, app); */

	//Change to sslServer when SSL cetificate avaliable

    app.listen(port, function() {
		client.log(`WEBSITE`,`Site rodando na porta: ${port}`);
	}).on('error', (err) => {
		cleint.log(`ERRO`,`Erro ao carregar o site: ${err.code}`);
	});
}