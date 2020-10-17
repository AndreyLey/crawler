const urlRoutes= require('./url_routes');

module.exports = function(app,db){
    urlRoutes(app,db);
}