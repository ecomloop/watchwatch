import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import { Layout } from 'layouts';

const PostSectionHeading = styled.h1`
  margin-left: 4rem;
`;

const PostWrapper = styled.div`
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

const ShopSectionHeading = styled.h1`
  margin-left: 4rem;
`;

const ShopWrapper = styled.div`
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

const Index = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  const shopEdges = data.allGoogleSheetListRow.edges;
  const shopHomeEdges = data.allGoogleSheetListRow.edges;

  return (
    <Layout>
      <Helmet title={'uncommonry'} />
      <Header title="Discover & Shop Independent Businesses">🧐 Discover exceptional retailers & independent brands<br/>🛒 Shop direct to support innovative small businesses</Header>
      <ShopSectionHeading>Food</ShopSectionHeading>
      <ShopWrapper>
        {shopEdges.map(({ node }) => {
          return (
            <PostList
              key={node.name}
              cover={node.localImageUrl.childImageSharp.fluid}
              path={`/shops/${node.name}`}
              title={node.name}
              excerpt={node.about.substring(0,40)+"..."}
            />
          );
        })}
      </ShopWrapper>

      <ShopSectionHeading>Home</ShopSectionHeading>
      <ShopWrapper>
        {shopHomeEdges.map(({ node }) => {
          return (
            <PostList
              key={node.name}
              cover={node.localImageUrl.childImageSharp.fluid}
              path={`/shops/${node.name}`}
              title={node.name}
              excerpt={node.about.substring(0,40)+"..."}
            />
          );
        })}
      </ShopWrapper>


      <PostSectionHeading>Posts</PostSectionHeading>
      <PostWrapper>
        {edges.map(({ node }) => {
          const { id, excerpt, frontmatter } = node;
          const { cover, path, title, date } = frontmatter;
          return (
            <PostList
              key={id}
              cover={cover.childImageSharp.fluid}
              path={path}
              title={title}
              date={date}
              excerpt={excerpt}
            />
          );
        })}
      </PostWrapper>


    </Layout>
  );
};

export default Index;

Index.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            excerpt: PropTypes.string,
            frontmatter: PropTypes.shape({
              cover: PropTypes.object.isRequired,
              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              date: PropTypes.string.isRequired,
              tags: PropTypes.array,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
};

export const query = graphql`
  query {
    allMarkdownRemark(
      limit: 6
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 75)
          frontmatter {
            title
            path
            tags
            date(formatString: "MM.DD.YYYY")
            cover {
              childImageSharp {
                fluid(
                  maxWidth: 1000
                  quality: 90
                  traceSVG: { color: "#2B2B2F" }
                ) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
        }
      }
    }

    allGoogleSheetListRow(filter: {category: {eq: "Food"}}, limit: 3) {
      edges {
        node {
          name
          url
          category
          tags
          sociallink
          about
          country
          state
          city
          localImageUrl {
            childImageSharp {
              fluid(
                maxWidth: 1000
                quality: 90
                traceSVG: { color: "#2B2B2F" }
              ) {
                ...GatsbyImageSharpFluid_withWebp_tracedSVG
              }
            }
          }
          imageurl
        }
      }
    }
  }
`;
