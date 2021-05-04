import React, { Component } from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import BlogViewer from './BlogViewerComponent';
import MyBlogs from './MyBlogsComponent';
import Favorite from './FavoriteComponent';
import BlogEditor from './BlogEditorComponent';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';

const UsernameContext = React.createContext('');

class Main extends Component{

    constructor(props){
        super(props);
        this.state = { username: '', authenticated: ''};
    }

    onUsernameChange = (username, authenticated) => {
        this.setState({ 
            username: username,
            authenticated: authenticated
        });
    }

    render(){
        return(
            <div>
                <UsernameContext.Provider value={{state: this.state}}>
                    <Header history={this.props.history} onUsernameChange={this.onUsernameChange} username={this.state.username} authenticated={this.state.authenticated}/>
                    <Switch>
                        <Route exact path="/home" component={()=><Home history={this.props.history} location={this.props.location} username={this.state.username} authenticated={this.state.authenticated} onUsernameChange={this.onUsernameChange}/>} />
                        <Route exact path="/post" component={() => <BlogViewer history={this.props.history} location={this.props.location} username={this.state.username} authenticated={this.state.authenticated} />}/>
                        <Route path="/favorite" component={()=><Favorite history={this.props.history} username={this.state.username} authenticated={this.state.authenticated} />} />
                        <Route path="/myBlogs" component={()=><MyBlogs history={this.props.history} username={this.state.username} authenticated={this.state.authenticated} />} />
                        <Route path="/blogEditor" component={()=><BlogEditor history={this.props.history} location={this.props.location} username={this.state.username} authenticated={this.state.authenticated} />} />
                        <Redirect to="/home" />
                    </Switch>
                    <Footer />
                </UsernameContext.Provider>
            </div>
        );
    }

}

export default withRouter(Main);