---
title: Flickr Powered Slideshows with jQuery
layout: post
categories: [ jquery, javascript, tutorials ]
---

Being able to use Flickr photo sets to manage the images in a slideshow can be very useful. Even more so for clients who don't want to have to mess with code to change out images in the slideshow. I recently had to implement this solution for a client and found it to be a very simple and quick approach. Following these few steps you can build your own slideshow using jQuery and the Flickr API.

### Including Files in our HTML ###

The first thing we need to do is get all the necessary files pulled into our HTML page that will display the slideshow. The first line is a link to the jQuery library's latest version from Google's code bank. The second line is referencing the jQuery plugin we will be using to achieve the slideshow effect. Finally we have a local CSS file that will hold our style rules.

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js" charset="utf-8"></script>
  <script src="jquery.cycle.js" type="text/javascript" charset="utf-8"></script>
  <link rel="stylesheet" href="style.css" type="text/css" media="screen" charset="utf-8">

### Writing Markup ###

Next we need to write the HTML elements that will actually hold our slideshow. All we really need is a 'div' element to load the photos into from Flickr, which we will also apply the slideshow effect to after they have been loaded. I've included a container div and a heading for styling purposes.

        <div id="container">
          <h1>Flickr Slideshow</h1>
          <div id="slideshow">
            <!-- photos load here -->
          </div>
        </div>

And then we want to include our javascript at the bottom of the page, like so

  <script src="scripts.js" language="javascript"></script>

Next we'll include some basic styling for the elements we will have on our page. I've included a reset and a base typographic setup as well. This goes into our style.css file.
  
        /* reset5 */
        html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfmg,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,audio,canvas,details,figcaption,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,summary,time,video{border:0;outline:0;font-size:100%;vertical-align:baseline;background:transparent;margin:0;padding:0;}body{line-height:1;}article,aside,dialog,figure,footer,header,hgroup,nav,section,blockquote{display:block;}nav ul{list-style:none;}ol{list-style:decimal;}ul{list-style:disc;}ul ul{list-style:circle;}blockquote,q{quotes:none;}blockquote:before,blockquote:after,q:before,q:after{content:none;}ins{text-decoration:underline;}del{text-decoration:line-through;}mark{background:none;}abbr[title],dfn[title]{border-bottom:1px dotted #000;cursor:help;}table{border-collapse:collapse;border-spacing:0;}hr{display:block;height:1px;border:0;border-top:1px solid #ccc;margin:1em 0;padding:0;}input[type=submit],input[type=button],button{margin:0!important;padding:0!important;}input,select,a img{vertical-align:middle;}
        /* typography */
        body{font:13px/1.5 sans-serif}a:focus{outline:1px dotted}hr{border:0 #ccc solid;border-top-width:1px;clear:both;height:0}h1{font-size:25px}h2{font-size:23px}h3{font-size:21px}h4{font-size:19px}h5{font-size:17px}h6{font-size:15px}ol{list-style:decimal}ul{list-style:disc}li{margin-left:30px}p,dl,hr,h1,h2,h3,h4,h5,h6,ol,ul,pre,table,address,fieldset{margin-bottom:20px}

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

### Adding our Javascript ###

First we'll start by opening a document.ready callback. This makes sure that jQuery and the document which we will be operating on are both ready for us before we start issuing commands to them.

        $(function() {
          // code goes in here
        });
  
Next we need a couple pieces of information available to our script. First, Flickr requires that any AJAX requests be signed with an API key. You can [apply to get one here][1]. I've replaced my key with 'insertyourkeyhere', so be sure to replace it with your key.

        var apiKey = 'insertyourkeyhere'
          , photoSet = '346406' // http://www.flickr.com/photos/michael_hughes/sets/346406/
          , requestUrl = 'http://api.flickr.com/services/rest/?format=json&method=flickr.photosets.getPhotos&api_key=' + apiKey + '&photoset_id=' + photoSet + '&jsoncallback=?';

The other variables we are declaring here is the id of the photoset from Flickr that we want to feed photos to our slideshow, and our fully constructed request URL that we will get our photos from. Here I am using a randomly selected photo set that seemed to work well with what we were doing here. The request URL includes some parameters to tell Flickr we want our data in JSON format, and we pass our apiKey and the photoset ID.

Next we will make our AJAX call using jQuery, and use that data to build a slideshow with our slideshow plugin, [jQuery Cycle][2].

        $.getJSON(requestUrl, function(data) {

          $.each(data.photoset.photo, function(i, p) {

            var url = 'http://farm' + p.farm + '.static.flickr.com/' + p.server + '/' + p.id + '_' + p.secret + '_m.jpg';
            var photo = '<img src="' + url + '">';

            $(photo).appendTo('#slideshow');

          });

          $('#slideshow').cycle({ fx: 'fade' });

        });

To our AJAX request, we are passing the request URL, and a callback function to be run with the data that is returned. We pass in the data to our callback function, then iterate over each item in the dataset (since we are requesting an array of photos) using the jQuery.each method.

We then have to manually construct our Flickr image URL's with pieces of the data returned, including the photo farm, the server, the photo ID, and the photo secret. At the end we add '_m.jpg' to get the medium size of the photo. This can be changed for different size versions.

Next we add our photo to our slideshow div, and then activate the slideshow. And that's it! You should have a running jQuery and Flickr powered slideshow. This is a great trick to allow clients the ability to control the photos in a slideshow on their website, without having to touch any code.

Hope this was of some help! Questions or comments are welcomed below. Thanks!

[1]: http://www.flickr.com/services/api/misc.api_keys.html
[2]: http://jquery.malsup.com/cycle/
