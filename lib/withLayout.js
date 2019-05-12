import React, { Component } from 'react';
import Header from '../components/Header';

const menu = [
    {
        label:"Home",
        pathname: "/"
    },
    {
        label:"Login",
        pathname: "/login"
    },
    {
        label: "Profile",
        pathname: "/profile"
    },
    {
        label: "Logout", 
        pathname: "/logout"
    }   
];

function withLayout(BaseComponent) {
    class LayoutedComponent extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return (<>
                <Header   links={menu} />
                <BaseComponent {...this.props} />
            </>);
        }

        static async getInitialProps(ctx) {
            if (BaseComponent.getInitialProps) {
                return BaseComponent.getInitialProps(ctx);
            }

            return {};
        }
    }

    return LayoutedComponent;
}

export default withLayout;