About
=====

This is a template directory for a [Jekyll][1] site. I created the structure and related scripts when developing my home page, [bnjmn.org][2]. There are remainders from this lying around in the files, typically titles and configurations, however it should be easy for you to make the necesarry modifications. You'll probably want to entirely change the HTML and CSS anyway.

[1]: http://jekyllrb.com/
[2]: http://bnjmn.org/


Publishing a blog post to jekyll
================================

1. Create file in `_drafts/` and write the blog post.
2. Move the post to `_posts/`. The filename should have the format `year-month-day-title.md`.
3. Open a terminal at the root folder.
4. Type the following commands.

		./push_files.sh 'commit_message'
		
5. Refresh your site.


Gitignore file
==============

Depending on whether or not your hosting solution generates the site on the server, you may or may not wish to add `_site/*` to the `.gitignore` file. 
