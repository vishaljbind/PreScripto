import React from 'react'
import {Header, SpecialityMenu, TopDoctors, Banner} from '../components/index'

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home