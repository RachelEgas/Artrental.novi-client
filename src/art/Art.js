
import React, { Component } from 'react';
import './Art.css';
import {Avatar, Button, Form, notification} from 'antd';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../util/Helpers';
import {createRent} from "../util/APIUtils";
import {MAX_RENTAL_PERIOD, MIN_RENTAL_PERIOD} from "../constants";
import {QuestionCircleOutlined} from "@ant-design/icons";
const FormItem = Form.Item;

class Art extends Component {
    constructor(props) {
        super(props);
        this.state = {
            art: this.props.art,
            period: {
                number: 0
            }
        };
        this.handleSubmitRent = this.handleSubmitRent.bind(this);
        this.handlePeriodChange = this.handlePeriodChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleSubmitRent(event) {
        const rentData = {
            period: this.state.period.number,
            art: this.state.art,
            total: (this.state.period.number * this.props.art.rentalPrice),
            payed: false
        };

        createRent(rentData)
            .then(response => {
                const redirectUrl = response.redirectUrl;
                window.location.href = redirectUrl;
                // this.props.history.push("/");
            }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create art.');
            } else {
                notification.error({
                    message: 'Rental App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
    }

    handlePeriodChange(event){
        const period = event.target.value;
        this.setState({
            period: {
                number: period,
                ...this.validateInput(period)
            }
        });
    }

    validateInput = (input) => {
        if(input > MAX_RENTAL_PERIOD) {
            return {
                validateStatus: 'error',
                errorMsg: 'Too long rental period entered'
            }
        } else if (input < MIN_RENTAL_PERIOD) {
            return {
                validateStatus: 'error',
                errorMsg: `Too short rental period entered`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    isFormInvalid() {
        if(this.state.period.validateStatus !== 'success') {
            return true;
        }
    }

    render() {

        return (
            <div className="art-content">
                <div className="art-header">
                    <Form onFinish={this.handleSubmitRent} className="create-art-form">
                    <div className="art-creator-info">
                        <Avatar title={this.state.art.inRental ? "Art is in rental" : "Art is available for rental" }
                                className="art-creator-avatar"
                                style={{ backgroundColor: this.state.art.inRental ? '#F44336' : '#1DA57A'}} >
                            {this.state.art.inRental ? 'R' : 'A' }
                        </Avatar>
                        <div className="creator-link" >
                            <span className="art-creator-name">
                                {this.state.art.createdBy.fullname}
                            </span>
                            <span className="art-creator-username">
                                @{this.state.art.createdBy.username}
                            </span>
                            <span className="art-creation-date">
                                {formatDateTime(this.state.art.creationDateTime, true)}
                            </span>
                        </div>
                    </div>
                    <div className="art-title">
                        {this.state.art.title}
                    </div>
                    <div className="art-price">
                        {'€ ' + this.state.art.rentalPrice.toFixed(2) + ' p/mth'}
                    </div>
                    <div className={'pull-right art-img zoomImg'}>
                        {/*<Image artImage={this.props.art.artImage} />*/}
                        <img id="art-img" alt="no image" src={'data:image/jpg;base64,'+ this.state.art.artImage}/>
                    </div>
                        {!this.props.profilePage ?
                            !this.props.art.inRental ?
                                <div >
                                    <FormItem help={this.state.period.errorMsg} className="rent-form-row">
                                        <input
                                            type='number'
                                            step="1"
                                            placeholder="Enter price here"
                                            style = {{ fontSize: '16px' }}
                                            min={MIN_RENTAL_PERIOD}
                                            max={MAX_RENTAL_PERIOD}
                                            className='ant-form-item-control-input'
                                            name = "period"
                                            value = {this.state.period.number}
                                            onChange = {this.handlePeriodChange}/>
                                    </FormItem>

                                    <Button type="primary"
                                        htmlType="submit"
                                        size="small"
                                        disabled={this.isFormInvalid()}
                                        className="rent-art-form-button">
                                        Rent this
                                    </Button>
                                    <QuestionCircleOutlined style={{fontSize: '10px'}}
                                                            theme="outlined"
                                                            className="tooltip"
                                                            title="After clicking the button, you will be redirected. It's only possible to pay with IDEAL." />

                                    </div>: null // in rental until: { datetime }
                            : null
                        }
                    </Form>
                </div>
            </div>
        );
    }
}

export default Art;