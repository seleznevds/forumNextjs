import React, { Component } from 'react';
import { Row, Col } from "react-materialize";
import withAuth from "../lib/withAuth";
import withLayout from "../lib/withLayout";

class Profile extends Component {
    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <Row>
                <Col s={12} className="">
                    <h2>Profile</h2>
                    <h3>Hello, {this.props.user.displayName}</h3></Col>
            </Row>
        );
    }
}

export default withAuth(withLayout(Profile));