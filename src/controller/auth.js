
let jwt = require('jwt-simple');
let Log = require('../logger');

/*************************** 
 * Auth middleware
***************************/
let tokenHeader = 'x-token'

module.exports = (req, res, next) => {

  let token = req.header(tokenHeader);
  if (token === undefined) {
    return res.status(401).json({
      err: 'You need to provide a token' 
    });
  }

  let payload = jwt.decode(token, Buffer.from(process.env['PROXY_KEY']));
  
  if (payload === undefined || payload === null) {
    return res.status(401).json({
      err: `bad token, cheater !`
    });
  }
  
  if(payload.expiration < Date.now() && !process.env.NODE_ENV === 'development' ) {
    Log.debug('[AUTH] token payload', payload);
    return res.status(401).json({
      err: `This token is expired since ${new Date(payload.expiration)}`
    });
  }
  // Check permissions  
  /*for(let l of req.route.stack) {
    console.log(l);
  }*/
  next(); 
};
