import React, { Component } from 'react';
import sendVote from '../lib/votes'
import PropTypes from 'prop-types';
import { Icon, Button } from 'react-materialize'
import styled from 'styled-components';

const StyledButton = styled(Button)`
    user-select: none;
`;

class Vote extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            userVoteType: this.props.votes.userVoteType,
            removeVoteType: undefined,
            likes: props.votes.likes,
            dislikes: props.votes.dislikes,
            block: false
        }
    }


    handlerClick = (userVoteType) => {
        if(this.state.block){   
            console.log('blocked')         
            return;            
        }
        this.setState((state) => {
            userVoteType = userVoteType === this.state.userVoteType ? undefined : userVoteType;
            let removeVoteType = this.state.userVoteType;

            let likes = state.likes;
            let dislikes = state.dislikes;

            if (userVoteType === 'like') {
                likes++;
            } else if (userVoteType === 'dislike') {
                dislikes++;
            }

            if (removeVoteType === 'like') {
                likes--;
            } else if (removeVoteType === 'dislike') {
                dislikes--;
            }

            return {
                userVoteType,
                removeVoteType,
                likes,
                dislikes
            };

        }, () => {
            this.setState({
                block:true
            });
            sendVote({
                elementId: this.props.elementId,
                voteType: this.state.userVoteType,
                removeVoteType: this.state.removeVoteType,
                moduleName: this.props.moduleName
            }).finally(() => {
                this.setState({
                    block:false
                });
            });
        });


    };

    render() {
        
        let likeButtonClassName = this.state.userVoteType === 'like' ? "transparent blue-text" : "transparent black-text";
        let dislikeButtonClassName = this.state.userVoteType === 'dislike' ? "transparent blue-text" : "transparent black-text";     

        return (
            <>
                <StyledButton
                    key={`like${this.props.elementId}`}
                    flat
                    node="a"
                    small
                    onClick={() => { this.handlerClick('like'); }}
                    onSelect={(event)=> {event.preventDefault();}}
                    className={likeButtonClassName}
                    style={{ marginRight: '10px', padding: "0 3px" }}
                > {this.state.likes} <Icon className="votes_button_icon">thumb_up</Icon>
                </StyledButton>

                <StyledButton
                    key={`dislike${this.props.elementId}`}
                    flat
                    node="a"
                    waves="light"
                    small
                    style={{ marginRight: '10px', padding: "0 3px" }}
                    onClick={() => { this.handlerClick('dislike'); }}
                    onSelect={(event)=> {event.preventDefault();}}
                    className={dislikeButtonClassName}

                > {this.state.dislikes} <Icon className="votes_button_icon">thumb_down</Icon>
                </StyledButton>
            </>
        );
    }
}


Vote.propTypes = {
    elementId: PropTypes.string.isRequired,
    votes: PropTypes.object.isRequired
};

export default Vote;