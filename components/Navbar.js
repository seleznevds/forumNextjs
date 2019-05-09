import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-materialize';

class CustomNavbar extends Component {
    state = {
        value: 0,
    };

    componentDidMount() {
        let value = {
            index: 0,
            length: 0
        };
        this.props.links.forEach((link, index) => {
            if (window.location.pathname.includes(link.pathname, 0) && link.pathname.length > value.length) {
                value = {
                    index,
                    length: link.pathname.length
                };
            }
        });
        this.setState({
            value: value.index
        });
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        return (
            <Navbar brand={<div>Forum</div>} alignLinks="right">
                {this.props.links.map((link, index) => {
                    return <Link className="sidenav-close" key={index} to={link.pathname}>{link.label}</Link>
                })}
            </Navbar>
        );
    }
}

export default CustomNavbar;