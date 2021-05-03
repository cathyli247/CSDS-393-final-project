import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Form, FormGroup, FormFeedback, Modal, ModalHeader, ModalBody, Row, Col, Label, Input} from 'reactstrap';
import {Link} from 'react-router-dom';
var config = require('../config');

class BlogViewer extends Component{
    constructor(props){
        super(props);
        this.state={
            id:'',
            title:'',
            author:'',
            blog_content:'',
            comments:[],
            fav_list:[],
            newComment:'',
            isModalOpen: false,
            touched: {
                newComment: false
            }
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleFav = this.handleFav.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    componentDidMount() {
        fetch(config.serverUrl+this.props.path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.error_message) alert(data.error_message);
            else{
                this.setState({
                    id: data.pk,
                    title: data.title,
                    author: data.username,
                    blog_content: data.content
                });
                if(this.props.authenticated){
                    fetch(config.serverUrl+"/account/properties/", {
                        method:"GET",
                        headers:{
                            'Content-Type': 'application/json',
                            'AUTHORIZATION': "JWT "+this.props.authenticated
                        }
                    })
                    .then(res2 => res2.json())
                    .then(data2 => {
                            if(data2.error_message) alert(data2.error_message);
                            else{
                                this.setState({
                                    fav_list: data2.fav_list
                                });
                                fetch(config.serverUrl+"/comment/list?search"+this.state.blog_id, {
                                    method:"GET",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then(res3.json())
                                .then(data3 => {
                                    if(data3.error_message) alert(data3.error_message);
                                    else{
                                        this.setState({
                                            comments: data3
                                        });
                                    }
                                })
                            }
                        }
                    )
                }
            }
        })
    }

    toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        });
    }

    handleFav(event){
        event.preventDefault();
        if(this.props.authenticated){
            var newFavList = this.state.fav_list;
            var found = false;
            for(var i = 0;i < newFavList.length;i++){
                if(newFavList[i] == this.state.blog_id){
                    found = true;
                    for(;i < newFavList.length-1;i++){
                        newFavList[i] = newFavList[i+1];
                    }
                }
            }
            if(found) alert("This blog has already been added to your favorite list!");
            else{
                newFavList.push(this.state.blog_id);
                let databody = {
                    "fav_list": newFavList
                }
                fetch(config.serverUrl+"/accout/properties/update", {
                    method: 'PUT',
                    body: JSON.stringify(databody),
                    headers: {
                        'Content-Type': 'application/json',
                        'AUTHORIZATION': "JWT "+this.props.authenticated
                    }
                })
                .then(res => res.json())
                .then(data => {
                    alert("This blog has been added to your Fav List!");
                })
            }
        }
        else{
            alert("Please Login first!");
        }
    }

    handleSubmit(event){
        event.preventDefault();
        if(this.props.authenticated){
            let databody = {
                "comment_content": this.state.newComment,
                "username": this.props.username
            }
            fetch(config.serverUrl+"/comment/create", {
                method: 'POST',
                body: JSON.stringify(databody),
                headers: {
                    'Content-Type': 'application/json',
                    'AUTHORIZATION': "JWT "+this.props.authenticated
                },
            })
            .then(res => res.json())
            .then(data => {
                alert("Successfully comment on this blog!");
                this.toggleModal();
            })
        }
        else{
            alert("Please Sign up or Login first!");
        }
    }

    validate(newComment) {

        const errors = {
            newComment:''
        };

        if (this.state.touched.newComment && newComment.length < 1)
            errors.newComment = 'Comment is required';

        return errors;
    }

    render(){
        const errors = this.validate(this.state.newComment);

        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to={{ pathname: '/home' , state: { search: this.props.location.state.search, category: this.props.location.state.category} }}>Search Results</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{this.state.title}</BreadcrumbItem>
                    </Breadcrumb>                    
                </div>
                <h1 style={{textAlign:"center"}}>{this.state.title}</h1>
                <h2 style={{textAlign:"center"}}>BY {this.state.author}</h2>
                <div className="row" style={{borderStyle:"solid", borderColor: "#D7D7D7", borderWidth:"1px",borderRadius:"10px", padding:"20px"}}>
                    <div className="col-12">
                        <p>{this.state.blog_content}</p>
                    </div>
                    <br />
                    <div className="col-9 col-md-3 offset-md-8">
                        <Button id="post" disabled={!this.props.authenticated} onClick={this.toggleModal} style={{background:"rgba(10,48,78,0.41)", width:"100%", fontFamily:"Arial Black", color:"white", border:"none"}}>
                            <i class="fa fa-pencil" aria-hidden="true"></i> Post comment
                        </Button>
                    </div>
                    <div className="col-3 col-md-1">
                        <Form onSubmit={this.handleFav} class="form-style">
                            <Button type="submit" value="submit" style={{background:"rgba(10,48,78,0.41)", fontFamily:"Arial Black",border:"none", borderRadius: "50%"}}>
                                <i class="fa fa-heart" aria-hidden="true"></i>
                            </Button>
                        </Form>
                    </div>
                </div>
                <div className="row" style={{marginTop: "20px"}}>
                    <div className="col-12">
                        <hr className="seperation" />
                    </div>
                    <div className="col-12 col-md-6">
                        <p style={{fontSize:"16px", fontFamily:"Arial Black"}}>Comments</p>
                    </div>
                </div>
                {
                    this.state.comments.map((comment) => {
                        return (
                            <div className="row" style={{marginBottom:"30px", paddingLeft:"20px"}}>
                                <div className="col-12" style={{marginTop:"20px"}}>
                                    <p><strong>Author: </strong> {comment.username}</p>
                                </div>
                                <div className="col-12">
                                    <p><strong>Comment: </strong> {comment.comment_content}</p>
                                </div>
                                <div className="col-12" style={{marginTop:"-20px"}}>
                                    <hr style={{border:"1px dashed #D7D7D7"}} />
                                </div>
                            </div>
                        );
                    })
                }
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Post Your Comment</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleSubmit} class="form-style">
                            <Row>
                                <Col xs={12}>
                                    <FormGroup className="form-style-form-group">
                                        <Label htmlFor="newComment" className="form-style-label">Comment (Required)</Label>
                                        <Input type="textarea" id="newComment" name="newComment" rows="5" value={this.state.newComment} onChange={this.handleInputChange} valid={errors.newComment === ''} invalid={errors.newComment !== ''} onBlur={this.handleBlur('newComment')}/>
                                        <FormFeedback>{errors.newComment}</FormFeedback>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} md={{size:6, offset:3}}>
                                    <FormGroup>
                                        <Button disabled={ this.state.newComment === '' || errors.newComment != ''} type="submit" value="submit" style={{background:"#0A304E", width:"100%", fontFamily:"Arial Black"}}>Submit</Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default BlogViewer;