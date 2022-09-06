require('dotenv').config()



//passport strategy
const passport = require('passport');
var MicrosoftStrategy = require('passport-microsoft').Strategy;
passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACKURL,
        scope: ['user.read', 'email', 'openid']
    },
    function(accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACKURL,
    },
    function(accessToken, refreshToken, cb, done) {
        done(null, cb);

    }
));
const MagicLinkStrategy = require('passport-magic-link').Strategy
var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});


//Run express app
var express = require('express');
// var exceptionHandler = require('express-exception-handler')
// exceptionHandler.handle()
var app = express();
app.use(express.urlencoded({ extended: false }));
var bodyParser = require('body-parser');
const session = require('express-session')
var request = require('request');
const flash = require('express-flash');
app.use(flash());
cookieParser = require('cookie-parser'); // in order to read cookie sent from client
app.use(cookieParser(process.env.COOKIE_SECRET));
passport.use(new MagicLinkStrategy({
    secret: process.env.MAGICLINK_SECRET,
    userFields: ['email'],
    tokenField: 'token',
    verifyUserAfterToken: true

}, (user, token) => {
    var mailOptions = {
        from: '"EduAuth" <' + process.env.EMAIL_USER + '>',
        to: user.email,
        subject: 'Inloggen met Magic Link',
        html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <title></title> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> #outlook a{padding: 0;}body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}p{display: block; margin: 13px 0;}</style><!--[if mso]> <noscript> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript><![endif]--><!--[if lte mso 11]> <style type="text/css"> .mj-outlook-group-fix{width:100% !important;}</style><![endif]--> <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700" rel="stylesheet" type="text/css"> <style type="text/css"> @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700); </style> <style type="text/css"> @media only screen and (min-width:480px){.mj-column-per-100{width: 100% !important; max-width: 100%;}}</style> <style media="screen and (min-width:480px)"> .moz-text-html .mj-column-per-100{width: 100% !important; max-width: 100%;}</style> <style type="text/css"> @media only screen and (max-width:480px){table.mj-full-width-mobile{width: 100% !important;}td.mj-full-width-mobile{width: auto !important;}}</style></head><body style="word-spacing:normal;background-color:#fafbfc;"> <div style="background-color:#fafbfc;"> <div style="margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"> <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;"> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"> <tbody> <tr> <td align="center" style="font-size:0px;padding:25px;word-break:break-word;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"> <tbody> <tr> <td style="width:125px;"> <img height="auto" src="https://eduauth.hosted.daanschenkel.nl/assets/logo-invert.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="125"/> </td></tr></tbody> </table> </td></tr></tbody> </table> </div></td></tr></tbody> </table> </div><div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"> <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:20px;padding-top:20px;text-align:center;"> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:middle;" width="100%"> <tbody> <tr> <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"> <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;"><span>Hallo,</span></div></td></tr><tr> <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"> <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">Klik op de onderstaande knop om in te loggen op je EduAuth account!</div></td></tr><tr> <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"> <tr> <td align="center" bgcolor="#20c5a0" role="presentation" style="border:none;border-radius:8px;cursor:auto;mso-padding-alt:10px 25px;background:#20c5a0;" valign="middle"> <a href="https://eduauth.hosted.daanschenkel.nl/provider/magiclink/callback?token=${token}" style="display:inline-block;background:#20c5a0;color:#ffffff;font-family:open Sans Helvetica, Arial, sans-serif;font-size:18px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:8px;" target="_blank">Klik hier om in te loggen</a> </td></tr></table> </td></tr><tr> <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"> <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:8px;line-height:1;text-align:center;color:#000000;">Als de knop niet werkt kun je ook deze link kopieren en in je browser plakken:<br></br><a href="https://eduauth.hosted.daanschenkel.nl/provider/magiclink/callback?token=${token}">https://eduauth.hosted.daanschenkel.nl/provider/magiclink/callback?token=${token}</a></div></td></tr><tr> <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"> </td></tr><tr> <td align="center" style="font-size:0px;padding:10px 25px;padding-right:25px;padding-left:25px;word-break:break-word;"> <div style="font-family:open Sans Helvetica, Arial, sans-serif;font-size:16px;line-height:1;text-align:center;color:#000000;">Als er iets niet lukt kun je altijd contact met ons opnemen:<br>daan@daanschenkel.nl<br><br>- Het EduAuth Team</div></td></tr></tbody> </table> </div></td></tr></tbody> </table> </div></div></body></html>`,

    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}, (user) => {
    return user;

}))



const path = require('path')
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    name: "edusession",
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(passport.initialize());
var { Strategy } = require('passport-openidconnect');

// Kennisnet

// //Production 
// passport.use('oidc', new Strategy({
//     issuer: 'https://oidcng.entree.kennisnet.nl',
//     authorizationURL: 'https://oidcng.entree.kennisnet.nl/oidc/authorize',
//     tokenURL: 'https://oidcng.entree.kennisnet.nl/oidc/token',
//     userInfoURL: 'https://oidcng.entree.kennisnet.nl/oidc/userinfo',
//     clientID: 'eduauth.hosted.daanschenkel.nl',
//     clientSecret: process.env.KENNISNET_PRODUCTION_SECRET,
//     callbackURL: process.env.KENNISNET_PRODUCTION_CALLBACKURL,
//     scope: 'openid profile'
// }, (issuer, profile, done) => {
//     return done(null, profile);
// }));

//Staging
passport.use('oidc', new Strategy({
    issuer: 'https://oidcng.entree-s.kennisnet.nl',
    authorizationURL: 'https://oidcng.entree-s.kennisnet.nl/oidc/authorize',
    tokenURL: 'https://oidcng.entree-s.kennisnet.nl/oidc/token',
    userInfoURL: 'https://oidcng.entree-s.kennisnet.nl/oidc/userinfo',
    clientID: 'eduauth_staging',
    clientSecret: process.env.KENNISNET_STAGING_SECRET,
    callbackURL: process.env.KENNISNET_STAGING_CALLBACKURL,
    scope: 'openid profile'
}, (issuer, profile, done) => {
    return done(null, profile);
}));


app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser((req, user, done) => {
    req.session.user = user;
    return done(null, user); // return valid object if user exists in our database
});


// Handle 500
app.use((err, req, res, next) => {
    var message = "Er is een serverfout opgetreden, probeer het later opnieuw. <br><br>Foutmelding: <b>" + error + "</b>";
    res.status(500).render("error.html", { message: message });
    console.log(error);
});
//microsoft
app.get('/provider/microsoft',
    passport.authenticate('microsoft'));

app.post('/provider/password',
    passport.authenticate('local', {
        failureRedirect: '/provider/failure',
        failureMessage: true,
        failureFlash: true,
    }),
    function(req, res) {
        res.redirect('/redirect');
    });

app.get('/provider/microsoft/process',
    passport.authenticate('microsoft', {
        failureRedirect: '/provider/failure',
        failureFlash: false,
    }),
    function(req, res) {
        // Successful authentication
        res.redirect("/redirect");
    });


//google
app.get('/provider/google',
    passport.authenticate('google', {
        scope: ['openid', 'email', 'profile']
    }));

app.get('/provider/google/process',
    passport.authenticate('google', {
        failureRedirect: '/provider/failure',
        failureFlash: false,
    }),
    function(req, res) {
        // Successful authentication
        res.redirect("/redirect");
    });

//magic link

app.post('/provider/magiclink',
    passport.authenticate('magiclink', { action: 'requestToken' }),
    (req, res) => {
        var message = "<b>Er is een email verstuurd naar " + req.body.email + "</b>";

        res.render("error.html", { message: message });

    }
);
app.get('/provider/magiclink/callback',
    passport.authenticate('magiclink', {
        action: 'acceptToken',
        userPrimaryKey: 'id'
    }),
    (req, res) => res.redirect('/redirect')
)


app.get("/provider/failure", (req, res) => {
    if (req.session.uuid) {
        res.redirect("/authenticate/" + req.session.uuid);
    } else {
        var message = "Kon inlogsessie niet hervatten.";
        res.render("error.html", { message: message });
    }
});

app.use('/provider/entree', passport.authenticate('oidc'));

app.use('/provider/entree/check',
    passport.authenticate('oidc', { failureRedirect: '/provider/failure' }),
    (req, res) => {
        res.redirect('/redirect');
    }
);
app.get('/provider/entree/process',
    // wrap passport.authenticate call in a middleware function
    function(req, res, next) {
        // call passport authentication passing the "local" strategy name and a callback function
        passport.authenticate('oidc', function(error, user, info) {
            // this will execute in any case, even if a passport strategy will find an error
            // log everything to console
            console.log(error);
            console.log(user);
            console.log(info);

            if (error) {
                res.status(401).send(error);
            } else if (!user) {
                res.status(401).send(info);
            } else {
                next();
            }

            res.status(401).send(info);
        })(req, res);
    },

    // function to call once successfully authenticated
    function(req, res) {
        res.status(200).send('logged in!');
    });

//import uuid library
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');
const { json } = require('express');

//base64 function
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function(e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function(e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) { t = t + String.fromCharCode(r) }
            if (a != 64) { t = t + String.fromCharCode(i) }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function(e) {
        e = e.replace(/rn/g, "n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function(e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
}

//Connect to SQLite
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

//Use body parser

app.use(bodyParser.urlencoded({ extended: false }));

//Set static files
app.use('/assets', express.static(path.join(__dirname, 'views/assets')));
app.use('/home', express.static(path.join(__dirname, 'views/home')));

//Set views
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

//Routes
app.get('/', function(req, res) {
    return res.redirect("/home")
});

app.get('/demo', function(req, res) {
    res.render("Demo.html");

});
app.get('/demo/success', function(req, res) {
    var educode = req.query.educode;
    //make url request
    request('https://eduauth.hosted.daanschenkel.nl/api/userdata?educode=' + educode, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // if (body.response === "Success") {
            //     res.send("Je bent ingelogd!");
            // } else {
            //     return res.redirect("/logout");
            // }
            var obj = JSON.parse(body);
            if (obj.response === "Success") {
                console.log("loggedin")
                var message = "<b>Resultaat</b><br>" + body + "<br>" + `<a href="https://eduauth.hosted.daanschenkel.nl/logout/eyJyZWRpcmVjdCI6ICJodHRwczovL2VkdWF1dGguaG9zdGVkLmRhYW5zY2hlbmtlbC5ubC9kZW1vIiwgInByb3ZpZGVyIjogIkRlbW8ifQ=="
class="btn btn-danger btn-lg border rounded-0 ripple-effect">Uitloggen</a>`;
                res.render("error.html", { message: message });


            } else {
                return res.redirect("/demo");
            }
        }
    });
})

app.get('/redirect', function(req, res) {
    if (req.signedCookies.uuid && req.session.passport) {
        var displayName = req.session.passport.user.displayName;
        var email = req.session.passport.user.emails;
        var email = JSON.stringify(email);
        var userId = req.session.passport.user.id;

        if (req.session.passport.user.email) {
            if (!req.session.passport.user.displayName) {
                email = '[{"value": "' + req.session.passport.user.email + '", "verified": true}]';
                var displayName = "unknown";
                var userId = req.session.passport.user.email;
            }
        }

        //Generate long secure token

        var token = uuidv4();
        //add name and email to tokens table
        db.run("INSERT INTO tokens (name, email, id, token) VALUES (?, ?, ?, ?)", [displayName, email, userId, token], function(err) {
            if (err) {
                console.log(err);
            }
            //if success
            else {
                console.log("success")
            }
        });


        //get redirect url from uuid database and redirect to it
        db.get("SELECT redirect FROM uuids WHERE uuid = ?", req.signedCookies.uuid, function(err, row) {
            if (err) {
                console.log(err);
            }
            if (row) {
                var redirect = row.redirect;
                //delete uuid from database
                db.run("DELETE FROM uuids WHERE uuid = ?", req.signedCookies.uuid);
                //redirect to redirect url
                res.redirect(redirect + "?educode=" + token);
            } else {
                var message = "UUID is incorrect."
                res.render("error.html", { message: message });

            }
        });




    } else {
        var message = "De cookie is verlopen. Controleer of je cookies accepteert in deze browser."
        res.render("error.html", { message: message });

    }






});


//handshake route
app.get('/handshake', function(req, res) {
    var message = "Er ging iets fout, probeer het opnieuw."
    res.render("error.html", { message: message });
});
app.post('/handshake', function(req, res) {
    var uuid = uuidv4();

    var provider = req.body.provider;
    var redirect = req.body.redirect;
    var env = req.body.env;


    //check if provider is in database
    db.get("SELECT * FROM providers WHERE name = ?", provider, function(err, row) {
        if (err) {
            console.log(err);
            var message = "Oeps, er ging iets niet helemaal goed! Deel deze code met ons zodat we je kunnen helpen: <b>" + uuid + "</b>";
            res.render("error.html", { message: message });
        } else {
            if (row) {
                if (redirect.startsWith(row["domain"])) {
                    //insert uuid in database

                    db.run("INSERT INTO uuids (uuid, provider, redirect, env) VALUES (?, ?, ?, ?)", uuid, provider, redirect, env, function(err) {
                        if (err) {
                            console.log(err);
                            var message = "Oeps, er ging iets niet helemaal goed! Deel deze code met ons zodat we je kunnen helpen: <b>" + uuid + "</b>";
                            res.render("error.html", { message: message });
                        } else {

                            let options = {
                                maxAge: 1000 * 60 * 15, // would expire after 15 minutes
                                httpOnly: true, // The cookie only accessible by the web server
                                signed: true // Indicates if the cookie should be signed
                            }

                            // Set cookie
                            res.cookie('uuid', uuid, options) // options is optional

                            //encode and redirect to authenticate route
                            var message = "Sessie wordt gestart!<br><noscript>Javascript moet aanstaan om het inlogproces te starten!</noscript><script>window.location.href = '/authenticate/'</script>";
                            res.render("error.html", { message: message });
                            // res.redirect("/authenticate/" + encodedString);
                        }
                    });

                } else {
                    var message = "Redirect URL Mismatch.";
                    res.render("error.html", { message: message });
                }



            } else {
                var message = "Deze provider is niet gevonden in onze database. Vraag deze provider om hulp.";
                res.render("error.html", { message: message });
            }
        }
    });




});

app.get('/logout/:base64', function(req, res) {
    var base64 = req.params.base64;
    var decodedString = Base64.decode(base64);
    var decodedString = JSON.parse(decodedString);
    var redirect = decodedString.redirect;
    var provider = decodedString.provider;

    //Check if redirect url is valid for provider
    db.get("SELECT * FROM providers WHERE name = ?", provider, function(err, row) {
        if (err) {
            console.log(err);
            var message = "Oeps, er ging iets niet helemaal goed! Deel deze code met ons zodat we je kunnen helpen: <b>" + uuid + "</b>";
            res.render("error.html", { message: message });
        } else {
            if (row) {
                if (redirect.startsWith(row["domain"])) {
                    if (!req.query.remember && !req.query.forget) {
                        res.render("logout.html", { provider: provider });
                    } else {
                        if (req.query.forget) {
                            return res.clearCookie('edusession', { path: '/' }).status(302).redirect(redirect);
                        } else if (req.query.remember) {
                            return res.redirect(redirect);
                        } else {
                            res.redirect("?");
                        }
                    }

                } else {
                    var message = "Redirect URL Mismatch.";
                    res.render("error.html", { message: message });
                }
            } else {
                var message = "Deze provider is niet gevonden in onze database. Vraag deze provider om hulp.";
                res.render("error.html", { message: message });
            }
        }
    });

});
//authenticate route
app.get('/authenticate/', function(req, res) {
    decodedString = req.signedCookies.uuid;
    if (!decodedString) {
        var message = "De cookie is verlopen. Controleer of je cookies accepteert in deze browser."
        res.render("error.html", { message: message });
    }
    var upfail = req.session.messages;
    req.session.messages = "";
    //get uuid from database
    db.get("SELECT * FROM uuids WHERE uuid = ?", decodedString, function(err, row) {
        if (err) {
            console.log(err);
            var message = "Er ging iets fout, probeer het opnieuw.";
            res.render("error.html", { message: message });
        } else {
            if (row) {
                //get data from uuid
                var provider = row["provider"];
                var redirect = row["redirect"];
                var env = row["env"];
                //check if provider is in database
                db.get("SELECT * FROM providers WHERE name = ?", provider, function(err, row) {
                    if (err) {
                        console.log(err);
                        var message = "Kon provider niet vinden in database. Probeer het opnieuw.";
                        res.render("error.html", { message: message });
                    } else {
                        if (row) {
                            if (redirect.startsWith(row["domain"])) {
                                var encodedString = Base64.encode(decodedString);
                                req.session.uuid = encodedString;
                                if (!req.session.passport) {
                                    res.render("login.html", { provider: provider, error: upfail });
                                } else {
                                    return res.redirect("/redirect");
                                }
                            } else {
                                var message = "Redirect URL Mismatch.";
                                res.render("error.html", { message: message });
                            }
                        } else {
                            var message = "Deze provider is niet gevonden in onze database. Vraag deze provider om hulp.";
                            res.render("error.html", { message: message });
                        }
                    }
                });

            } else {
                var message = "Deze login-url is helaas verlopen. Ga terug naar de website van de provider om het nog eens te proberen";
                res.render("error.html", { message: message });
            }
        }
    });





});

//token to data route
app.get('/api/userdata', function(req, res) {
    var token = req.query.educode;
    if (!token) {
        var response = { response: "No token provided" };
        return res.send(res.json(response));
    } else {
        //get data from tokens table
        db.get("SELECT * FROM tokens WHERE token = ?", token, function(err, row) {
            if (err) {
                console.log(err);
                var response = { response: "Database error" };
                return res.send(response);
            } else {
                if (row) {
                    var response = { response: "Success", data: row };
                    //delete token from tokens table
                    db.run("DELETE FROM tokens WHERE token = ?", token, function(err) {
                        if (err) {
                            console.log(err);
                            var response = { response: "Database error" };
                        }
                    });
                    return res.send(response);
                } else {
                    var response = { response: "Token expired or invalid" };
                    return res.send(response);
                }
            }
        });
    }
});

//add provider endpoint
// app.get('/addprovider', function(req, res) {
//     var provider = req.query.provider;
//     var domain = req.query.domain;
//     db.run('INSERT INTO providers(name, domain) VALUES(?, ?)', ["praktijkbijbaan", "http://localhost:3000"], (err) => {
//         if (err) {
//             return console.log(err.message);
//         }
//         res.send("row added");
//     })
// });
//set 404 and start listening.
app.use(function(req, res, next) {
    res.status(404);
    res.render('error.html', { message: 'Deze pagina kon niet gevonden worden.' });
}).on('error', function(err) {
    console.log(err);
}).listen(3001);

console.log("EduAuth Gestart op poort 3001");