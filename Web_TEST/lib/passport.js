var db = require('../lib/db');
var bcrypt = require('bcrypt');


module.exports = function (app) {
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (id, done) {
        console.log('serializeUser', id);
        done(null, id);
    });

    passport.deserializeUser(function (id, done) {
        done(null, id);
    });

    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'pwd'
        },
        function (id, pwd, done) {
            console.log('LocalStrategy', id, pwd);
            db.query(`SELECT ID,PW from emmas.signin where ID=?;`,[id], function(error,results,fields){
                if(error){
                    return done(null, false, {
                        message: 'Incorrect id entered..'
                    });
                }else{
                    console.log(results.length);
                    if(results.length==0){
                        return done(null,false,'Incorrect id entered.');
                    }
                    var id = results[0]['ID'];
                    var pw = results[0]['PW'];
                    pw =  bcrypt.hashSync(pw,10);
                    console.log(pwd,pw);
                    bcrypt.compare(pwd, pw, function(err,result){
                        if(result){
                            return done(null, id, {
                                message: 'Welcome.'
                            });
                        } else {
                            return done(null, false, {
                                message: 'Password is not correct.'
                            });
                        }
                    });
                }
              });
        }
    ));
    return passport;
}