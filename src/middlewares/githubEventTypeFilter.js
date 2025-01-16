const githubEventTypeFilter = () => async (req, res, next) => {
  const { action } = req.body;
  
  if (action === 'reopened' || action === 'opened') {
    return next();
  }
  return res.status(200).send('Event is not supported');
};

module.exports = githubEventTypeFilter;