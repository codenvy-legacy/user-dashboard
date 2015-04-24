/*
 * Copyright (c) 2015 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';

/**
 * This class is handling the controller for the GitHub part
 * @author Stéphane Daviet
 * @author Florent Benoit
 */
class CreateProjectGithubCtrl {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor (codenvyAPI, $http, $q, $window, $location, $browser, $modal, $filter, GitHub, githubPopup, gitHubTokenStore, githubOrganizationNameResolver) {
    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.$location = $location;
    this.$browser = $browser;
    this.$modal = $modal;
    this.$filter = $filter;
    this.GitHub = GitHub;
    this.gitHubTokenStore = gitHubTokenStore;
    this.githubPopup = githubPopup;
    this.githubOrganizationNameResolver = githubOrganizationNameResolver;
    this.codenvyAPI = codenvyAPI;

    var userAPI = codenvyAPI.getUser();

    this.user = userAPI.getUser();
    this.user.$promise.then(() => {
      this.currentUserId = this.user.id;
      this.askLoad();
    });

    this.currentTokenCheck = null;
    this.resolveOrganizationName = this.githubOrganizationNameResolver.resolve;

    this.organizations = [];
    this.gitHubRepositories = [];

    this.state = 'IDLE';


  }

  askLoad() {
    this.checkTokenValidity().then(() => {
      this.loadRepositories();
    });

  }


  authenticateWithGitHub() {

    var redirectUrl = this.$location.protocol() + '://'
      + this.$location.host() + ':'
      + this.$location.port()
      + this.$browser.baseHref()
      + 'gitHubCallback.html';
    return this.githubPopup.open('/api/oauth/authenticate'
      + '?oauth_provider=github'
      + '&scope=' + ['user', 'repo', 'write:public_key'].join(',')
      + '&userId=' + this.currentUserId
      + '&redirect_after_login='
      + redirectUrl,
      {
        width: 1020,
        height: 618
      })
      .then( () => {
        return this.getAndStoreRemoteToken();
      }, (rejectionReason) => {
        return this.$q.reject(rejectionReason);
      });
  }

  getAndStoreRemoteToken()  {
    return this.$http({method: 'GET', url: '/api/github/token/' + this.currentUserId}).then( (result) => {
      if (!result.data) {
        return false;
      }
      this.gitHubTokenStore.setToken(result.data);
      this.$http({method: 'POST', url: '/api/github/ssh/generate'});
      this.askLoad();
      return true;
    });

  }


  checkTokenValidity() {
    if (this.currentTokenCheck) {
      return this.currentTokenCheck;
    }
    this.currentTokenCheck = this.GitHub.user().get( () => {
      this.currentTokenCheck = null;
      return this.$q.defer().resolve(true);
    },  () => {
      this.currentTokenCheck = null;
      return this.$q.defer().reject(false);
    }).$promise;
    return this.currentTokenCheck;
  }

  checkGitHubAuthentication() {
    return this.checkTokenValidity().then( () => {
      return this.$q.defer().resolve('true');
    });
  }


  loadRepositories()  {
    this.state = 'LOADING';

    this.checkGitHubAuthentication().then( () => {
      var user = this.GitHub.user().get();

      this.organizations.push(user);
      this.GitHub.organizations().query().$promise.then((organizations) => {

        this.organizations = this.organizations.concat(organizations);

        var organizationNames = []; //'login'
        this.organizations.forEach((organization) => {
          if (organization.login) {
            organizationNames.push(organization.login);
          }
        });

        this.GitHub.userRepositories().query().$promise.then((repositories) => {
          this.gitHubRepositories = this.$filter('filter')(repositories, (repository) => {
            return organizationNames.indexOf(repository.owner.login) >= 0;
          });
        });
      });

      this.state = 'LOADED';
    }, function () {
      this.state = 'LOAD_ERROR';
    });
  }



  selectRepository(gitHubRepository) {
    this.selectedRepository = gitHubRepository;
  }


  resolveOrganizationType(organization) {
    return organization.name ? 'Your account' : 'Your organization\'s account';
  }

}

export default CreateProjectGithubCtrl;
