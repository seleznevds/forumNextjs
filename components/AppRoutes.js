import React, { Component} from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom'

import Home from './Home';
import Contacts from './Contacts';
import PostPage from './PostPage';

class App extends Component {
    state = {

    };


    handleChange = (event, value) => {

    };

    render() {


        return (
            <BrowserRouter>
                {this.props.children}
                <Switch>
                    <Route path="/contacts/" component={Contacts} />
                    <Route path="/posts/:id" component={PostPage} />
                    <Route  component={Home} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
