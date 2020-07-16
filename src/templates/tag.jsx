import React from 'react';
import { useStaticQuery, graphql, Link } from "gatsby"
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Layout, Container } from 'layouts';
import { Header, SEO } from 'components';
import PostList from '../components/PostList';
import config from '../../config/site';

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

const Tag = ({ pageContext }) => {
  const { posts, tagName } = pageContext;
  const upperTag = tagName.toUpperCase();
  const title = "" + tagName + "authoritarian acts & police violence incidents"

  const twitterData = useStaticQuery(graphql`
    query TwitterQuery {
      allGoogleSheetListRow(sort: {order: DESC, fields: date}) {
        edges {
          node {
            id
            name
            slug
            fields {
              tweetEmbedData
            }
          }
        }
      }
    }
  `)

  let postIDs = [];
  //getting all IDs from posts
  posts.map(node => {
    postIDs.push(node.id)
  });

  const listEdges = [];
  const rowEdges = twitterData.allGoogleSheetListRow.edges;
  //filtering based of current tags only
  rowEdges.map((edge) => {
    if (postIDs.indexOf(edge.node.id)>=0) {
      listEdges.push(edge);
    }
  })

  return (
    <Layout>
      <SEO
        title={`${upperTag} Police Violence Incidents`}
        description={`see all posts related to ${upperTag} here`}
      />
      <Header title={upperTag} date="police violence incidents in BLM protests">

      </Header>
      <PostsWrapper>
        {listEdges.map(({ node }) => {
          return (
            <PostList
              key={node.name}
              path={`/${node.slug}`}
              title={node.name}
              tweetdata={node.fields && node.fields.tweetEmbedData}
            />
          );
        })}
      </PostsWrapper>

    </Layout>
  );
};

export default Tag;

Tag.propTypes = {
  pageContext: PropTypes.shape({
    posts: PropTypes.array,
    tagName: PropTypes.string,
  }),
};
