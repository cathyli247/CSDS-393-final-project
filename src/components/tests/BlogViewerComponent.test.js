import React from "react";
import Enzyme , { shallow, mount } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";

import BlogViewer from '../BlogViewerComponent';

Enzyme.configure({ adapter: new Adapter()});

describe('BlogViewer component', () => {

    it('toggle modal for comment posting', () => {
        const fakeLocation = {state: {search: "NA", category:"NA"}};
        const wrapper = shallow( <BlogViewer location={fakeLocation} />);
        expect(wrapper.state('isModalOpen')).toEqual(false);
        wrapper.find('#post').simulate("click");
        expect(wrapper.state('isModalOpen')).toEqual(true);
    });

    it('handle input change - modal for comment posting', () => {
        const fakeLocation = {state: {search: "NA", category:"NA"}};
        const wrapper = shallow( <BlogViewer location={fakeLocation} />);
        expect(wrapper.state('newComment')).toEqual('');
        expect(wrapper.state('touched').newComment).toEqual(false);
        wrapper.find('#newComment').simulate("change", {target: {name: "newComment", value: "Nice!"}});
        wrapper.find('#newComment').simulate("blur", 'newComment');
        expect(wrapper.state("newComment")).toEqual("Nice!");
        expect(wrapper.state('touched').newComment).toEqual(true);
    });

    it('validate new comment posted', () => {
        const fakeLocation = {state: {search: "NA", category:"NA"}};
        const wrapper = shallow( <BlogViewer location={fakeLocation} />);
        const newComment1 = '';
        const newComment2 = 'Good!';

        let errors = wrapper.instance().validate(newComment1);
        expect(errors.newComment).toEqual('');

        wrapper.instance().setState({touched: {newComment: true}});
        expect(wrapper.state('touched').newComment).toEqual(true);
        errors = wrapper.instance().validate(newComment1);
        expect(errors.newComment).toEqual('Comment is required');

        errors = wrapper.instance().validate(newComment2);
        expect(errors.newComment).toEqual('');
    });

});