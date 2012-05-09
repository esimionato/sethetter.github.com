window.BackboneExample = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    new BackboneExample.Routers.Posts();
    Backbone.history.start();
  }
};

$(document).ready(function(){
  BackboneExample.init();
});