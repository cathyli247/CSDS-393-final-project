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
			favlistpk:[],
			blogs:[],
			finallist:[]
		}
		this.handleBan = this.handleBan.bind(this);
	}
	
	componentDidMount() {
		//add check authenticated if-statement
		//fetch(config.serverUrl+this.props.path, {
		//alert("now: "+this.props.authenticated);
		fetch(config.serverUrl+'/account/properties', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
				'Authorization': "token "+this.props.authenticated
            }
        })
		.then(res => res.json())
		.then(data => {
			//alert(JSON.stringify(data));
			if(data.detail == "Invalid token header. No credentials provided."){
				alert("Please login first.");
				this.props.history.push('/home');
			}
			else{
				if(data.fav_list != "[]") {
					//alert("fav_list is not []");
					var somesentence = data.fav_list.replace("[","").replace("]","").split(",");
					//var some2 = somesentence.match(/\d+/g);
					//alert("fav_list is not [] but: "+ somesentence + "and" +typeof somesentence);
					this.setState({
						favlistpk: somesentence
					});
					//alert(this.state.favlistpk[0]);
					var somelist = [];
					for(var i=0; i<this.state.favlistpk.length; i++){
						var favpk = this.state.favlistpk[i]
						fetch(config.serverUrl+'/post/'+favpk+'/', {
							method: 'GET',
							header: {
								'Content-Type': 'application/json',
								'Authorization': "token "+this.props.authenticated
							}
						})
						.then(res2 => res2.json())
						.then(data2 => {
							//alert(JSON.stringify(data2));
							somelist.push(data2);
							this.setState({
								blogs: somelist
							});
							//alert("somelist="+JSON.stringify(somelist));
						})
					}
					/**alert("final somelist="+somelist);
					this.setState({
						blogs: somelist
					});*/
				}
				else if(data.fav_list == "[]"){
					//alert("fav_list == '[]'");
					this.setState({
						blogs: []
					});
				}
				else{
					alert(JSON.stringify(data.fav_list));
				}
			}

		})
	}

	//use PUT
	handleBan(event, deletepk){
		event.preventDefault();
		var some = [];
		for(var i=0; i<this.state.blogs.length; i++){
			if(this.state.blogs[i].pk == deletepk){
				//do not push, leave it out
			}
			else{
				some.push(this.state.blogs[i].pk);
			}
		}
		this.setState({
			favlistpk: some
		});
		//alert("["+some.toString()+"]");
		let databody = {
			"fav_list": "["+some.toString()+"]"
		}
		fetch(config.serverUrl+'/account/properties/update', {
			method: 'PUT',
			body: JSON.stringify(databody),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'token '+this.props.authenticated
			}
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			this.props.history.push('/favorite');
		})
	}

	render() {
		if(this.state.blogs.length == 0){
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
								<p className="m-0"><Link to={{ pathname: '/post' , state: { search: '', id: blog.pk} }}>{blog.title}</Link></p>
							</div>
							<div className="col">
								<Button onClick={(event) => this.handleBan(event, blog.pk)} type="submit" value="submit" style={{background:"rgba(10,48,78,0.41)", fontFamily:"Arial Black",border:"none", borderRadius: "50%"}}>
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