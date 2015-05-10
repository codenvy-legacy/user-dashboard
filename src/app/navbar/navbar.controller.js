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

class NavBarCtrl {

  /**
   * Default constructor
   * @ngInject for Dependency injection
   */
  constructor($scope, $mdSidenav, userDashboardConfig, codenvyAPI) {
    this.mdSidenav = $mdSidenav;
    this.codenvyAPI = codenvyAPI;
    this.links =[{href:'#/projects', name:'List Projects'}
    ];

    this.displayLoginItem = userDashboardConfig.developmentMode;
    this.profile = codenvyAPI.getProfile().getProfile();

    $scope.profile = this.profile;

    $scope.$watch('profile.attributes', (newVal) => {
      if(!newVal) {
        return;
      }
      this.updateData();
    }, true);

    this.fullName = '';
    this.email = '';

    // on-prem admin section
    this.admin = false;
    this.onpremAdminExpanded = true;
  }

  /**
   * Update current full name and email
   */
  updateData() {
    if(!this.profile.attributes) {
      return;
    }
    this.fullName = this.codenvyAPI.getProfile().getFullName();
    this.email = this.profile.attributes.email;
    this.admin = true // hardcoded until we know how to check it
  }

  /**
   * Toggle the left menu
   */
  toggleLeftMenu() {
    this.mdSidenav('left').toggle();
  }

  userIsAdmin() {
    return this.admin;
  }

  flipOnpremAdminExpanded() {
    this.onpremAdminExpanded = !this.onpremAdminExpanded;
  }
}

export default NavBarCtrl;
