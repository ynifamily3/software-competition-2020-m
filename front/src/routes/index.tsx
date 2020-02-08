import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import AppIn from '../AppIn';
function Root() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={AppIn} />
        <Redirect path="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Root;
