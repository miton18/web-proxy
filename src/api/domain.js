// ----------------------------------------------------------------------------
// requirements
const eRouter = require('express').Router;
const Db = require('../utils/database');
const Log = require('../utils/logger');
const {authenticationJwt} = require('../middlewares/authentication');

// ----------------------------------------------------------------------------
// variables
const _router = eRouter();

// ----------------------------------------------------------------------------
// route params
_router.param('_id', (request, response, next, _id) => {
  Db.models.Domain.findById(_id, (err, domain) => {
    if (domain) {
      request.proxyDomain = domain;
    } else {
      Log.warn('[api][domain] not found', err);
      request.proxyDomain = null;
    }

    next();
  });
});

// ----------------------------------------------------------------------------
// create route to handle /route
_router
  .route('/')
  .all(authenticationJwt)
  .get((req, res) => {
    Db.models.Domain.find({}, (err, domains) => {
      if(err) {
        Log.warn('[api][domain] no domains', err);
        return res
          .status(500)
          .json({error: `Cannot fetch domains`});
      }
      res.json(domains);
    });
  })
  .post((req, res) => {
    const {name} = req.body;

    const tmp = new Db.models.Domain({name});
    tmp.save( (err) => {
      if (err) {
        return res
          .status(500)
          .json({error: `Fail to save new domains`});
      }
      
      Log.info('[API] new domain', tmp.toObject());
      res.json(tmp.toObject());
    });
  });

_router.route('/:_id')
  .all(authenticationJwt)
  .get((req, res) => {
    if(!req.proxyDomain) {
      return res
        .status(500)
        .json({error: 'Unknow domain'});
    }

    res.json(req.proxyDomain);
  })
  .put((req, res) => {
    if (!req.proxyDomain)
      return res.status(500).json({error: 'Domain not exist'});

    const {name} = req.body;
    req.proxyDomain.name = name;
    req.proxyDomain.save(function(err) {
      if (err) return res.status(500).json({error: `Fail to update domain`});
      res.json(req.proxyDomain);
    });
  })
  .delete((req, res) => {
    if(!req.proxyDomain) return res
      .status(500)
      .json({error: `Domain doesn't exist`});

    req.proxyDomain.remove((err) => {
      if (err) return res.status(500).json({error: `Fail to remove domain`});
      res.json(req.proxyDomain);
    });
  });

// ----------------------------------------------------------------------------
// export
module.exports = _router;
