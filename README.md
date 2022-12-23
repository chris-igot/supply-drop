# About

This app is a MERN implementation of a classifieds column
Note: This is a detached fork of a submission from a hackathon ([https://github.com/CD-hackathon/supply-drop](https://github.com/CD-hackathon/supply-drop)) where I worked on the chat, autocomplete, and submission forms. This fork now fully uses MaterialUI for the frontend, fixes security issues, has improved chat feature, and incorporates an admin account.  
Deployed here: [https://supply-drop.chris-igot.link/](https://supply-drop.chris-igot.link/)  
Docker: [https://hub.docker.com/repository/docker/chrisigot/supply-drop](https://hub.docker.com/repository/docker/chrisigot/supply-drop)

The following environmental variables need to be set:  
GOOGLEAPI_KEY  
SECRET_KEY_SUPPLYDROP  
PORT  
PUBLIC_URL_SUPPLYDROP  
MONGODB_PATH  
MONGODB_USER  
MONGODB_PW  
ADMIN_DEFAULTPW  
ADMIN_DEFAULTEMAIL

Example docker-compose.yml:

```
version: '3.8'
services:
  server:
    image: supply-drop
    ports:
      - 8000:8000
    restart: always
    environment:
      GOOGLEAPI_KEY: {{your GOOGLEAPI_KEY value}}
      SECRET_KEY_SUPPLYDROP: {{your SECRET_KEY_SUPPLYDROP value}}
      PORT: {{your PORT value}}
      PUBLIC_URL_SUPPLYDROP: {{your PUBLIC_URL_SUPPLYDROP value}}
      MONGODB_PATH: {{your MONGODB_PATH value}}
      MONGODB_USER: {{your MONGODB_USER value}}
      MONGODB_PW: {{your MONGODB_PW value}}
      ADMIN_DEFAULTPW: {{your ADMIN_DEFAULTPW value}}
      ADMIN_DEFAULTEMAIL: {{your ADMIN_DEFAULTEMAIL value}}
```
