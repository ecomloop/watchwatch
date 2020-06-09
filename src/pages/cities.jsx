import React from 'react';
import { Link, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header } from 'components';
import CityCount from '../components/CityCount';
import { Layout } from 'layouts';
import _ from 'lodash';

const Cities = ({ data }) => {
  const { group } = data.allGoogleSheetListRow;
  let cityMapDescSorted = _.orderBy(group, ['totalCount'],['desc']);
  
  return (
    <Layout>
      <Helmet title={''} />
      <Header title=""></Header>
      <CityCount list={cityMapDescSorted} />
    </Layout>
  );
};

export default Cities;

export const query = graphql`
  query {
    allGoogleSheetListRow {
     group(field: city) {
        totalCount
        fieldValue
      }
    }
  }
`;
