import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';
import 'dotenv/config';
import i18n from 'i18n';

function customExtractor(req) {
  let token = null;
  if (req.headers.token) token = req.headers.token.split(' ')[1];
  return token;
}

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([customExtractor]),
  secretOrKey: process.env.ACCESS_TOKEN,
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          const res = {
            status: 'ERR',
            message: i18n.__('user.not_found'),
          };
          return done(null, false, res);
        }
      })
      .catch((err) => {
        const res = {
          status: 'ERR',
          message: i18n.__('user.auth_error'),
        };
        return done(err, false, res);
      });
  })
);

export default passport;
