---
layout: post
title: Setting up Backbone.js with Ruby on Rails
categories: [ backbone, rails, ruby, javascript ]
---

Real-time web apps are all the rage now, and with an awesome framework like [Backbone.js][4], creating them is becoming a much more enjoyable process. I've been experimenting with this library recently and I've been having a blast. This post is intended to show you how to get a Rails project set up and backbone-ified.

## Backbone-on-Rails

The gem we will be using to get things up and running the easiest is [backbone-on-rails][1]. Normally I like to be able to figure out how to set up these things without a generator or assistant of some sort, but this simple gem does a nice job of setting up file organization and making sure the proper folders and files get required into your app via the [Rails Asset Pipeline][2].

This gem gives us a few simple features. First of all it makes sure the latest versions of Backbone.js and [Underscore.js][5] (which backbone is built on top of) are included in the Rails asset pipeline. Next it provides us with some generators to produce our file and folder structure for the project, and scaffolding for individual resources.

Another nice feature we are provided with is the choice to work in either [CoffeeScript][6] or Javascript. If you're unfamiliar with CoffeeScript, it is an alternative syntax language that compiles down to Javascript and has a ton of nice features. It will greatly reduce on the amount of code you need to write and can make the horrors of curly-brace languages disappear. Definitely worth a shot if you are more fond of ruby or python than you are Javascript.

## Setting up our project

First we'll start by installing the gem via rubygems. If you are unfamiliar with rubygems, then you definitely need to [check it out][3].

{% highlight sh %}
$> sudo gem install backbone-on-rails
{% endhighlight %}

Now that we have that ready to go, we can start setting up our Rails project.

{% highlight sh %}
$> rails new backbone-example
$> cd backbone-example
{% endhighlight %}

Next we need to include our dependencies. Open up our project's Gemfile and add in the following:

{% highlight ruby %}
gem 'backbone-on-rails'
{% endhighlight %}

That will make sure we are equipped with all the dependencies needed to let Backbone do it's thing. After you've added the gem to our Gemfile, we need to run a quick bundle. This will install the gem dependencies that we list in our Gemfile.

{% highlight sh %}
$> bundle
{% endhighlight %}

Now we can go ahead and run the install generator that backbone-on-rails provides us with. We can do this by running `rails generate backbone:install`. However, the default setting for this is to install coffeescript files instead of javascript. For this example we are going to be using the javascript install, so we will want to pass the `--javascript` flag like so:

{% highlight sh %}
$> rails g backbone:install --javascript
{% endhighlight %}

You should now see it create a few files and directories. The first which we will be taking a look at is our modified `application.js` file in our `app/assets/javascripts` directory.

{% highlight javascript %}
//= require jquery
//= require jquery_ujs
//= require underscore
//= require backbone

//= require backbone_example

//= require_tree ../templates
//= require_tree ./models
//= require_tree ./collections
//= require_tree ./views
//= require_tree ./routers
//= require_tree .
{% endhighlight %}

With the Rails asset pipeline, we are able to require folders or individual files into our main application file using `//= require` or `//= require_tree` followed by the specified files.

It is recommended not to insert any actual javascript into this file directly. Instead use external files that are required in with the `//=` syntax.

The generator we just ran inserted a few things for us into this file. First we see the underscore and backbone libraries being included up at the top, this handles our library dependencies.

Next we see the `backbone_example.js` file included, this is our primary application file which sets up our Application object. Below that we see multiple directories being included in. Templates, models, collections, views, and routers. These are the components of our backbone application.

## Creating a resource

The next thing we want to do is create a resource. For this example we'll create a resource called `post`. Whenever we create a resource, there are multiple files we will need as boilerplate. Using backbone-on-rails' scaffold generator can take care of this for us.

{% highlight sh %}
$> rails g backbone:scaffold post --javascript
{% endhighlight %}

Which should the following output:

