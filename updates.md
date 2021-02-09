## **docker_compose.yml** :

Removed the below services from `docker_compose.yml` file as I didn't required those services
- removed the german stt(stt_de) 
- removed the dictate

original: https://github.com/codeforequity-at/botium-speech-processing/blob/master/docker-compose.yml

updated: https://github.com/JiteshGaikwad/botium-speech-processing/blob/master/docker-compose.yml

## **nginx.conf**
Removed the below endpoints for stt_de and dictate services

original:https://github.com/codeforequity-at/botium-speech-processing/blob/master/nginx.conf

updated: https://github.com/JiteshGaikwad/botium-speech-processing/blob/master/nginx.conf

## **stt**

removed the german langauge docker files

original: https://github.com/codeforequity-at/botium-speech-processing/tree/master/stt

updated: https://github.com/JiteshGaikwad/botium-speech-processing/tree/master/stt

## **tts**

I have forked the original MaryTTS installer and updated the components.json file which contains the voices that needs to be downloaded.

original: https://github.com/marytts/marytts-installer/blob/master/components.json

updated: https://github.com/JiteshGaikwad/marytts-installer/blob/master/components.json

original: https://github.com/codeforequity-at/botium-speech-processing/blob/master/tts/Dockerfile.marytts

updated: https://github.com/JiteshGaikwad/botium-speech-processing/blob/master/tts/Dockerfile.marytts

## **frontend**:
 - added support for CORS by adding `cors` middleware in the `server.js` file 
 - I have updated the `routes.js` file to support the request and response from the VUI
 
original:
- https://github.com/codeforequity-at/botium-speech-processing/blob/master/frontend/src/server.js

- https://github.com/codeforequity-at/botium-speech-processing/blob/master/frontend/src/routes.js

updated:
- https://github.com/JiteshGaikwad/botium-speech-processing/blob/master/frontend/src/server.js
- https://github.com/JiteshGaikwad/botium-speech-processing/blob/master/frontend/src/routes.js
