import React, { Component } from 'react';
import Link from 'next/link';
import { Navbar } from 'react-materialize';
import UserContext from '../lib/UserContext'
import styled from 'styled-components';


const Logo = styled.div`
  user-select: none;
  float: left ;
  font-size: 1.5rem;
  margin:  0 10px;
 
  `;


class Header extends Component {

    state = {
        menu: [
            {
                id: 1,
                label: "Home",
                pathname: "/"
            }
        ]
    };

    componentDidMount() {
        if (this.context && this.context.id) {
            this.setState({
                menu: [
                    {
                        id: 1,
                        label: "Home",
                        pathname: "/"
                    },
                    {
                        id: 2,
                        label: "Create post +",
                        pathname: "/post/create"
                    },
                    {
                        id: 3,
                        label: "Profile",
                        pathname: "/profile"
                    },
                    {
                        id: 4,
                        label: "Logout",
                        pathname: "/logout"
                    }
                ]
            });
        } else {
            this.setState({
                menu: [
                    {
                        id: 1,
                        label: "Home",
                        pathname: "/"
                    },
                    {
                        id: 5,
                        label: "Login",
                        pathname: "/login"
                    }
                ]
            });
        }
    }

    render() {
        return (
            <Navbar brand={<Logo><Link href="/" key={545}><a>Forum</a></Link></Logo>} alignLinks="right">

                {this.state.menu.map((link, index) => {
                    return <Link href={link.pathname} key={link.id}><a className="sidenav-close">{link.label}</a></Link>;
                })}
            </Navbar>
        );
    }

    static contextType = UserContext;
}

export default Header;