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

class SubscriptionCtrl {
  /**
   * Default constructor that is using resource injection
   * @ngInject for Dependency injection
   */
  constructor (codenvyAPI, $location, $window) {
      this.codenvyAPI = codenvyAPI;
      this.$location = $location;
      this.$window = $window;
      this.proposals = [];
      this.subscriptions = [];

      if (this.codenvyAPI.getAccount().getAccounts().length > 0) {
        this.fetchSubscriptions();
      } else {
        this.codenvyAPI.getAccount().fetchAccounts().then(() => {
          this.fetchSubscriptions;
        });
      }
  }

  fetchSubscriptions() {
    let currentAccount = this.codenvyAPI.getAccount().getCurrentAccount();
    this.codenvyAPI.getAccount().fetchSubscriptions(currentAccount.id).then(() => {
      this.processSubscriptions(this.codenvyAPI.getAccount().getSubscriptions(currentAccount.id));
    }, (error) => {
      if (error.status === 304) {
        this.processSubscriptions(this.codenvyAPI.getAccount().getSubscriptions(currentAccount.id));
      }
    });
  }

  /**
   * Checks the list of subscriptions, if subscription exists - prepares it's display info,
   * if not adds new proposals. There two types of subscriptions : on-premises and saas(pay-as-you-go).
  */
  processSubscriptions(subscriptions) {
    let services = _.pluck(subscriptions, 'serviceId');
    let hasOnPremises = services.indexOf(this.codenvyAPI.getAccount().getOnPremServiceId()) >= 0;
    let saasServiceId = this.codenvyAPI.getAccount().getSaasServiceId();
    let onPremServiceId = this.codenvyAPI.getAccount().getOnPremServiceId();

    let saasSubscription = _.find(subscriptions, function (subscription) {
      return subscription.serviceId === saasServiceId;
    });

    let onPremSubscription = _.find(subscriptions, function (subscription) {
      return subscription.serviceId === onPremServiceId;
    });

    if (saasSubscription) {
      if (saasSubscription.properties && saasSubscription.properties['Package'] && saasSubscription.properties['Package'] === 'Community'){
        this.proposals.push(this.getPayAsYouGoProposal());
      } else if (saasSubscription.planId === this.codenvyAPI.getAccount().getPayAsYouGoPlanId()) {
        this.fillPayAsYouGoDetails(saasSubscription);
        this.subscriptions.push(saasSubscription);
      } else if (saasSubscription.planId === this.codenvyAPI.getAccount().getPrepaidPlanId()) {
        this.fillPrePaidDetails(saasSubscription);
        this.subscriptions.push(saasSubscription);
      }
    } else {
      this.proposals.push(this.getPayAsYouGoProposal());
    }

    if (hasOnPremises) {
      this.fillOnPremDetails(onPremSubscription);
      this.subscriptions.push(onPremSubscription);
    } else {
      this.proposals.push(this.getOnPremProposal());
    }
  }

  fillPayAsYouGoDetails(saasSubscription) {
    var ctrl = this;
    saasSubscription.title = 'Pay-As-You-Go Account';
    saasSubscription.description = '$0.15 / GB Hour';
    saasSubscription.icon = 'assets/images/icon-saas.png';
    saasSubscription.buttonTitle = 'Remove Credit Card';
    saasSubscription.cancel = function() {
      ctrl.cancelPayAsYouGo(ctrl.$location);
    };
  }

  fillPrePaidDetails(saasSubscription) {
    var ctrl = this;
    let prepaid = saasSubscription.properties.PrepaidGbH;
    saasSubscription.title = 'SaaS Pre-Paid Subscription';
    saasSubscription.description = prepaid + ' GB Hrs / Month';
    saasSubscription.icon = 'assets/images/icon-saas.png';
    saasSubscription.buttonTitle = 'Cancel';
    saasSubscription.cancel = function() {
      ctrl.cancelPrePaid(ctrl.$window);
    };
  }

  fillOnPremDetails(onPremSubscription) {
    var ctrl = this;
    onPremSubscription.title = 'On-Prem Account';
    onPremSubscription.description = '$300 / user / year';
    onPremSubscription.icon = 'assets/images/icon-on-prem.png';
    onPremSubscription.buttonTitle = 'Cancel';
    onPremSubscription.cancel = function() {
      ctrl.cancelOnPrem(ctrl.$window);
    };
  }

  getPayAsYouGoProposal() {
    var ctrl = this;
    return {
      title : 'SAAS Pay-As-You-Go',
      description : 'Our crazy fast cloud IDE and magical one-click automation hosted in our cloud.',
      buttonTitle : 'Add Credit Card',
      icon : 'assets/images/icon-saas.png',
      content : [
        'Machines up to 200GB RAM',
        'Always-on machines',
        '10 GB hours free per month',
        'Billing starts after free monthly hours',
        'Email support'
      ],
      buy: function() {
        ctrl.onPayAsYouGoChoosen(ctrl.$location);
      }
    };
  }

  onPayAsYouGoChoosen($location) {
    $location.path('billing');
  }

  onPremChoosen($window) {
    $window.open('https://codenvy.com/products/onprem', '_blank');
  }

  cancelPayAsYouGo(location) {
    location.path('billing');
  }

  cancelPrePaid($window) {
    $window.location.href =  'mailto:sales@codenvy.com?subject=' + escape('Cancellation of Pre-Paid Subscription');
  }

  cancelOnPrem($window) {
    $window.location.href =  'mailto:sales@codenvy.com?subject=' + escape('Cancellation of On-Prem Subscription');
  }


  getOnPremProposal() {
    var ctrl = this;
    return {
      title : 'On-Prem',
      description : 'All the power of Codenvy\'s Cloud behind your firewall, connected to your systems and processes.',
      buttonTitle : 'Buy',
      icon : 'assets/images/icon-on-prem.png',
      content : [
        'Unlimited nodes',
        'Updater service',
        'Email support'
      ],
      buy: function() {
        ctrl.onPremChoosen(ctrl.$window);
      }
    };
  }
}

export default SubscriptionCtrl;
