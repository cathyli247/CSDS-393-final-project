import React, {Component} from 'react';
import {Button, Form, FormGroup, Input, Col, Row} from 'reactstrap';
import { Link } from 'react-router-dom';
var config = require('../config');

class Home extends Component{
    constructor(props){
        super(props);

        this.state = {
            search:'NA',
            category:'NA',
            blogs: []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        if(this.props.location.state){
            fetch(config.serverUrl+'/home/'+this.props.username+'/'+this.props.location.state.search+'/'+this.props.location.state.category, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    blogs: data.blogs
                })
            })
        }
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event){
        event.preventDefault();

        fetch(config.serverUrl+'/home/'+this.props.username+'/'+this.state.search+'/'+this.state.category, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({
                blogs: data.blogs
            })
        })
    }

    render(){

        var blog;
        if(this.state.blogs.length !== 0){
            blog = this.state.blogs.map((blog) => {
                return (
                    <div key={blog.blog_id} className="row col-12 col-md-8 offset-md-1" style={{marginBottom:"30px", borderStyle:"solid", borderRadius:"10px", borderWidth:"1px", borderColor:"#D7D7D7"}}>
                        <div className="col-12 col-md-6 offset-md-3" style={{marginTop: "30px"}}>
                            <p><strong>Title:</strong> {blog.title}</p>
                        </div>
                        <div className="col-12 col-md-6 offset-md-3">
                            <p><strong>Author:</strong> {blog.author}</p>
                        </div>
                        <div className="col-12 col-md-6 offset-md-3">
                            <p><strong>Category:</strong> {blog.category}</p>
                        </div>
                        <div className="col-6 col-md-3 offset-6 offset-md-9 border" style={{borderRadius:"5px", backgroundColor:"#0A304E", height:"40px",width:"100%",paddingTop:"8px", marginBottom:"20px"}}>
                            <center><strong><Link to={{ pathname: `/blogviewer/${blog.blog_id}` , state: { search: this.state.search, category: this.state.category} }} style={{ color: '#FFF' }}> Read</Link></strong></center>
                        </div>
                    </div>
                );
            })
        }
        else if(this.state.search || this.state.category != "NA"){
            blog =(
                    <div className="container">
                        <center><h5 style={{marginTop:"22px", fontFamily:"Arial Black"}}>No Blogs Found</h5></center>
                    </div>
            );
  
        }

        return(
            <div className="container">
                <Row style={{marginTop: "30px"}}>
                    <Col xs={12}>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col sm={12} md={9} className="mr-auto">
                                    <i className="fa fa-search fa-lg icon"></i>
                                    <FormGroup>
                                        <Input id="searchBar" type="text" className="searchBar" name="search" style={{height: "50px", width: "110%", paddingLeft:"50px"}} placeholder="Search.." onChange={this.handleInputChange}/>
                                    </FormGroup>
                                </Col>
                                <Col sm={6} md={2}>
                                    <FormGroup>
                                        <Button type="submit" className="searchButton" style={{backgroundColor:"#0A304E"}}><b><center>Search</center></b></Button>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} md={2}>
                                    <FormGroup>
                                        <select name="category" className="select-list" onChange={this.handleInputChange}>
                                            <option selected value="NA">Category</option>
                                            <option value ="undefined">Undefined</option>
                                        </select> 
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <div className="col-12" style={{marginTop:"22px"}}>
                    <div className="row">
                        {blog}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;