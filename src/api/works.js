// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;

// ----------------------------------------------------------------------------
// variables
const _router = router();

// ----------------------------------------------------------------------------
// create route to handle /token
_router
  .route('/')
  .all((request, response) => {
    response.json({
      message: 'It works'
    });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
