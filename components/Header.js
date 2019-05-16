import React, { Component } from 'react';
import Link from 'next/link';
import { Navbar } from 'react-materialize';
import UserContext from '../lib/UserContext'



class Header extends Component {
   
    state = {
        menu : [
            {
                id:1,
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
                    id:1,
                    label:"Home",
                    pathname: "/"
                },
                {
                    id:2,
                    label:"Create post +",
                    pathname: "/post/create"
                },
                {
                    id:3,
                    label: "Profile",
                    pathname: "/profile"
                },
                {
                    id:4,
                    label: "Logout", 
                    pathname: "/logout"
                }   
            ]
        });
       } else {
        this.setState({
            menu : [
                {
                    id:1,
                    label:"Home",
                    pathname: "/"
                },
                {
                    id:5,
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
                    return <Link  href={link.pathname}  key={link.id}><a className="sidenav-close">{link.label}</a></Link>;
                })}
            </Navbar>
        );
    }

    static contextType = UserContext;
}

export default Header;