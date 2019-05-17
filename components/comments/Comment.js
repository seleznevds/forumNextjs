import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Preloader } from 'react-materialize';
import { getWordForm } from '../../lib/utils';
import CommentsForm from './CommentsForm';
import { getUniqueCollectionByProp } from '../../lib/utils';
import styled from 'styled-components';
import Vote from '../Vote';
import moment from 'moment';

moment.locale('ru');

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

const CommentAuthor = styled.span`
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;  
    font-weight:500;
    margin-right: 10px
`;

const CommentDate = styled.span`
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;  
    font-weight:300;
    font-size: 0.8rem;
    margin-right: 10px;
    color:hsl(0, 0%, 53.3%);
`;

const AvatarContaner = styled.div`
  user-select: none;
  height: 60px;
  width:60px;
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
        this.props.getComments({ ancestorId: this.props.comment.id, postId: this.props.comment.postId, component: this, offset, limit });
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

        
        //у комментариев  первого уровня  будем отображать всех имеющихся потомков
        let descendants = null;
        if (this.props.root && comment.descendantsIds && comment.descendantsIds.length) {

            if (!this.state.showDescendants) { //если потомки  скрыты
                let word = getWordForm(comment.descendantsIds.length, {
                    plural: 'ответов',
                    genitive: 'ответа',
                    nominative: 'ответ'
                })

                descendants = <CommentShowLink onClick={this.toggleDescendants}>
                    Показать {comment.descendantsIds.length > 1 ? comment.descendantsIds.length : ''} {word}</CommentShowLink>;
            } else {//если пользователь  открыл список  потомков
                descendants = <>
                    <CommentShowLink onClick={this.toggleDescendants}>Скрыть ответы</CommentShowLink>

                    {this.state.comments.map(comment => 
                        <Comment key={comment.id} comment={comment} author={author} receiveCommentHandler={this.receiveComment} />)}
                    
                    {this.state.comments.length && this.state.comments.length < this.props.comment.descendantsIds.length ?
                        <CommentShowLink onClick={this.getMoreDescendants}>Другие ответы</CommentShowLink> : null}
                </>;
            }
        }

        //если  пользователь  отвечает на ккомментарий, то комментарий добавляется в список  новых потомков
        let newDescendants = null;
        if (this.props.root && this.state.newComments.length) {
            newDescendants = <div style={{ marginTop: "14px" }}>
                {this.state.newComments.map(comment =>
                     <Comment key={comment.id} comment={comment} author={author}  receiveCommentHandler={this.receiveComment} />)}
            </div>;
        }

        let loader = (this.state.loading ?
            <Row >
                <Col s={12} style={{ textAlign: "center" }} >
                    <Preloader size="small" />
                </Col>
            </Row> : null);

        let voteForm = <Vote elementId={comment.id} votes={comment.votes} moduleName='Comment' />;

        return (
            <Row key={comment.id}>
                <Col s={1}>
                    <AvatarContaner>
                        <img className="circle responsive-img" src={author.avatarUrl} />
                    </AvatarContaner>
                </Col>
                
                <Col s={9} >
                    
                    <div>
                        <CommentAuthor>{author.displayName}</CommentAuthor>
                        <CommentDate>{moment(comment.createdAt, "YYYY-MM-DDTHH:mm:ss.SSS").fromNow()}</CommentDate>
                    </div>
                    
                    <CommentText>{comment.text}</CommentText>
                    
                    <CommentsForm 
                        parentId={comment.id}
                        ancestorId={comment.ancestorId || comment.id} 
                        postId={comment.postId}
                        receiveCommentHandler={this.props.receiveCommentHandler || this.receiveComment}
                        voteForm={voteForm} />
                    
                    {descendants}
                    
                    {newDescendants}
                    
                    {loader}

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