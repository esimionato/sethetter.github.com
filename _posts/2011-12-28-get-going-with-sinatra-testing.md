---
title: Get Going With Sinatra: Testing
layout: post
categories: [ ruby, sinatra ]
---

When I first began my journey down the road of server-side development I had taken my aim at Rails to be the primary focus of my education. However, as I went on I realized more and more that I didn't like how much was happening behind the scenes. I felt like I was missing out on valuable bits of knowledge.

While Rails is still a great choice for beginners with server-side development, I decided to challenge myself a bit further and to instead try and use [Sinatra][1], a more lightweight and barebones framework for server-side development in Ruby.

Aside from server-side development, another discipline I wanted to start training myself in is [Test Driven Development][2]. TDD involves setting up your environment to run automated tests on the functionality of your application from the command line. It provides informative readouts to help identify what isn't working and why.

Setting up a Sinatra application for TDD is fairly straightforward. We will begin by setting up our directory structure. Enter the following from the command line:

{% highlight sh %}
$> mkdir sinatra_app
$> cd sinatra_app
$> mkdir spec
$> mkdir lib
$> touch spec/spec.opts spec/spec_helper.rb spec/app_spec.rb lib/app.rb Gemfile
{% endhighlight %}

Next we need to make sure we have our dependencies installed. We will be installing them using bundler, a tool for installing ruby gem packages. If you don't have rubygems installed, go do that [first][3]. If you have it installed already, go ahead and enter the following into your Gemfile:

{% highlight ruby %}
source :rubygems

gem "sinatra"
gem "rspec"
{% endhighlight %}

Then enter the command line and run {% highlight sh %}bundle{% endhighlight %} Now we will start by setting up our app.rb file as a basic Sinatra application. Enter the following into lib/app.rb:

{% highlight ruby %}
require 'sinatra'

get '/' do
  'Hello world!'
end
{% endhiglight %}

This is the most basic and stripped down Sinatra application we could possibly create. Sinatra is beautiful in it's simplicity and yet strong in it's utility and flexibity. I find developing with it to be very enjoyable.

Now that we have our barebones application we want to set up our testing environment and then write our first test. First we will set up our spec_helper.rb file. Open it up and enter the following:

{% highlight ruby %}
require 'rubygems'
require 'sinatra'
require 'rack/test'
require 'test/unit'

require File.join(File.dirname(__FILE__), '../lib', 'app')

set :environment, :test
set :run, false
set :raise_errors, true
set :logging, false
{% endhighlight %}

Then enter the following into the spec.opts file:

{% highlight sh %}
--color
--format progress
--loadby mtime
--reverse
{% endhighlight %}

Now we are ready to set up our spec file. This is the file that contains all of the tests we will write for our application. We have a couple things to enter for basic setup of the tests, then we enter the tests themselves:

{% highlight ruby %}
require File.dirname(__FILE__) + '/spec_helper'

describe "Application" do
  include Rack::Test::Methods

  def app
    @app ||= Sinatra::Application
  end
  
  it "should respond to root request" do
  	get '/'
	  last_response.should be_ok
  end
end
{% endhighlight %}

At this point we are ready to run our test file and receive our first response, enter the following into the command line:

{% highlight sh %}
$> rpsec spec/app_spec.rb
{% endhighlight %}

Now typically we will write the test first, let it fail, and then fill in the relevant functionality in our actual application to make the test successful.

Right now we already have our application configured to handle a root request, so we will get a success response. Let's write a test that will fail now. Add this underneath the first test in our app_spec.rb file:

{% highlight ruby %}
  it "should return name from params" do
    get '/greet/seth'
    last_response.body.should == 'Hello, Seth!'
  end
{% endhighlight %}

We can run our rspec command from the terminal again and see that the test fails. It will provide you with some information such as which test failed, what line it's located on in our test file, what the expected result was and what the actual result was, and a bit more as well.

Let's fill in our application functionality to make our test pass now. Go back to your app.rb file and add the following:

{% highlight ruby %}
get '/greet/:name' do
  "Hello, #{params[:name].capitalize}!"
end
{% endhighlight %}

Now if we run our rspec command from the terminal again we should see our test pass with flying colors.

From this point you should be ready to get going with your application development. You can write more tests describing what the functionality should be and then filling in the functionality as you go. It's a great way to keep your development focused and agile.

Make sure to read up all you can about [Sinatra][1], the [Rack Test Methods][4], and [RSpec][5]. I hope this was of some help to you! Feel free to leave comments.

[1]: http://sinatrarb.com
[2]: http://en.wikipedia.org/wiki/Test-driven_development
[3]: http://rubygems.org/
[4]: http://rubydoc.info/github/brynary/rack-test/master/Rack/Test/Methods
[5]: https://www.relishapp.com/rspec