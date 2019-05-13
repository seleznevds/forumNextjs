import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Card } from 'react-materialize'
import Vote from './Vote'



class Post extends React.Component {
    state = { expanded: false };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { post, isDetail } = this.props;
        const title = isDetail ? <div className="card_title">{post.title}</div> :
        <div className="card_title">
            <Link as={`/post/${post.id}`} href={`/post?postId=${post.id}`}>
                <a>{post.title}</a>
            </Link>

        </div>;

    return (
            <Card
                className=""
                textClassName=""
                header={title}
                actions={[<Vote key={post.id} elementId={post.id} votes={post.votes} moduleName='Post' />]}>
                <img src={post.image} />
                <p>{this.props.isDetail ? post.text : post.preview}</p>
            </Card>
        );
    }
}

Post.propTypes = {
    post: PropTypes.object.isRequired
};

export default Post;