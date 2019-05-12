import React, { Component } from 'react';
import Link from 'next/link';
import { Navbar } from 'react-materialize';




class Header extends Component {
    state = {
        value: 0,
    };

    render() {
        return (
            <Navbar brand={<div>Forum</div>} alignLinks="right">
                {this.props.links.map((link, index) => {
                    return <Link  href={link.pathname}  key={index}><a className="sidenav-close">{link.label}</a></Link>;
                })}
            </Navbar>
        );
    }
}

export default Header;