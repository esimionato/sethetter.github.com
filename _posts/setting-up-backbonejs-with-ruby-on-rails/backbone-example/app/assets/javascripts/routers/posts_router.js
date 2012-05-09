BackboneExample.Routers.Posts = Backbone.Router.extend({

  routes: {
    '': 'index'
  },
  
  initialize: function() {
    this.posts = new BackboneExample.Collections.Posts();
    this.posts.fetch();
  },
  
  index: function() {
    var postsView = new BackboneExample.Views.PostsIndex({
      collection: this.posts
    });
    $('#posts').html(postsView.render().el);
  }

});
