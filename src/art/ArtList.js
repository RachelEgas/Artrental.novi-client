import {ART_LIST_SIZE} from "../constants";
import {getAllArt, getUserCreatedArt} from "../util/APIUtils";
import React, { Component } from 'react';
import LoadingIndicator from "../common/LoadingIndicator";
import {Button, Icon} from 'antd';
import Art from './Art';
import {Link, withRouter} from "react-router-dom";
import './ArtList.css';

class ArtList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arts: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadArtList = this.loadArtList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadArtList(page = 0, size = ART_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_ART') {
                promise = getUserCreatedArt(this.props.username, page, size);
            }
        } else {
            promise = getAllArt(page, size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const arts = this.state.arts.slice();

                this.setState({
                    arts: arts.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentDidMount() {
        if(this.props.isAuthenticated)
        {
            this.loadArtList();
        }
    }

    componentDidUpdate(nextProps, nextState) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                arts: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadArtList();
        }
    }

    handleLoadMore() {
        this.loadArtList(this.state.page + 1);
    }

    render() {
        const artViews = [];
        this.state.arts.forEach((art, artIndex) => {
            artViews.push(<Art
                key={art.id}
                art={art} />)
        });

        return (
            <div className="arts-container">

                {artViews}
                {
                    !this.state.isLoading && this.state.arts.length === 0 && this.props.isAuthenticated ? (
                        <div className="no-art-found">
                            <span>No art added yet.</span>
                        </div>
                    ) : null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-arts">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator />: null
                }
                {
                    !this.props.isAuthenticated ?
                        (<div className="no-art-found">
                            <span>Welcome!<br/> Please <Link to="/login">log in</Link> or <Link to="/signup">register now!</Link></span>
                        </div>) : null
                }
            </div>
        );
    }
}

export default withRouter(ArtList);