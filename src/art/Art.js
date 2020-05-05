
import React, { Component } from 'react';
import './Art.css';
import {Avatar, Button, Form, notification} from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import {rentArt} from "../util/APIUtils";
const FormItem = Form.Item;
class Art extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            period: this.state.period.number
        };

        rentArt(rentData)
            .then(response => {
                this.props.history.push("/");
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
        if(input > 9) {
            return {
                validateStatus: 'error',
                errorMsg: 'Too long rental period entered'
            }
        } else if (input < 1) {
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
                        <Link className="creator-link" to={`/users/${this.props.art.createdBy.username}`}>
                            <Avatar className="art-creator-avatar"
                                    style={{ backgroundColor: getAvatarColor(this.props.art.createdBy.fullname)}} >
                                {this.props.art.createdBy.fullname[0].toUpperCase()}
                            </Avatar>
                            <span className="art-creator-name">
                                {this.props.art.createdBy.fullname}
                            </span>
                            <span className="art-creator-username">
                                @{this.props.art.createdBy.username}
                            </span>
                            <span className="art-creation-date">
                                {formatDateTime(this.props.art.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <div className="art-title">
                        {this.props.art.title}
                    </div>
                    <div className="art-price">
                        {'€ ' + this.props.art.rentalPrice.toFixed(2) + ' p/mth'}
                    </div>
                    <div className={'pull-right art-img zoomImg'}>
                        {/*<Image artImage={this.props.art.artImage} />*/}
                        <img id="art-img" alt="no image" src={'data:image/jpg;base64,'+ this.props.art.artImage}/>
                    </div>
                        {!this.props.profilePage ?
                        <div >
                            <FormItem help={this.state.period.errorMsg} className="rent-form-row">
                                <input
                                    type='number'
                                    step="1"
                                    placeholder="Enter price here"
                                    style = {{ fontSize: '16px' }}
                                    min='1'
                                    max='9'
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
                        </div>: null
                        }
                    </Form>
                </div>
                <div className="art-footer">
                </div>
            </div>
        );
    }
}

export default Art;