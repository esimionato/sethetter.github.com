require 'bundler'
Bundler.require


# Attribution goes to https://github.com/rack/rack-contrib/blob/master/lib/rack/contrib/try_static.rb
# License can be found here https://github.com/rack/rack-contrib/blob/master/COPYING

module Rack
  class TryStatic

    def initialize(app, options)
      @app = app
      @try = ['', *options.delete(:try)]
      @static = ::Rack::Static.new(
        lambda { [404, {}, []] },
        options)
    end

    def call(env)
      orig_path = env['PATH_INFO']
      found = nil
      @try.each do |path|
        resp = @static.call(env.merge!({'PATH_INFO' => orig_path + path}))
        break if 404 != resp[0] && found = resp
      end
      found or @app.call(env.merge!('PATH_INFO' => orig_path))
    end
  end
end


# Set up static serving
use Rack::TryStatic, :root => "_site", :urls => %w[/], :try => ['.html', 'index.html', '/index.html']


# Serve the 404 error page
error_file = '_site/404.html'
run lambda { |env|
    [404, { 
            'Last-Modified'  => File.mtime(error_file).httpdate, 
            'Content-Type'   => 'text/html',
            'Content-Length' => File.size(error_file)
          },
      File.read(error_file) ]
  }