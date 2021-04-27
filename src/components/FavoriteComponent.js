import React, {Component} from 'react';
import {Button, Form, FormGroup, Input, Col, Row, Breadcrumb, BreadcrumbItem, ListGroup, ListGroupItem} from 'reactstrap';
import { Link } from 'react-router-dom';
var config = require('../config');

class Favorite extends Component {
	constructor(props) {
		//username(''), authenticated(bool)
		//this blogs state is just for temp use only, wait for real data from backend
		super(props);
		this.state = {
			blogs:[{
				blogid: 2, 
				author: 'personA',
				title: 'titleA',
				content: 'contentA',
				like: true
				}, 
				{
				blogid: 5, 
				author: 'personB',
				title: 'titleB',
				content: 'contentB',
				like: true
				}, 
				{
				blogid: 9, 
				author: 'personC',
				title: 'titleC',
				content: 'contentC',
				like: true
				}]
		}
		this.handleBan = this.handleBan.bind(this);
	}
	
	componentDidMount() {
		//add check authenticated if-statement
		//fetch(config.serverUrl+this.props.path, {
		fetch(config.serverUrl+'/favorite/:this.props.username', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
		.then(res => res.json())
		.then(data => {
			if(data[0].title != null) {
				this.setState({
					blogs: data
				});
			}
		})
	}

	handleBan(blogid, event){
		event.preventDefault();
		let databody = {
			"ban": blogid,
			"username": this.props.username
		}
		fetch(config.serverUrl+'/favorite/:this.props.username', {
			method: 'DELETE',
			body: JSON.stringify(databody),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(data => {
			if(data.success){
				alert("The blog is successfully delected from your favorite list.");
			}
			else{
				alert("Deletion failed, try again.");
			}
		})
	}

	render() {
		const blog = this.state.blogs.map((blog) => {
			return(
				<ListGroupItem>
					<div className="row">
						<div className="col-10">
							<p className="m-0">{blog.author}</p>
							<p className="m-0"><Link to={`/blogviewer/${blog.blogid}`}>{blog.title}</Link></p>
						</div>
						<div className="col" onSubmit={(event) => this.handleBan(blog.blogid, event)}>
							<Button type="submit" value="submit" style={{background:"rgba(10,48,78,0.41)", fontFamily:"Arial Black",border:"none", borderRadius: "50%"}}>
								<i className="fa fa-ban"></i>
							</Button>
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
						<BreadcrumbItem active>Fav List</BreadcrumbItem>
					</Breadcrumb>
				</div>
				<div className="row list-row-content align-items-center">
					<div className="col-12">
						<ListGroup>
							{blog}
						</ListGroup>
					</div>
				</div>
			</div>
		);
	}
}

export default Favorite;