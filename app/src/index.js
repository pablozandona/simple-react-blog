import React from 'react';
import createHistory from 'history/createBrowserHistory';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Switch, Router, BrowserRouter} from 'react-router-dom';

import store from './store';
import {App, Blog} from './components';

import '../resources/scss/style.scss';

ReactDOM.render(
    <Router history={createHistory()}>
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact={true} component={App}/>
                    <Route path="/blog/:id" component={Blog}/>
                </Switch>
            </BrowserRouter>
        </Provider>
    </Router>,
    document.getElementById('root'),
);
