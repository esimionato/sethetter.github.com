---
title: Flickr Powered Slideshows with jQuery
layout: post
categories: [ jquery, javascript, tutorials ]
---

Being able to use Flickr photo sets to manage the images in a slideshow can be very useful. Even more so for clients who don't want to have to mess with code to change out images in the slideshow. I recently had to implement this solution for a client and found it to be a very simple and quick approach. Following these few steps you can build your own slideshow using jQuery and the Flickr API.

### Including Files in our HTML ###

The first thing we need to do is get all the necessary files pulled into our HTML page that will display the slideshow. The first line is a link to the jQuery library's latest version from Google's code bank. The second line is referencing the jQuery plugin we will be using to achieve the slideshow effect. Finally we have a local CSS file that will hold our style rules.

{% highlight html %}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" language="javascript"></script>
<script src="js/jquery.cycle.js" language="javascript"></script>
<link rel="stylesheet" href="style.css" type="text/css" media="screen">
{% endhighlight %}

### Writing Markup ###

Next we need to write the HTML elements that will actually hold our slideshow. All we really need is a 'div' element to load the photos into from Flickr, which we will also apply the slideshow effect to after they have been loaded. I've included a container div and a heading for styling purposes.

{% highlight html %}
<div id="container">
  <h1>Flickr Slideshow</h1>
  <div id="slideshow">
    <!-- photos load here -->
  </div>
</div>
{% endhighlight %}
        

And then we want to include our javascript at the bottom of the page, like so

{% highlight html %}
<script src="scripts.js" language="javascript"></script>
{% endhighlight %}

Next we'll include some basic styling for the elements we will have on our page. I've also used a reset and a base typographic setup as well, but I won't include those here (I do recommend using one though). This goes into our style.css file.
  
{% highlight css %}
/* my styles */
body { background:#eee; }
#container {
  width:500px;
  margin:0 auto;
  background:#fff;
  padding:30px;
  text-align:center;
}
#slideshow {
  background:#fafafa;
  border:1px solid #ccc;
  width:300px;
  height:220px;
  margin:0 auto;
}
#slideshow img { padding:30px; }
{% endhighlight %}

### Adding our Javascript ###

First we'll start by opening a document.ready callback. This makes sure that jQuery and the document which we will be operating on are both ready for us before we start issuing commands to them.

{% highlight javascript %}
$(function() {
  // code goes in here
});
{% endhighlight %}
  
Next we need a couple pieces of information available to our script. First, Flickr requires that any AJAX requests be signed with an API key. You can [apply to get one here][1]. I've replaced my key with 'insertyourkeyhere', so be sure to replace it with your key.

{% highlight javascript %}
var apiKey = 'insertyourkeyhere'
  , photoSet = '346406' // http://www.flickr.com/photos/michael_hughes/sets/346406/
  , requestUrl = 'http://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&api_key=' 
  + apiKey + '&photoset_id=' + photoSet + '&jsoncallback=?';
{% endhighlight %}

The other variables we are declaring here is the id of the photoset from Flickr that we want to feed photos to our slideshow, and our fully constructed request URL that we will get our photos from. Here I am using a randomly selected photo set that seemed to work well with what we were doing here. The request URL includes some parameters to tell Flickr we want our data in JSON format, and we pass our apiKey and the photoset ID.

Next we will make our AJAX call using jQuery, and use that data to build a slideshow with our slideshow plugin, [jQuery Cycle][2].

{% highlight javascript %}
$.getJSON(requestUrl, function(data) {

  $.each(data.photoset.photo, function(i, p) {

    var url = 'http://farm' + p.farm + '.static.flickr.com/' + p.server + '/' + p.id + '_' + p.secret + '_m.jpg';
    var photo = '<img src="' + url + '">';

    $(photo).appendTo('#slideshow');

  });

  $('#slideshow').cycle({ fx: 'fade' });

});
{% endhighlight %}

To our AJAX request, we are passing the request URL, and a callback function to be run with the data that is returned. We pass in the data to our callback function, then iterate over each item in the dataset (since we are requesting an array of photos) using the jQuery.each method.

We then have to manually construct our Flickr image URL's with pieces of the data returned, including the photo farm, the server, the photo ID, and the photo secret. At the end we add '_m.jpg' to get the medium size of the photo. This can be changed for different size versions.

Next we add our photo to our slideshow div, and then activate the slideshow. And that's it! You should have a running jQuery and Flickr powered slideshow. This is a great trick to allow clients the ability to control the photos in a slideshow on their website, without having to touch any code.

Hope this was of some help! Questions or comments are welcomed below. Thanks!

[1]: http://www.flickr.com/services/api/misc.api_keys.html
[2]: http://jquery.malsup.com/cycle/
