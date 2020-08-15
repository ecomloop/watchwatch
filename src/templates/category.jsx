import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import ShopList from '../components/ShopList';
import { Layout } from 'layouts';

const CategoryHeading = styled.h1`
  margin-left: 4rem;
`;

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 4rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
`;

const Category = ({ data, pageContext }) => {
  const { category } = pageContext;
  const categoryHeading = category;
  const { edges } = data.allGoogleSheetListRow;

  const maxItems = 9;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const increaseLimit = () => {
    setLimit(limit + maxItems);
  }

  //Now limiting the items as per limit
  const limitedEdges = _.slice(edges, 0, limit)

  return (
    <Layout>
      <Helmet title={categoryHeading} />
      <Header title={categoryHeading}></Header>
      <CategoryHeading>{categoryHeading}</CategoryHeading>
      <CategoryWrapper>
      WatchWatch hundreds of police brutality incidents from {category}
      </CategoryWrapper>
      <CategoryWrapper>
        {limitedEdges.map(({ node },index) => (
          <ShopList
            key={index}
            cover={node.localImageUrl && node.localImageUrl.childImageSharp && node.localImageUrl.childImageSharp.fluid}
            path={`/${node.name}`}
            title={node.name}
            tags={node.tags && node.tags.split(',')}
            excerpt={node.about && node.about.substring(0,40)+"..."}
          />
        ))}
      </CategoryWrapper>
      {showMore && limitedEdges.length > 0 && limitedEdges.length < edges.length &&
        <div className="center">
          <button className="button" onClick={increaseLimit} style={{ cursor: "pointer" }} >
            Load More
            </button>
        </div>
      }
    </Layout>
  );
};

export default Category;

export const query = graphql`
  query($category: String!) {
    allGoogleSheetListRow(filter: {category: {eq: $category}}) {
      edges {
        node {
          date
          name
          category
          tags
          url
          city
          state
          url
          about
          slug
          localImageUrl {
            childImageSharp {
              fluid (srcSetBreakpoints: [200, 400]) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          imageurl
        }
      }

    }
  }
`;
