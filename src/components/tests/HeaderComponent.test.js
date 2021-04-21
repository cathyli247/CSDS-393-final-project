import React from "react";
import Enzyme , { shallow, mount } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";

import Header from '../HeaderComponent';

Enzyme.configure({ adapter: new Adapter()});

describe('Header component', () => {

    it('toggle Navbar', () => {
        const wrapper = shallow( <Header />);
        expect(wrapper.state('isNavOpen')).toEqual(false);
        wrapper.find('#nav').simulate("click");
        expect(wrapper.state('isNavOpen')).toEqual(true);
    });

    it('toggle Signup modal', () => {
        const wrapper = shallow( <Header />);
        expect(wrapper.state('isModalSignUpOpen')).toEqual(false);
        wrapper.find('#signup').simulate("click");
        expect(wrapper.state('isModalSignUpOpen')).toEqual(true);
    });

    it('toggle Login modal', () => {
        const wrapper = shallow( <Header />);
        expect(wrapper.state('isModalLoginOpen')).toEqual(false);
        wrapper.find('#login').simulate("click");
        expect(wrapper.state('isModalLoginOpen')).toEqual(true);
    });

    it('handle input change - Login', () => {
        const wrapper = shallow( <Header />);
        expect(wrapper.state('username')).toEqual('');
        expect(wrapper.state('password')).toEqual('');
        // wrapper.instance().handleInputChange({target: {name: "username", value: "TooLazy"}});
        wrapper.find('#username1').simulate("change", {target: {name: "username", value: "TooLazy"}});
        wrapper.find('#password1').simulate("change", {target: {name: "password", value: "123456"}});
        expect(wrapper.state("username")).toEqual("TooLazy");
        expect(wrapper.state("password")).toEqual("123456");
    });

    it('handle input change - Signup', () => {
        const wrapper = shallow( <Header />);
        expect(wrapper.state('username')).toEqual('');
        expect(wrapper.state('password')).toEqual('');
        wrapper.find('#username').simulate("change", {target: {name: "username", value: "TooLazy"}});
        wrapper.find('#password').simulate("change", {target: {name: "password", value: "123456"}});
        expect(wrapper.state("username")).toEqual("TooLazy");
        expect(wrapper.state("password")).toEqual("123456");
    });
});