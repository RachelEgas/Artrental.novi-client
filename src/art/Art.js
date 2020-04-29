
import React, { Component } from 'react';
import './Art.css';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

class Art extends Component {

    render() {

        return (
            <div className="art-content">
                <div className="art-header">
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
                </div>
                <div className="art-footer">
                </div>
            </div>
        );
    }
}

export default Art;