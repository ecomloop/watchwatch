import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const About = center => (
  <Layout>
    <Helmet title={'about'} />
    <Header title="about"></Header>
    <Container center={center}>
  <p>watchwatch.org documents unnecessary violence by law enforcement officers against civilians</p>
  <p>inspired by <a href="https://twitter.com/greg_doucette/">@greg_doucette</a>'s twitter <a href="https://twitter.com/greg_doucette/status/1266751520055459847">thread of hundreds of incidents</a></p>
  <p>data compiled by <a href="https://twitter.com/jasonemiller">@jasonemiiller</a> in a <a href="https://docs.google.com/spreadsheets/d/1YmZeSxpz52qT-10tkCjWOwOGkQqle7Wd1P7ZM1wMW0E/edit#gid=0">shareable spreadsheet</a></p>
    <p className="madeby"><a href="https://ecomloop.com" target="_blank">built by ecomloop in </a></p>
    </Container>
  </Layout>
);

export default About;

About.propTypes = {
  center: PropTypes.object,
};
