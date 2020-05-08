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
                    Your rented art is now ready for pick-up at: <br/>
                    Hogeschool NOVI<br/>
                    Zonnebaan 9<br/>
                    3542EA Utrecht
                </div>
            </div>
        );
    }
}

export default AfterPayment;