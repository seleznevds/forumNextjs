import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Card, Row, Col } from 'react-materialize'
import Vote from './Vote';
import styled from 'styled-components';

const CardTitle = styled.div`
  font-size:2rem;
  margin: 10px 24px 24px 24px;
`;

class Post extends React.Component {
    state = { expanded: false };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { post, isDetail } = this.props;
        const title = isDetail ? <CardTitle>{post.title}</CardTitle> :
            <CardTitle>
                <Link as={`/post/${post.id}`} href={`/post?postId=${post.id}`}>
                    <a>{post.title}</a>
                </Link>

            </CardTitle>;

        return (

            <Card
                className=""
                textClassName=""
                header={title}
                actions={[<Vote key={post.id} elementId={post.id} votes={post.votes} moduleName='Post' />]}>
                <Row>
                    <Col s={5}>
                        <img src={post.image} className="responsive-img" />
                    </Col>
                    <Col s={8}><p>{this.props.isDetail ? post.text : post.preview}</p></Col>
                    <Col s={1}>
                        <p>
                            <Link as={`/post/edit/${post.id}`} href={`/post/edit?postId=${post.id}`}><a>Редактировать</a></Link>
                        </p>
                    </Col>
                </Row>
            </Card>

        );
    }
}

Post.propTypes = {
    post: PropTypes.object.isRequired
};

export default Post;