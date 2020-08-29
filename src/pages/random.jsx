import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import { navigate } from "@reach/router";
import _ from "lodash";

const Random = ({ data }) => {
  const { distinct } = data.allGoogleSheetListRow;  
  console.log("Total Data = "+distinct.length);
  const randomnumber = Math.round(Math.random() * distinct.length);
  console.log("Generated Random Number = "+randomnumber);
  const randompage = distinct[randomnumber-1] ? distinct[randomnumber-1] : distinct[0];
  const randompageurl = "/police-brutality/"+_.kebabCase(randompage.trim());
  console.log("Random URL = "+randompageurl);
  navigate(randompageurl, { replace: true });

  return (
    <Helmet title={'Random Page'} />
  );

};

export default Random;

export const query = graphql`
  query {
    allGoogleSheetListRow {
      distinct(field: state)
    }
  }
`;
