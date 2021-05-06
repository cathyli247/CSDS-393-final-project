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
			blogcategory:'beauty',
			blogcontent:'',
			commentdeletePK:'',
			blogcomments:[{
				pk: 0, 
				content: 'commentA',
				username: 'userA',
				post: 11
				}, 
				{
				pk: 1, 
				content: 'commentB',
				username: 'userB',
				post: 11
				}, 
				{
				pk: 2, 
				content: 'commentC',
				username: 'userB',
				post: 11
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
		this.deletecertaincomment = this.deletecertaincomment.bind(this);
	}

	componentDidMount() {
		var sentence = this.props.location.state.blogid;
		//alert("pathname :"+sentence + " type="+ typeof sentence);
		if(typeof sentence == "undefined"){
			//alert("this is an empty Editor for creating new blog");
			this.setState({
				blogcomments: []
			});
		}
		else{
			//alert("pk is "+sentence);
			fetch(config.serverUrl+"/post/"+sentence+"/", {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'token '+this.props.authenticated
				}
			})
			.then(res => res.json())
			.then(data => {
				//alert(JSON.stringify(data));
				this.setState({
					blogid: data.pk,
					blogtitle: data.title,
					blogcategory: data.category,
					blogcontent: data.content
				});
				if(this.props.authenticated){
					fetch(config.serverUrl+"/comment/list?search="+sentence, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': "token "+this.props.authenticated
						}
					})
					.then(res1 => res1.json())
					.then(data1 => {
						//alert(JSON.stringify(data1));
						if(data1 != null) {
							this.setState({
								blogcomments: data1
							});
						}
						else{
							this.setState({
								blogcomments: []
							});
						}
						
					})
				}
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
		//delete the post
		e.preventDefault();
		//new=>MyBlogs; posted=>fetch delete
		if(this.state.blogid == '') {
			//redirect to /myBlogs
			//alert("delete new blog");
			this.props.history.push('/myBlogs');
		}
		else {
			var sen = this.props.location.state.blogid;
			//alert("now pk= "+sen);
			fetch(config.serverUrl+"/post/"+sen+"/delete", {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'token '+this.props.authenticated
				}
			})
			.then(res => res.json())
			.then(data => {
				//alert(JSON.stringify(data));
				this.props.history.push('/myBlogs');
			})
		}
	}

	handleSave(event) {
		//save the post
		event.preventDefault();
		//then fetch either post or put
		if(this.state.blogid == ''){//fetch post
			//alert("now: "+this.props.authenticated);
			let databody = {
				'title': this.state.blogtitle,
				'content': this.state.blogcontent,
				'category': this.state.blogcategory
			}
			fetch(config.serverUrl+"/post/create", {
				method: 'POST',
				body: JSON.stringify(databody),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'token '+this.props.authenticated
				}
			})
			.then(res => res.json())
			.then(data => {
				//alert("data is: "+JSON.stringify(data));
				this.props.history.push('/myBlogs');
			})
		}
		else{//fetch put
			//alert("now is fetch put for updating blog");
			var sent2 = this.props.location.state.blogid;
			//alert(sent2);
			let databody = {
				"title": this.state.blogtitle,
				"content": this.state.blogcontent,
				"category": this.state.blogcategory
			}
			fetch(config.serverUrl+"/post/"+sent2+"/update", {
				method: 'PUT',
				body: JSON.stringify(databody),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'token '+this.props.authenticated
				},
				params: {
					"title": this.state.blogtitle,
					"content": this.state.blogcontent,
					"category": this.state.blogcategory
				}
			})
			.then(res => res.json())
			.then(data => {
				console.log(data);
				this.props.history.push('/myBlogs');
			})
		}
	}

	handleComment(comment, event) {
		var sent2 = this.props.location.state.blogid;
		//handle comment delete
		event.preventDefault();
		if(typeof sent2 == "undefined") {
			//no delete buttons
			//alert("type undefined");
		}
		else {
			//alert("comment pk="+this.state.commentdeletePK);
			//fetch(config.serverUrl+"/comment/"+this.state.commentdeletePK+"/delete",
			fetch(config.serverUrl+"/comment/"+this.state.commentdeletePK+"/delete", {
				method: 'DELETE',
				header: {
					'Content-Type': 'application/json',
					'Authorization': 'token '+this.props.authenticated
				}
			})
			.then(res => res.json())
			.then(data => {
				//alert(JSON.stringify(data));
				//alert(this.props.authenticated);
				var newcommentlist = [];
				for(var i=0; i<this.state.blogcomments.length; i++){
					if(this.state.blogcomments[i].pk != this.state.commentdeletePK){
						newcommentlist.push(this.state.blogcomments[i]);
					}
				}
				this.setState({
					blogcomments: newcommentlist,
					commentdeletePK:''
				});
			})
		}
	}

	handleBlur = (field) => (evt) => {
		this.setState({
			touched: { ...this.state.touched, [field]: true }
		});
	}

	deletecertaincomment(event, commentpk){
		//alert("commentpk="+commentpk);
		this.setState({
			commentdeletePK: commentpk
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
									<p className="m-0">{comment.username}</p>
									<p className="m-0">{comment.content}</p>
								</div>
								<div className="col-auto">
									<Button onClick={(e)=>this.deletecertaincomment(e, comment.pk)} id={comment.pk} type="submit" value="submit" color="danger">Delete</Button>
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
									<select name="blogcategory" className="select-list" onChange={this.handleInputChange}>
										<option value ="beauty">Beauty</option>
										<option value ="travel">Travel</option>
										<option value ="food">Food</option>
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
									<Button type="submit" value="submit" color="danger">Delete</Button>
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