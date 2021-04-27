import React from "react";
import Enzyme , { shallow, mount } from 'enzyme';
import Adapter from "enzyme-adapter-react-16";

import Home from '../HomeComponent';

Enzyme.configure({ adapter: new Adapter()});

describe('Home component', () => {

    it('handle input change - search bar and category selection', () => {
        const fakeLocation = {state: {search: "NA", category:"NA"}};
        const wrapper = shallow( <Home location={fakeLocation} />);
        expect(wrapper.state('search')).toEqual('NA');
        expect(wrapper.state('category')).toEqual('NA');
        wrapper.find('#searchBar').simulate("change", {target: {name: "search", value: "blog"}});
        wrapper.find('select').simulate("change", {target: {name: "category", value: "travel"}});
        expect(wrapper.state("search")).toEqual("blog");
        expect(wrapper.state("category")).toEqual("travel");
    });

});