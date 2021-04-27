import React, { Component } from 'react';

class Footer extends Component{
	constructor(props){
		super(props);
	}

	render() {
		return(
			<div className="footer">
                <div className="container">
                    <div className="row justify-content-center">             
                        <div className="col-4 col-sm-2">
                            <h5 className="offset-4">Contact</h5>
                            <p className="m-0">pxh257@case.edu</p>
                            <p className="m-0">txd172@case.edu</p>
                            <p className="m-0">qxl216@case.edu</p>
                            <p className="m-0">sxl1350@case.edu</p>
                        </div>
                        <div className="col col-sm">
                        </div>
                    </div>
                    <div className="row justify-content-center">             
                        <div className="col-auto">
                            <p className="m-0">© Copyright 2021 CSDS393 Group 3</p>
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}

export default Footer;