{% highlight sh %}
create  app/assets/javascripts/models/post.js
create  app/assets/javascripts/collections/posts.js
create  app/assets/javascripts/routers/posts_router.js
create  app/assets/javascripts/views/posts
create  app/assets/javascripts/views/posts/posts_index.js
create  app/assets/templates/posts
create  app/assets/templates/posts/index.jst.ejs
{% endhighlight %}

Now we also need to create the resource on our server in our Rails app. We can do this with the following command:

{% highlight sh %}
$> rails g resource post title:string content:text
$> rake db:migrate
{% endhighlight %}

## Getting Rails to serve JSON

Now we should have the necessary files for a post resource on the server side, as well as having run our database migration to create our posts table. We should see several files created and edited with the generator. One thing this does for us is adds the line `resources :posts` to our routes.rb file. This makes the resource's urls [RESTful][7].

We will want to map our controller actions accordingly, as backbone maps it's resources in the same manner automatically. We will want to add the following code to our `posts_controller.rb` file, under the `app/controllers/` directory.

{% highlight ruby %}
class PostsController < ApplicationController
  respond_to :json

  def index
    respond_with Post.all
  end
  
  def show
    respond_with Post.find(params[:id])
  end
  
  def create
    respond_with Post.create(params[:post])
  end
  
  def update
    respond_with Post.update(params[:id], params[:post])
  end
  
  def destroy
    respond_with Post.destroy(params[:id])
  end
end
{% endhighlight %}

Notice we are adding the line `respond_to :json` at the top here. This tells our controller that we want to respond to json requests with json data. Since we have appropriately named our controller actions to match up as a RESTful resource, rails takes care of matching the correct urls to the correct action.

Since our posts controller only interfaces with `json` data, we are going to need another rails controller to handle our home page view. In this case our home page is going to be a view of our posts list and a form to create a new one. Let's create our home controller:

{% highlight sh %}
$> rails g controller home index
{% endhighlight %}

Now we have a 'home' controller with an index action and a corresponding home/index view in our `app/views` folder.

We want to make sure that the root url of our application shows this page, so we will want to add a root command to our `routes.rb` file, and also make sure to delete `public/index.html`.

{% highlight ruby %}
BackboneExample::Application.routes.draw do
  root to: 'home#index'
  resources :posts
end
{% endhighlight %}

Next we need to create the index view for the home controller. This file should exists already at `app/views/home/index.html.erb`. All we need is the target div that we can provide to backbone that we will populate with our posts template.

{% highlight html %}
<div id="posts">
  
</div><!-- #posts -->
{% endhighlight %}

## Configuring backbone

If we start up our rails server and visit the root url, we should see the form we created for new posts, but no posts listed yet. We also see a nice little alert box saying "Hello from Backbone!". This alert is generated by our application's init function, found in `app/assets/javascripts/backbone_example.js`.

First thing we need to do is initialize our router (that we have yet to create) so backbone can handle URL requests. Change the file to appear as follows:

{% highlight javascript %}
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
{% endhighlight %}

Now that we have our resource created and Rails ready to serve json data, we want to tell our Backbone app where to find the `post` resource. Open up `app/assets/javascripts/collections/posts.js` and insert the appropriate url:

{% highlight javascript %}
BackboneExample.Collections.Posts = Backbone.Collection.extend({

  url: '/posts'

});
{% endhighlight %}

Next we will take care of the router file:

{% highlight javascript %}
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
{% endhighlight %}

We are going to host the view of our posts page at `/`. It will host the form for a new post as well as the viewing of all previous posts. The initialize function gets our collection of posts ready for the template to render by creating a new collection object and using `collection.fetch()` to populate it with data from the server.

The index function is what is run when backbone picks up the route we assign it to in our views' `routes` object. In this case, traveling to our root url will trigger the index function in our view file and follow our directions for how to load and display the content.

Next let's look at our view file:

{% highlight javascript %}
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
{% endhighlight %}

