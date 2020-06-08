import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import { Layout, Container } from 'layouts';

const Submit = () => (
  <Layout>
    <Helmet title={'contact'} />
    <Header title="contact"></Header>
    <Container center={{center:"true"}}>
    <form id="submit_shop" action="/success" method="post" role="form" data-netlify="true" data-netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="submit_shop" />
    <br/>All entries are manually reviewed. <br/><br/>

    <div className="pair"><label><input type="text" name="name" placeholder="Your name" required /></label></div>
    <div className="pair"><label><input type="email" name="email" placeholder="hello@example.com" required /></label></div>
    <div className="pair"><label><input type="text" placeholder="location" name="location" required /></label></div>
    <div className="pair"><label><input type="text" placeholder="link" name="twitter link" required /></label></div>
    <div className="pair"><label><input type="text" placeholder="video link" name="video link" required /></label></div>
    <div className="pair"><label><textarea name="message" placeholder="Description" required></textarea></label></div>
    <input type="submit" value="Submit" />
</form>
    </Container>
  </Layout>
);

export default Submit;

Submit.propTypes = {
  center: PropTypes.object,
};
