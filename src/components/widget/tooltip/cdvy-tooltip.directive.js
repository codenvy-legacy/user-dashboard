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

import Register from '../../utils/register';

/**
 * Defines a directive for creating tooltip container.
 * @author Oleksii Orel
 */
class CodenvyTooltip {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor() {
    this.restrict = 'E';
    this.replace = true;
    this.transclude = true;
    this.templateUrl = 'components/widget/tooltip/cdvy-tooltip.html';

    // scope values
    this.scope = {
      tooltipTitle: '@cdvyTitle'
    };

    //this.controller = function ($scope) {
    //$scope.getOpenTooltips = function () {
    //  return document.getElementsByClassName('_720kb-tooltip-open');
    //};
    //
    //$scope.correctOpenTooltip = function (leftPosition, topPosition) {
    //  let openTooltips = $scope.getOpenTooltips();
    //  if (!openTooltips.length) {
    //    return;
    //  }
    //
    //  let style = openTooltips[0].getAttribute('style');
    //  if (style) {
    //    let params = style.split(";");
    //
    //    params.forEach((param) => {
    //      if (param.indexOf('margin-top') !== -1) {
    //        param = ' margin-top: ' + (topPosition) + 'px;';
    //      }
    //      if (param.indexOf('margin-left') !== -1) {
    //        param = ' margin-left: ' + (leftPosition) + 'px;';
    //      }
    //    });
    //
    //    let newStyle = params.join(';');
    //    if (newStyle.indexOf('margin-top') === -1) {
    //      newStyle += ' margin-top: ' + (topPosition) + 'px;';
    //    }
    //    if (newStyle.indexOf('margin-left') === -1) {
    //      newStyle += ' margin-left: ' + (leftPosition) + 'px;';
    //    }
    //    openTooltips[0].setAttribute('style', newStyle);
    //  }
    //}
    //};
  }

  compile(element, attrs) {

    var keys = Object.keys(attrs);

    // search the tooltip element
    var tooltipElements = element.find('.cdvy-tooltip');

    keys.forEach((key) => {

      // don't reapply internal properties
      if (key.indexOf('$') === 0) {
        return;
      }
      // don't reapply the attribute 'class'
      if (key.indexOf('class') === 0) {
        return;
      }
      // don't reapply internal element properties
      if (key.indexOf('cdvy') === 0) {
        return;
      }
      var value = attrs[key];

      // handle empty values as boolean
      if (value === '') {
        value = 'true';
      }

      // set the value of the attribute
      tooltipElements.attr(attrs.$attr[key], value);

      element.removeAttr(attrs.$attr[key]);
    });
  }

  /**
   * Keep reference to the model controller
   */
  link($scope, element) {
    var tooltipRelativeElements = element.find('.cdvy-tooltip');
    //if (tooltipRelativeElements.length) {
    //  $scope.offsetTop = tooltipRelativeElements[0].offsetTop;
    //  $scope.offsetLeft = tooltipRelativeElements[0].offsetLeft;
    //}

    $scope.onMouseOver = function () {
      if (!tooltipRelativeElements.length) {
        return;
      }
      //TODO Fix bug with position of tooltip when scrolling
      //let offsetTop = tooltipRelativeElements[0].offsetTop;
      //let offsetLeft = tooltipRelativeElements[0].offsetLeft;
      //
      //if (offsetTop !== $scope.offsetTop || offsetLeft !== $scope.offsetLeft) {
      //  $scope.correctOpenTooltip(offsetTop - $scope.offsetTop, offsetLeft - $scope.offsetLeft);
      //}

    }

  }

}

export default CodenvyTooltip;

Register.getInstance().directive('cdvyTooltip', CodenvyTooltip);
