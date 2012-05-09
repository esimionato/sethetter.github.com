BackboneExample.Views.PostsIndex = Backbone.View.extend({

  template: JST['posts/index'],
  
  events: {
    'submit #new-post': 'createPost',
    'click .remove-post': 'removePost'
  },
  
  initialize: function() {
    this.collection.on('reset', this.render, this);
  },
  
  render: function() {
    $(this.el).html(this.template({
      posts: this.collection
    }));
    return this;
  },
  
  createPost: function(event) {
    event.preventDefault();
    
    var attributes = {
      title: $('#new-post-title').val(),
      content: $('#new-post-content').val()
    }
    
    this.collection.create(attributes, {
      wait: false,
      success: function() {
        $('#new-post')[0].reset();
      },
      error: this.handleError
    });
    
    this.collection.trigger('reset');
  },

  removePost: function(event) {
    event.preventDefault();
    console.dir(event);
    this.collection.get(event.target.id).destroy();
    this.collection.trigger('reset');
  },
  
  handleError: function(post, response) {
    if (response.status == 422) {
      var errors = $.parseJSON(response.responseText).errors;  
      for (attribute in errors) {
        var messages = errors[attribute];
        for (var i = 0, len = messages.length; i < len; i++) {
          message = messages[i];
          alert("" + attribute + " " + message);
        }
      }
    }
  }

});
