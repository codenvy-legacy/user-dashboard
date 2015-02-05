# User-dashboards

## Table of contents

 - [Quick start](#quick-start)
 - [How to run User-dashboard application](#how-to-run-user-dashboard-application)
    - [Standalone mode](#standalone-mode)
    - [Inside Codenvy IDE](#inside-codenvy-ide)

- [Developers](#developers)

## Quick start

User Dashboard application is based on [Angular JS](http://angularjs.org/)

The build tool is based on [Grunt](http://gruntjs.com/)

The repository have to be cloned : URL is https://github.com/codenvy/user-dashboard



## How to run User Dashboard Application:


### Standalone mode

[NodeJS](http://nodejs.org/) is a prerequisite for building the application.
It can be installed from [NodeJS downloads](http://nodejs.org/download/)

[Maven](http://maven.apache.org) tool is required only to produce the war file.

1) Run the server with Grunt
```grunt serve```

2) Open in browser [http://localhost:9000/](http://localhost:9000)


### Inside Codenvy IDE

1) Import the repository : Select Git menu and then "Clone Repository..."

Enter https://github.com/codenvy/user-dashboard and a project's name if not automatically defined.

2) Once the project has been cloned, pick-up "AngularJS project" in the list of project type when the project is loaded.

3) Start the application by clicking on the run button

4) Open the browser on the URL that has been displayed in codenvy IDE.


## Developers

Live reload feature is enabled. So each time a file is modified/updated the browser is notified with the change and refresh the page automatically. No action is required.

## How to build on Dockerimage

Step-by-step guide
 
1) Install docker. http://docs.docker.com/installation/ubuntulinux/
sudo apt-get update
 
sudo apt-get install docker.io

2)To use docker without sudo:
sudo groupadd docker
 
sudo gpasswd -a ${USER} docker

3) Log out and log back in again.

4) Ensure path contains $HOME variable in settings.xml

<localRepository>${env.HOME}/.m2/repository</localRepository>
Pull docker image.
docker pull vkuznyetsov/odyssey
Run docker-build.sh from project folder.
./docker-build.sh