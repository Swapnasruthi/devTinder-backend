# DevTinder APIs

## AuthRouter
 - POST /signup
 - POST /login
 - POST /logout


## profileRouter
 - GET     /profile/view
 - PATCH   /profile/edit
 - PATCH   /profile/passwod


## statusRouter
 - POST   /request/send/interested/:userid
 - POST   /request/send/ignored/:userid
 - POST   /request/review/accepted/:requestid
 - POST   /request/review/rejected/:requestid


## UserRouter
 - GET    /user/connections
 - GET    /user/request
 - GET    /user/feed 