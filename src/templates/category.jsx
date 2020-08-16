import React from 'react';
import { graphql } from 'gatsby';
import styled from '@emotion/styled';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Header } from 'components';
import PostList from '../components/PostList';
import { Layout } from 'layouts';
import _ from 'lodash';

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

const PostsWrapper = styled.div`
  display: grid;
  margin: 0 auto;
  width: 90vw;
  grid-gap: 1rem;
  @media (min-width: 501px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
  @media only screen and (max-width: 600px) {
    grid-template-columns: 100%;
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
      <PostsWrapper>
        {limitedEdges.map(({ node },index) => (
          <PostList
              key={index}
              cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
              path={`/case/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0, 40) + "..."}
              tweetdata={node.fields && node.fields.tweetEmbedData}
            />
        ))}
      </PostsWrapper>
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
    allGoogleSheetListRow(sort: {fields: date, order: DESC}, filter: {category: {eq: $category}}) {
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
          fields {
            tweetEmbedData
          }
        }
      }

    }
  }
`;
