'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      console.log(req.body);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      console.log(req.body);
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      console.log(req.body);
    });
    
};
