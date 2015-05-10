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

class AccountCtrl {

  /**
   * Controller for a account details
   * @ngInject for Dependency injection
   * @author Oleksii Orel
   */
  constructor($scope, codenvyAPI, codenvyNotificationService) {
    this.codenvyAPI = codenvyAPI;
    this.codenvyNotificationService = codenvyNotificationService;

    this.oldAttributes = {};
    this.profile = this.codenvyAPI.getProfile().getProfile();

    $scope.profile = this.profile;

    //copy the profile attribute if it exist
    if($scope.profile.attributes) {
      this.oldAttributes = angular.copy($scope.profile.attributes);
    }

    //copy the profile attribute when we receive it in the first time
    $scope.$watch('profile.attributes', (newVal, oldVal) => {
      if(!newVal) {
        return;
      }
      if(!oldVal) {
        this.oldAttributes = angular.copy(newVal);
      }
    }, true);

  }

  isAttributesChanged() {
    return !angular.equals(this.profile.attributes, this.oldAttributes);
  }

  /**
   * Update current profile
   */
  //TODO: Add onclick event to cdvy-tab elements
  updateProfile() {
    this.codenvyAPI.getProfile().fetchProfile();
  }

  /**
   * set profile attributes
   */
  setProfileAttributes(isInputFormValid) {
    if(!isInputFormValid) {
       return;
    }

    if(this.isAttributesChanged()){
      let promise = this.codenvyAPI.getProfile().setAttributes(this.profile.attributes);

      promise.then(() => {
        this.codenvyNotificationService.showInfo('Profile successfully updated.');
        this.oldAttributes = angular.copy(this.profile.attributes);
      }, (error) => {
        if (error.status === 304) {
          if(this.profile.attributes) {
            this.oldAttributes = angular.copy(this.profile.attributes);
          }
        } else {
          if(this.oldAttributes) {
            this.profile.attributes = angular.copy(this.oldAttributes);
          }
          this.codenvyNotificationService.showError(error.data.message !== null ? error.data.message : 'Update information failed.');
          console.log('error', error);
        }
      });

    }
  }

}

export default AccountCtrl;
