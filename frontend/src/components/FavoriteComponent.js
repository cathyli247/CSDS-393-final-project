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
				pk: 2, 
				author: 'personA',
				title: 'titleA',
				content: 'contentA',
				like: true
				}, 
				{
				pk: 5, 
				author: 'personB',
				title: 'titleB',
				content: 'contentB',
				like: true
				}, 
				{
				pk: 9, 
				author: 'personC',
				title: 'titleC',
				content: 'contentC',
				like: true
				}],
			finallist:[]
		}
		this.handleBan = this.handleBan.bind(this);
	}
	
	componentDidMount() {
		//add check authenticated if-statement
		//fetch(config.serverUrl+this.props.path, {
		fetch(config.serverUrl+'/account/properties', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': "token "+this.props.authenticated
            }
        })
		.then(res => res.json())
		.then(data => {
			if(data.fav_list != null) {
				this.setState({
					blogs: data.fav_list
				});
			}
		})
	}

	//use PUT
	handleBan(deletepk, event){
		event.preventDefault();
		const some = [];
		const newlist = this.state.blogs.map((blog) => {
			if(blog.pk == deletepk){
				//do not push, leave it out
			}
			else{
				some.push(blog);
			}
		});
		this.setState({
			blogs: some
		});
		let databody = {
			"fav_list": this.state.blogs
		}
		fetch(config.serverUrl+'/account/properties/update', {
			method: 'PUT',
			body: JSON.stringify(databody),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			this.props.history.push('/favorite');
		})
	}

	render() {
		if(this.state.blogs == ''){
			this.setState({
				blogs:[{
					pk:-1
				}]
			});
		}
		const blog = this.state.blogs.map((blog) => {
			if(blog.pk == -1){
				return(
					<ListGroupItem>
						<div className="row">
							<div className="col-10">
								<p className="m-0">You haven't liked any blogs yet.</p>
							</div>
						</div>
					</ListGroupItem>
				);
			}
			else{
				return(
					<ListGroupItem>
						<div className="row">
							<div className="col-10">
								<p className="m-0">{blog.author}</p>
								<p className="m-0"><Link to={`/blogviewer/${blog.pk}`}>{blog.title}</Link></p>
							</div>
							<div className="col" onSubmit={(event) => this.handleBan(blog.pk, event)}>
								<Button type="submit" value="submit" style={{background:"rgba(10,48,78,0.41)", fontFamily:"Arial Black",border:"none", borderRadius: "50%"}}>
									<i className="fa fa-ban"></i>
								</Button>
							</div>
						</div>
					</ListGroupItem>
				);
			}
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