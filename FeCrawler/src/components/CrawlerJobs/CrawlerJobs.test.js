import React from 'react';
import { shallow } from 'enzyme';
import CrawlerJobs from './CrawlerJobs';

describe('CrawlerJobs', () => {
  test('matches snapshot', () => {
    const wrapper = shallow(<CrawlerJobs />);
    expect(wrapper).toMatchSnapshot();
  });
});
