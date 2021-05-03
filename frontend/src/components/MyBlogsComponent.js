import Home from './HomeComponent';
import React, {Component} from 'react';
import {Button, Form, FormGroup, Input, Col, Row, Breadcrumb, BreadcrumbItem, ListGroup, ListGroupItem} from 'reactstrap';
import { Link} from 'react-router-dom';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
var config = require('../config');

class MyBlogs extends Component {
	constructor(props) {
		super(props);
		this.state ={
			blogs:[{
				pk: 0, 
				title: 'titleA',
				category: 'Travel'
				}, 
				{
				pk: 1, 
				title: 'titleB',
				category: 'Fashion'
				}, 
				{
				pk: 2, 
				title: 'titleC',
				category: 'Fashion'
				}]
		}
	}

	componentDidMount() {
		//add check authenticated if-statement
		//if no post, data is an empty list
		//fetch(config.serverUrl+this.props.path, {
		fetch(config.serverUrl+'/post/list', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				AUTHORIZATION: "JWT "+this.props.authenticated
			},
			params: {
				'search': this.props.username
			}
		})
		.then(res => res.json())
		.then(data => {
			if(data[0] != null) {
				this.setState({
					blogs: data
				});
			}
			else{
				console.log(data);
			}
		})

	}

	render() {
		const blog = this.state.blogs.map((blog) => {
			return(
				<ListGroupItem>
					<div className="row">
						<div className="col-10">
							<p className="m-0">{blog.category}</p>
							<p className="m-0"><Link to={`/blogviewer/${blog.blogid}`}>{blog.title}</Link></p>
						</div>
						<div className="col">
							<Link to={`/blogEditor/${blog.blogid}`} className="btn" 
								style={{background:"rgba(10,48,78,0.42)", fontFamily:"Arial Black",border:"none", borderRadius: "50%"}}>
								<i className="fa fa-pencil"></i>
							</Link>
						</div>
					</div>
				</ListGroupItem>
			);
		});
		
		return(
			<div className="container">
				<div className="row">
					<Breadcrumb>
						<BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
						<BreadcrumbItem active>My Blogs</BreadcrumbItem>
					</Breadcrumb>
				</div>
				<div className="row bloglist-row-content align-items-center">
					<div className="col-12">
						<ListGroup>
							{blog}
						</ListGroup>
					</div>
				</div>
				<div className="row row-content">
					<div className="col-8">
					</div>
					<div className="col">
						<Button><Link to='/blogEditor' style={{color: '#fff'}}>Create a new blog</Link></Button>
					</div>
				</div>
			</div>
		);
	}

}

export default MyBlogs;