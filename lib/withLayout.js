import React, { Component } from 'react';
import Header from '../components/Header';
import UserContext from './UserContext';

function withLayout(BaseComponent) {
    class LayoutedComponent extends Component {
        render() {
            return (<>
                <Header/>
                <BaseComponent {...this.props} />
            </>);
        }

        static async getInitialProps(ctx) {
            if (BaseComponent.getInitialProps) {
                return BaseComponent.getInitialProps(ctx);
            }

            return {};
        }

        static contextType = UserContext;
    }

    return LayoutedComponent;
}

export default withLayout;