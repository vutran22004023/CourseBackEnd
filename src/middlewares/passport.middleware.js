import passport from 'passport';
import i18n from 'i18n';

export default function passportMiddleware(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return res.status(500).json({ message: i18n.__('error.server') });
    if (!user) return res.status(401).json({ status: 'ERR', message: i18n.__('auth.invalid_token') });
    req.user = user;
    next();
  })(req, res, next);
}
