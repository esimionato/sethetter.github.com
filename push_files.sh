#!/bin/bash

if [ -n "$1" ]
then 
	commit_message="$1"
else
	commit_message="Updated site `date`."
fi

jekyll
git add .
git add -u
git commit -m "$commit_message"
git push heroku master