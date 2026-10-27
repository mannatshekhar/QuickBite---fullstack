module.exports = (req, res, next) => {
  const key = req.header('x-admin-key');
  if (!key || key !== (process.env.ADMIN_KEY || 'quickbite-admin')) {
    return res.status(401).json({ message: 'Wrong admin passcode' });
  }
  next();
};
