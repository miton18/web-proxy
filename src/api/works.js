// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;

// ----------------------------------------------------------------------------
// variables
const _router = router();

// ----------------------------------------------------------------------------
// create route to handle /token
_router
  .route('/works')
  .all((request, response) => {
    console.log(request.headers);

    response.json({
      message: 'It works'
    });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
