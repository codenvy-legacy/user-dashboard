# User-dashboards

## Table of contents

 - [Structure project](#structure-project)
 - [How to run User-dashboards demo application](#how-to-run-user-dashboards-demo-application)
 - [Quick start](#quick-start)

## Structure project:

Project contains next modules:

1) **user-dashboard-war**

It's a module that packs web application to WAR archive.

2) **user-dashboard-tomcat-demo**

It's a module that deploys user-dashboard.war for tomcat server

## How to run User-dashboards demo application:

1) Build all user-dashboards modules from the root of the project:
```mvn clean install```

2) Go to **user-dashboard-tomcat-demo/target/tomcat-dashboard/bin** and start Tomcat

3) Open in browser **http://localhost:8080/dashboard**
 
## Quick start

Some of the options for hosting

 - [WAMP server for windows](http://www.wampserver.com/en/).
 - node, apache, tomcat for linux
 - MAMP or other server solutions for Mac
 
Note: if app is not hosted it will not work in chrome 
Just open index.html in user-dashboard-war module and you can see the app running
