[![Contribute](https://rawgit.com/slemeur/4a900bb68300a2643679/raw/1ad2c6d784c92fc21886c765bc6315a1f2ee690c/codenvy-contribute.svg)](https://codenvy.com/f?id=qa3uux9ezoa2imb7)



Codenvy User Dashboard V2
==========================

#Requirements

This new version is using gulp as build tool so gulp needs to be installed
```sh
$ npm install --global gulp
```

#Quick start

## Running
In order to run the project, the serve command is used
```sh
$ gulp serve
```
It will launch the server and then the project can be tested on http://localhost:5000

By default it will use https://www.codenvy.com as remote server.

The argument --server <url> may allow to use another server. (url is for example http://my-server.com)


```sh
$ gulp serve:dist
```
This command will provide the 'minified/optimised' version of the application

This is a good check for testing if the final rendering is OK


## Tests
The application contains both unit tests and e2e tests (end-to-end)

Unit tests
```sh
$ gulp test
```

e2e tests
```sh
$ gulp protractor
```

Both tests
```sh
$ gulp alltests
```

Note: before pushing contribution, these tests should always work

#Architecture design

## Ecmascript6/es6

This new version is using the new feature of Javascript language with a transpiler named babel (previously 6to5)

So application is written with the new language but the resulting build is Javascript v5 compliant

Among new features, Class, arrow functions, etc

## Styling/css
[Stylus](https://github.com/LearnBoost/stylus) is used for produced the final CSS.

Variables, simple syntax, etc is then provided


## Code convention

### indent
There is a .editorconfig file that is indicating the current identation which is
```
indent_style = space
indent_size = 2
```

### syntax
The syntax is checked by jshint (through .jshintrc file)

Also when lanching gulp serve command, there is a report on each file that may have invalid data

For example use single quote 'hello', no "double quote", use === and !=== and not == or !=


### name of the files
Controllers are in files named <name>.controller.js

Directives: <name>.directive.js

Templates: <name>.html

Factories: <name>.factory.js

Unit test: <name>.spec.js (for my-example.factory.js will be named my-example.spec.js)

#### About e2e tests
If a 'project' page needs to be tested:

project.po.js will contain the Page Object pattern (all methods allowing to get HTML elements on the page)

project.spec.js will have the e2e test

project.mock.js will provide some mock for the test

## source tree
Each 'page' needs to have its own folder which include:

controller, directive, template, style for the page

for a 'list-projects' page, the folder tree will have
```
list-projects
  - list-projects.controller.js
  - list-projects.html
  - list-projects.styl
```

## AngularJS recommandation
As classes are available, the controller will be designed as es6 classes.

All injection required will be done through the constructor by adding also the @ngInject annotation.

Also properties are bound with this. scope (so avoid to use $scope in injection as this will be more aligned with AngularJS 2.0 where scope will disappear)

example
```js
/**
 * Defines a controller
 * @author Florent Benoit
 */
class MyCtrl {

  /**
   * Constructor that is using resource injection
   * @ngInject for Dependency injection
   */
  constructor ($http) {
    this.$http = $http; // to use $http in other methods, use this.$http
    this.selectedValue = 'hello';
  }

  exampleMethod() {
    return this.selectedValue;
  }

}

export default CodenvyToggleCtrl;

```

So, no need to add specific arrays for injection.


By using the this syntax, the controllerAs needs to be used when adding the router view
```js
    .when('/myURL', {
      templateUrl: 'mytemplate.html',
      controller: 'MyClassCtrl',
      controllerAs: 'myCtrl'
    })
```

And then, when there is a need to interact with code of a controller, the controllerAs value is used.

```html
 <div>Selected book is {{myCtrl.selectedBook}}</div>
```
Note that as if scope was using, the values are always prefixed

## Directives

The whole idea is to be able to reuse some 'widgets' when designing HTML pages

So instead that each page make the design/css for all buttons, inputs, it should be defined in some widget components.

The components are located in the src/components/widget folder

It includes toggle buttons, selecter, etc.

A demo page is also provided to browse them: localhost:5000/#/demo-components


## API of Codenvy

Each call to the Codenvy API shouldn't be made directly from the controller of the page.
For that, it has to use Codenvy API fatories which are handling the job (with promises operations)

By injecting 'codenvyAPI' inside a controller, all operations can be called.

for example codenvyAPI.getWorkspace().getWorkspaces() for getting the array of the current workspaces of the user

Mocks are also provided for the Codenvy API, allowing to emulate a real backend for unit tests or e2e tests



