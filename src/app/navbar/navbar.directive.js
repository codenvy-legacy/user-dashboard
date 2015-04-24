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
 * Defines a directive for creating navbar.
 * @author Florent Benoit
 */
class NavBar {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor () {
    this.restrict='E';
    this.replace=true;
    this.templateUrl = 'app/navbar/navbar.html';
    this.controller = 'NavbarCtrl';
    this.controllerAs = 'navbarCtrl';
  }

}

export default NavBar;