Our view file contains the instructions for rending our resource's element to the page. It also handles our form submissions. At the top we are specifying our view's template through JST (JavaScript Templates). Rails 3.1 and up supports JST automatically. The asset pipeline bundles all our `.jst` templates into a global JST object.

In our `initialize` method we are binding the `render` function to our collection's `reset` event. This tells our view to re-render itself each time the collection changes. That way we see our changes in real time, without a page refresh. Thus the magic of Backbone :)

Our `render` function contains the instructions for creating the HTML that we will pass into our `#posts` div. We access `this.el` and add in the HTML that is created from our template. Our template function accepts JSON data, so we pass in `this.collection` as the `posts` object. We can then iterate over this collection in our view and format it to our desire.

We make sure to `return this` at the end of our `render` function so that we can access the rendered view's `el` object and add it to our page through the router.

At the top we have an `events` object that accepts key/value pairs of what events to listen for, and what functions to run upon their firing. In this case the only one we need to listen for is when we submit the form to enter a new post. We listen for the event, and then pass the event object to the `createPost` function. That function then takes the content from the form's fields and calls `collection.create()` with the appropriate properties and some options for what to upon success or error.

Under our `createPost` function is our `removePost` function. We also have a reference to this function within our `events` object that allows it to be triggered by clicking on the link with the class of `remove-post`. The function we call simply finds the `id` of the target link that is clicked, which we populat in our template with the corresponding post id. It then uses this id to make a `destroy` call to our backbone app, which does the same to the server.

Lastly we have a `handleError` function that does as it is named: handles errors. If we are returned an error, and the status code is 422 (Unprocessable Entity) then we launch an alert box for each of errors returned on a given attribute.

## Creating the template

Our client side application is configured, as well as our back end in Rails. The last thing we need is the [EJS](http://embeddedjs.com/) template file. This will be located in `app/assets/templates/posts/index.jst.ejs`. Inside this file will be the HTML that the backbone view will populate with our JSON data. EJS stands for Embedded Javascript, meaning we can place javascript code handling the JSON data directly in our markup. Like so:

{% highlight html %}
<h2>Create a new Post</h2>

<form id="new-post">
  <p>
    <label for="new-post-title">Title</label>
    <input name="new-post-title" id="new-post-title" type="text">
  </p>
  <textarea name="new-post-content" id="new-post-content"></textarea>
  <input type="submit">
</form><!-- #new-post -->

<hr>

<% for (var i = 0, len = posts.models.length; i < len; i++) { %>
  <div class="post">
    <h3><%= posts.models[i].get('title') %></h3>
    <p><%= posts.models[i].get('content') %></p>
    <p><a href="#" class="remove-post" id="<%= posts.models[i].get('id') %>">Remove Post</a></p>
  </div><!-- .post -->
  <hr>
<% } %>
{% endhighlight %}

At the top is our form that collects values to send to the server when creating a new resource. The reason we need to include this form in our Javascript Template as opposed to our ERB template is because we need Backbone to pick up on the click event for the submit button.

Next we initiate a for loop for all the posts in our collection. Inside that loop we create a post div that contains the post title and and content as well as a remove post link to delete the post.

## Conclusion

With the template completed we should have a working Backbone.js + Ruby on Rails application! As you can see, backbone has a lot of potential and is driving the movement of real-time web applications. It's more than worth it to take the time and learn how to implement it into your work.

The source code for this project can be viewed [here](https://github.com/sethetter/sethetter.github.com/tree/master/_posts/setting-up-backbonejs-with-ruby-on-rails/). Thanks for reading!


[1]: https://github.com/meleyal/backbone-on-rails
[2]: http://guides.rubyonrails.org/asset_pipeline.html
[3]: https://github.com/rubygems/rubygems
[4]: http://backbonejs.org/
[5]: http://documentcloud.github.com/underscore/
[6]: http://coffeescript.org/
[7]: http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions
