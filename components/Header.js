import React, { Component } from 'react';
import Link from 'next/link';
import { Navbar } from 'react-materialize';
import UserContext from '../lib/UserContext'



class Header extends Component {
   
    state = {
        menu : [
            {
                label:"Home",
                pathname: "/"
            }  
        ]
    };

    componentDidMount(){
       if(this.context && this.context.id){
        this.setState({
            menu : [
                {
                    label:"Home",
                    pathname: "/"
                },
                {
                    label:"Create post +",
                    pathname: "/post/create"
                },
                {
                    label: "Profile",
                    pathname: "/profile"
                },
                {
                    label: "Logout", 
                    pathname: "/logout"
                }   
            ]
        });
       } else {
        this.setState({
            menu : [
                {
                    label:"Home",
                    pathname: "/"
                },
                {
                    label:"Login",
                    pathname: "/login"
                } 
            ]
        });
       }
    }
    
    render() {
        return (
            <Navbar brand={<div>Forum</div>} alignLinks="right">
                {this.state.menu.map((link, index) => {
                    return <Link  href={link.pathname}  key={index}><a className="sidenav-close">{link.label}</a></Link>;
                })}
            </Navbar>
        );
    }

    static contextType = UserContext;
}

export default Header;