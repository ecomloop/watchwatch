import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import { Layout } from 'layouts';
import Search from 'components/search'

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
  const rowEdges = data.allGoogleSheetListRow.edges;
  const listEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const searchIndices = [
    { name: `watchwatch`, title: `incidents`, type: `hit` },
  ]

  const increaseLimit = () => {
      setLimit(limit + maxItems);
  }

  //filtering home and food items maximum to 6 items
  rowEdges.map((edge) => {
    if (edge.node.category && edge.node.category != "" && listEdges.length < limit) {
      listEdges.push(edge);
    }
  })
  if(listEdges.length >= rowEdges.length) setShowMore(false);

  return (
    <Layout>
      <Helmet title={'WatchWatch.org'} />
      <Header title="documenting violence by law enforcement against civilians"></Header>


      <div className="search_main">
        <Search collapse homepage indices={searchIndices} />
      </div>
      <div className="text_main center">
      <p>watchwatch.org documents unnecessary violence by law enforcement officers against civilians</p>
      <p>inspired by the <a href="https://twitter.com/greg_doucette/status/1266751520055459847">massive twitter thread</a> by <a href="https://twitter.com/greg_doucette/">@greg_doucette</a></p>
      <p>data compiled by <a href="https://twitter.com/jasonemiller">@jasonemiiller</a> in a <a href="https://docs.google.com/spreadsheets/d/1YmZeSxpz52qT-10tkCjWOwOGkQqle7Wd1P7ZM1wMW0E/edit#gid=0">google spreadsheet</a></p>
      </div>
      

      <ShopWrapper>

        {listEdges.map(({ node }) => {
          return (
            <PostList
              key={node.name}
              cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
              path={`/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0, 40) + "..."}
            />
          );
        })}
      </ShopWrapper>
      {showMore && listEdges.length > 0 &&
        <div className="center">
            <a className="button" onClick={increaseLimit} style={{cursor: "pointer"}}>
                Load More
            </a>
        </div>
      }
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
      sort: { order: ASC, fields: [frontmatter___date] }
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
                  ...GatsbyImageSharpFluid_tracedSVG
                }
              }
            }
          }
        }
      }
    }

    allGoogleSheetListRow(
      sort: { order: DESC, fields: date }
    )
    {
      edges {
        node {
          date
          name
          url
          slug
          category
          tags
          about
          state
          city
          localImageUrl {
            childImageSharp {
              fluid(
                maxWidth: 1000
                quality: 90
                traceSVG: { color: "#2B2B2F" }
              ) {
                ...GatsbyImageSharpFluid_tracedSVG
              }
            }
          }
          imageurl
        }
      }
    }
  }
`;
