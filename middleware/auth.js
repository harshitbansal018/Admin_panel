
const isAuth = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }
  return res.redirect('/admin/login');
};

const isPublisher = (req, res, next) => {
  if (req.session && req.session.publisher) {
    return next();
  }
  return res.redirect('/publisher/login');
};

module.exports = { isAuth, isPublisher };