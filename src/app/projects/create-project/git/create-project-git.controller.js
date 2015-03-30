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
 * This class is handling the controller for the git part
 * @author Florent Benoit
 */
class CreateProjectGitCtrl {

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor(codenvyAPI) {
    this.codenvyAPI = codenvyAPI;
    this.focus = false;
  }

  /**
   * Input for setting the GIT URL gets the focus
   */
  setFocus() {
    this.focus = true;
  }

  /**
   * Input for setting the GIT URL losts the focus
   */
  lostFocus() {
    this.focus = false;
  }


}


export default CreateProjectGitCtrl;
