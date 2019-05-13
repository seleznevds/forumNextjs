import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Preloader } from 'react-materialize';
import { getWordForm } from '../../lib/utils';
import CommentsForm from './CommentsForm';
import { getUniqueCollectionByProp } from '../../lib/utils';
import styled from 'styled-components';
import Vote from '../Vote';

const CommentText = styled.div`
    white-space: pre-wrap;
`;

const CommentShowLink = styled.div`
    display: block;
    margin-bottom: 14px;
    font-weight:500;
    cursor:pointer;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;    
`;

class Comment extends Component {
    state = {
        showDescendants: false,
        comments: [],
        newComments: [],
        authors: [],
        loading: false
    };

    toggleDescendants = (event) => {
        if (!this.state.showDescendants) {
            this.getDescendants();
        }

        this.setState({
            showDescendants: !this.state.showDescendants
        });

        event.preventDefault();
    }

    getDescendants = (offset = 0, limit = 2) => {
        if (!this.props.comment.descendantsIds.length || this.state.comments.length >= offset + limit ||
            this.state.comments.length === this.props.comment.descendantsIds.length) {
            return;
        }
        this.props.getComments(this.props.comment.id, this.props.comment.postId, this, offset, limit);
    }

    getMoreDescendants = (event) => {
        this.getDescendants(this.state.comments.length);
        event.preventDefault();
    }


    receiveComment = (comment, author) => {
        this.setState(state => {
            return {
                newComments: getUniqueCollectionByProp([...state.newComments, comment], "id"), //комментарий добавляем в конец списка
                authors: getUniqueCollectionByProp([author, ...state.authors], "id")
            }

        });

    }

    render() {
        const { comment, author } = this.props;

        let descendants = null;
        if (this.props.root && comment.descendantsIds && comment.descendantsIds.length) {
            if (!this.state.showDescendants) {
                let word = getWordForm(comment.descendantsIds.length, {
                    plural: 'ответов',
                    genitive: 'ответа',
                    nominative: 'ответ'
                })

                descendants = <CommentShowLink onClick={this.toggleDescendants}>
                Показать {comment.descendantsIds.length > 1 ? comment.descendantsIds.length : ''} {word}</CommentShowLink>;
            } else {
                descendants = <>
                    <CommentShowLink onClick={this.toggleDescendants}>Скрыть ответы</CommentShowLink>

                    {this.state.comments.map((comment) => {
                        return (
                            <Comment key={comment.id} comment={comment} author={author} getComments={this.getComments} receiveCommentHandler={this.receiveComment} />
                        );
                    })}
                    {this.state.comments.length && this.state.comments.length < this.props.comment.descendantsIds.length ?
                        <CommentShowLink onClick={this.getMoreDescendants}>Другие ответы</CommentShowLink> : null}
                </>;
            }
        }

        let newDescendants = null;
        if (this.props.root && this.state.newComments.length) {
            newDescendants = <div style={{ marginTop: "14px" }}>
                {this.state.newComments.map((comment) => {
                    return (
                        <Comment key={comment.id} comment={comment} author={author} getComments={this.getComments} receiveCommentHandler={this.receiveComment} />
                    );
                })}
            </div>;
        }

        return (
            <Row key={comment.id}>
                <Col s={1}>{<img className="circle responsive-img" src={author.avatarUrl} />}</Col>
                <Col s={9} >
                    <CommentText>{comment.text}</CommentText>
                    <CommentsForm parentId={comment.id} ancestorId={comment.ancestorId || comment.id} postId={comment.postId}
                        receiveCommentHandler={this.props.receiveCommentHandler || this.receiveComment}
                        voteForm={<Vote elementId={comment.id} votes={comment.votes} moduleName='Comment' />} />
                    {descendants}
                    {newDescendants}
                    {this.state.loading ?
                        <Row >
                            <Col s={12} style={{ textAlign: "center" }} >
                                <Preloader size="small" />
                            </Col>
                        </Row> : null}

                </Col>
                <Col s={1}></Col>
            </Row>

        );
    }
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
    receiveCommentHandler: PropTypes.func

};

export default Comment;