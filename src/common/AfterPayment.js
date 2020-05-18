import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button} from "antd";

class AfterPayment extends Component {
    render() {
        return (
            <div className="after-payment">
                <h1 className="title">
                    Succesfully received your order
                </h1>
                <div className="desc">
                    The owner of your rental will be in contact after the payment status is received.
                    After contact you can pick up your order at: <br/>
                    Hogeschool NOVI<br/>
                    Zonnebaan 9<br/>
                    3542EA Utrecht
                </div>
            </div>
        );
    }
}

export default AfterPayment;