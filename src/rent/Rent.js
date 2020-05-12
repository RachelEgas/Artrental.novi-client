import React, {Component} from "react";
import {Avatar, Button, Form} from "antd";
import {formatDateTime} from "../util/Helpers";
import './Rent.css';
class Rent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            rent: this.props.rent
        };
    }
    render() {
        return (
            <div className="rent-content">
                <div className="rent-header">
                    <div className="rent-info">
                        <Avatar title={this.state.rent.art.inRental ? "Art is in rental" : "Art is available for rental" }
                                className="rent-avatar"
                                style={{ backgroundColor: '#2196F3'}} >
                            { '🎨' }
                        </Avatar>
                        <div className="rental" >
                            <span className="rent-art-title">
                                {this.state.rent.art.title}
                            </span>
                            <span className="rent-art-description">
                                {this.state.rent.art.description}
                            </span>
                            <span className="rent-creation-date">
                                {formatDateTime(this.state.rent.creationDateTime, false)}
                            </span>
                        </div>
                    </div>
                    <div className="rent-period">
                        {'Rental period: ' + this.state.rent.period + ' months'}
                    </div>
                    <div className="rent-total-price">
                        {'€ ' + this.state.rent.total.toFixed(2) + ' p/mth'}
                    </div>
                </div>
            </div>
        );
    }
}

export default Rent;