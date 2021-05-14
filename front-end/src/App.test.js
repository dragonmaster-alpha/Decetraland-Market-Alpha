import React from 'react'
import { shallow } from 'enzyme/build'
import App from './App'
import Home from './views/home/Home.js'


it('mounts App without crashing', () => {
  const wrapper = shallow(<App/>)
  wrapper.unmount()
})

it('mounts Home without crashing', () => {
  const wrapper = shallow(<Home/>)
  wrapper.unmount()
})
