import React from 'react';
import { IndexRoute, Route, Router, hashHistory } from 'react-router';

import PlayField from '../components/board/PlayField';
import TeamMenu from '../components/board/TeamMenu';

module.exports = (

  <Router history={hashHistory}>
    <Route path="/">
			<Route path="/battle" component={PlayField} />
			<IndexRoute component={TeamMenu} />
    </Route>
  </Router>
);