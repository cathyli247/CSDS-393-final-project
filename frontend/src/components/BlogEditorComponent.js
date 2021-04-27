import React, {Component} from 'react';
import {Button, Form, FormGroup, FormFeedback, Input, Col, Row, ListGroup, ListGroupItem} from 'reactstrap';
import { Link} from 'react-router-dom';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
var config = require('../config');

class BlogEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			blogid: '',
			blogtitle:'',
			blogcategory:'NA',
			blogcontent:'',
			blogcomments:[{
				id: 0, 
				commentname: 'userA',
				description: 'commentA'
				}, 
				{
				id: 1, 
				commentname: 'userB',
				description: 'commentB'
				}, 
				{
				id: 2, 
				commentname: 'userB',
				description: 'commentC'
				}],
			failedBlogDelete:false,
			failedCommentDelete:false,
			touched: {
				blogtitle: false,
				blogcontent: false
			}
		}
		this.handleDelete = this.handleDelete.bind(this);
		this.handleComment = this.handleComment.bind(this);
		this.handleSave = this.handleSave.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
	}

	componentDidMount() {
		if(this.props.location.pathname == "/blogEditor"){
			//alert("this is an empty Editor for creating new blog");
			this.setState({
				blogcomments: []
			});
		}
		else{
			fetch(config.serverUrl+this.props.location.pathname, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(res => res.json())
			.then(data => {
				this.setState({
					blogit: data.blog_id,
					blogtitle: data.title,
					blogcategory: data.category,
					blogcontent: data.blog_content,
					blogcomments: data.comments
				})
			})
		}
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	handleDelete(e) {
		e.preventDefault();
		//new=>MyBlogs; posted=>fetch delete
		if(this.props.location.pathname == '/BlogEditor') {
			//redirect to /myBlogs
			//<Redirect to="/home" />
		}
		else {
			fetch(config.serverUrl+this.props.location.pathname, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(res => res.json())
			.then(data => console.log(data))
		}
	}

	handleSave(event) {
		event.preventDefault();
		//then fetch either post or put
		if(this.props.location.pathname == '/blogEditor'){//fetch post
			let databody = {
				"title": this.state.blogtitle,
				"category": this.state.blogcategory,
				"content": this.state.blogcontent,
				"comments": this.state.blogcomments
			}
			fetch(config.serverUrl+this.props.location.pathname, {
				method: 'POST',
				body: JSON.stringify(databody),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(res => res.json())
			.then(data => console.log(data))
		}
		else{//fetch put
			let databody = {
				"title": this.state.blogtitle,
				"category": this.state.blogcategory,
				"content": this.state.blogcontent,
				"comments": this.state.blogcomments
			}
			fetch(config.serverUrl+this.props.location.pathname, {
				method: 'PUT',
				body: JSON.stringify(databody),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(res => res.json())
			.then(data => {
				if(data.success){
					alert("Successfully update the blog");
				}
				else{
					alert(JSON.stringify(data.msg));
				}
			})
		}
	}

	handleComment(comment, event) {
		event.preventDefault();
		if(this.props.location.pathname == '/BlogEditor') {
			//no delete buttons
		}
		else {
			//tell backend which comment to delete
			let databody = {
				"blog_id": this.state.blogid,
				"tobeDelete": true,
				"comment_content": comment
			}
			fetch(config.serverUrl+this.props.location.pathname, {//fetch put
				method: 'PUT',
				body: JSON.stringify(databody),
				header: {
					'Content-Type': 'application/json'
				}
			})
			.then(res => res.json())
			.then(data => {
				if(data.success) alert("Successfully deleted that comment");
                else
                    alert(JSON.stringify(data.msg));
			})
		}
	}

	handleBlur = (field) => (evt) => {
		this.setState({
			touched: { ...this.state.touched, [field]: true }
		});
	}

	validate(blogtitle, blogcontent) {
		const errors = {
			blogtitle: '',
            blogcontent: ''
		};

		if(this.state.touched.blogtitle && blogtitle.length == 0)
            errors.blogtitle = "Blog title should not be empty";
        else if(this.state.touched.blogtitle && blogtitle.length > 50)
            errors.blogtitle = "Blog title should be <= 50 characters";

		if(this.state.touched.blogcontent && blogcontent.length == 0)
            errors.blogcontent = "Blog content should not be empty";

		return errors;
	}

	renderComment(comments) {
		if(this.state.blogcomments == '') {
			return(
				<p style={{color: '#989898'}} className="mt-4">No Comments</p>
				
			);
		}
		else{
		//<Form onSubmit={(event) => this.handleComment(event)}>
			const comment = comments.map((comment) => {
				return(
					<ListGroupItem>
						<Form onSubmit={(event) => this.handleComment(comment, event)}>
							<Row>
								<div className="col-10">
									<p className="m-0">{comment.commentname}</p>
									<p className="m-0">{this.props.location.pathname}</p>
								</div>
								<div className="col-auto">
									<Button type="submit" value="submit" color="danger">Delete</Button>
								</div>
							</Row>
						</Form>
					</ListGroupItem>
				);
			});
			return comment
		}
	}

	render() {
		const errors = this.validate(this.state.blogtitle, this.state.blogcontent);
		return(
			<div className="container">
				<div className="row row-content">
					<div className="col-12">
						<Form onSubmit={this.handleSave}>
							<FormGroup row>
								<Col>
									<Input type="text" id="blogtitle" name="blogtitle" 
										placeholder="<blog_title>" value={this.state.blogtitle}
										valid={errors.blogtitle === ''} 
										invalid={errors.blogtitle !== ''} 
										onChange={this.handleInputChange} 
										onBlur={this.handleBlur('blogtitle')} />
									<FormFeedback>{errors.blogtitle}</FormFeedback>
								</Col>
							</FormGroup>
							<FormGroup row>
								<Col sm={12} md={2}>
									<select  name="category" className="select-list" onChange={this.handleInputChange}>
										<option value="NA" disabled="disabled">Category</option>
                                        <option value ="travel">Travel</option>
										<option value ="beauty">Beauty</option>
									</select>
								</Col>
							</FormGroup>
							<FormGroup row>
								<Col>
									<Input type="textarea" id="blogcontent" name="blogcontent" 
										placeholder="<blog_title>" value={this.state.blogcontent}
										rows="12" valid={errors.blogcontent === ''} 
										invalid={errors.blogcontent !== ''} 
										onChange={this.handleInputChange} 
										onBlur={this.handleBlur('blogcontent')} />
									<FormFeedback>{errors.blogcontent}</FormFeedback>
								</Col>
							</FormGroup>
							<FormGroup row>
								<Col xs="5"></Col>
								<Col xs="2" sm="3" md="4">
									<Button type="submit" value="submit" color="primary">Save</Button>
								</Col>
							</FormGroup>
						</Form>
						<Form  onSubmit={(event) => this.handleDelete(event)}>
							<FormGroup row>
								<Col xs="5"></Col>
								<Col xs="2" sm="3" md="4"></Col>
								<Col>
									<Link to={`/myBlogs/${this.props.username}`} className="btn btn-secondary">Cancel</Link>
									<Link to={`/myBlogs/${this.props.username}`}>
										<Button type="submit" value="submit" color="danger">Delete</Button>
									</Link>
								</Col>
							</FormGroup>
						</Form>
					</div>
				</div>
				<div className="row comment-row-content">
					<Col>
						<h4>Comments</h4>
						<ListGroup>
							{this.renderComment(this.state.blogcomments)}
						</ListGroup>
					</Col>
				</div>
			</div>
		);
	}
}

export default BlogEditor;