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
 * Defines a directive for displaying subscription proposals.
 * @author Ann Shumilova
 */
class SubscriptionProposal {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor () {
    this.restrict='E';
    this.templateUrl = 'app/navbar/subscriptions/subscription-proposal.html';
    this.transclude= true;

    // scope values
    this.scope = {
      title:'@cdvyTitle',
      icon: '@cdvyIcon',
      description: '@cdvyDescription',
      buttonTitle: '@cdvyButtonTitle',
      proposalClick: '&'
    };
  }

}

export default SubscriptionProposal;

