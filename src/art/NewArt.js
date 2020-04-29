import React, { Component } from 'react';
import { createArt } from '../util/APIUtils';
import {ART_DESCRIPTION_MAX_LENGTH, ART_TITLE_MAX_LENGTH} from '../constants';
import './NewArt.css';
import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

class NewArt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                text: ''
            },
            inRental:{
                bool: false
            },
            description: {
                text: ''
            },
            rentalPrice: {
                float: 0.00
            },
            artImage: {
                string: ''
            }
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleSubmitArt = this.handleSubmitArt.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleSubmitArt(event) {
        event.preventDefault();
        const artData = {
            title: this.state.title.text,
            rentalPrice: this.state.rentalPrice,
            description: this.state.description.text,
            inRental: false,
            artImage: this.state.artImage.string
        };

        createArt(artData)
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

    validateText = (inputText, maxLength) => {
        if(inputText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a title!'
            }
        } else if (inputText.length > maxLength) {
            return {
                validateStatus: 'error',
                errorMsg: `Text is too long (Maximum ${maxLength} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleTitleChange(event){
        const title = event.target.value;
        this.setState({
            title: {
                text: title,
                ...this.validateText(title, ART_TITLE_MAX_LENGTH)
            }
        });
    }

    handleDescriptionChange(event){
        const description = event.target.value;
        this.setState({
            description: {
                text: description,
                ...this.validateText(description, ART_DESCRIPTION_MAX_LENGTH)
            }
        });
    }

    handlePriceChange(event){
        const price = event.target.value;
        this.setState({
            description: {
                string: price
            }
        });
    }

    handleImageChange(event){
        let selectedFile = event.target.files;
        let file = null;
        //let fileName = "";
        //Check File is not Empty
        if (selectedFile.length > 0) {
            // Select the very first file from list
            let fileToLoad = selectedFile[0];
            //fileName = fileToLoad.name;
            // FileReader function for read the file.
            let fileReader = new FileReader();
            // Onload of file read the file content
            fileReader.onload = function(fileLoadedEvent) {
                file = fileLoadedEvent.target.result;
                // Print data in console
                console.log(file);
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);
        }

        this.setState({
            artImage:{
                string: file
            }
        });
    }

    isFormInvalid() {
        if(this.state.title.validateStatus !== 'success' || this.state.description.validateStatus !== 'success') {
            return true;
        }
    }

    render() {

        return (
            <div className="new-art-container">
                <h1 className="page-title">Create Art</h1>
                <div className="new-art-content">
                    <Form onSubmit={this.handleSubmitArt} className="create-art-form">
                        <FormItem validateStatus={this.state.title.validateStatus}
                                  help={this.state.title.errorMsg} className="art-form-row">
                            <TextArea
                                placeholder="Enter your title"
                                style = {{ fontSize: '16px' }}
                                autosize={{ minRows: 3, maxRows: 6 }}
                                name = "title"
                                value = {this.state.title.text}
                                onChange = {this.handleTitleChange} />
                        </FormItem>
                        <FormItem validateStatus={this.state.description.validateStatus}
                                  help={this.state.description.errorMsg} className="art-form-row">
                            <TextArea
                                placeholder="Enter the description here"
                                style = {{ fontSize: '16px' }}
                                autosize={{ minRows: 3, maxRows: 6 }}
                                name = "title"
                                value = {this.state.description.text}
                                onChange = {this.handleDescriptionChange} />
                        </FormItem>
                        <FormItem help={this.state.rentalPrice.errorMsg} className="art-form-row">
                        <input
                            type='number'
                            step="0.1"
                            placeholder="Enter price here"
                            style = {{ fontSize: '16px' }}
                            min='0'
                            max='200'
                            className='ant-form-item-control-input'
                            name = "price er month"
                            value = {this.state.rentalPrice.value}
                            onChange = {this.handlePriceChange}/>
                    </FormItem>
                        <FormItem help={this.state.rentalPrice.errorMsg} className="art-form-row">
                            <input
                                type='file'
                                onChange={this.handleImageChange}
                                ref={fileInput => this.fileInput = fileInput}
                                style={{display: 'none'}}/>

                                <Button
                                    size='small'
                                    className='pick-image-'
                                    onClick={() => this.fileInput.click()}>Pick an image</Button>
                        </FormItem>
                        <FormItem className="art-form-row">
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    disabled={this.isFormInvalid()}
                                    className="create-art-form-button">Create Art</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}
export default NewArt;