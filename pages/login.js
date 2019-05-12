import React, { Component } from 'react';
import { Row, Col } from "react-materialize";
import Link from 'next/link';
import withAuth from "../lib/withAuth";
import withLayout from "../lib/withLayout";

class Login extends Component {
    render() {
        return (
            <Row>
                <Col s={12} className="">
                    <h2>Login</h2>
                    <Link href="/auth/google"><a>Авторизоваться с аккаунтом  Google</a></Link></Col>
            </Row>
        );
    }
}

export default withAuth(withLayout(Login), {logoutRequired:true});