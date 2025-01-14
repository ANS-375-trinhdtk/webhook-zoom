const express = require('express');
const zoomtRoute = require('./zoom.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/hooks',
    route: zoomtRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;