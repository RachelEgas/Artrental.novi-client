import React, {Component} from "react";
import Rent from "./Rent";
import {PAGE_LIST_SIZE} from "../constants";
import {getUserOrders} from "../util/APIUtils";
import {Button} from "antd";
import LoadingIndicator from "../common/LoadingIndicator";
import {Link} from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";
import './RentList.css'
class RentList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            rents: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadRentList = this.loadRentList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadRentList(page = 0, size = PAGE_LIST_SIZE) {
        let rentListPromise;
        if(this.props.username) {
            rentListPromise = getUserOrders(this.props.username, page, size);
        };

        if(!rentListPromise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        rentListPromise
            .then(response => {
                const rents = this.state.rents.slice();

                this.setState({
                    rents: rents.concat(response.content),
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
            this.loadRentList();
        }
    }

    componentDidUpdate(nextProps, nextState) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                rents: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadRentList();
        }
    }

    handleLoadMore() {
        this.loadRentList(this.state.page + 1);
    }

    render() {
        const rentViews = [];
        this.state.rents.forEach((rent, artIndex) => {
            rentViews.push(<Rent
                key={rent.id}
                rent={rent}/>)
        });
        return (
            <div className="rents-container">
                {rentViews}
                {
                    !this.state.isLoading && this.state.rents.length === 0 && this.props.isAuthenticated ? (
                        <div className="no-rents-found">
                            <span>No art rented yet.</span>
                        </div>
                    ) : null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-rents">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <PlusOutlined type="plus" /> Load more
                            </Button>
                        </div>): null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator />: null
                }
                {
                    !this.props.isAuthenticated ?
                        (<div className="no-rents-found">
                            <span>Welcome!<br/> Please <Link to="/login">log in</Link> or <Link to="/signup">register now!</Link></span>
                        </div>) : null
                }
            </div>
        );
    }
}
export default RentList;