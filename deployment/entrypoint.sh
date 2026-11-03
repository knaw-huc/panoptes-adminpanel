#!/bin/sh

for file in /usr/share/nginx/html/assets/config*.js; do
  if [ ! -f $file.tmpl.js ]; then
    cp $file $file.tmpl.js
  fi

  envsubst '$VITE_PROTOCOL,$VITE_BASE_DOMAIN,$VITE_PORT' <$file.tmpl.js >$file
done

nginx -g 'daemon off;'