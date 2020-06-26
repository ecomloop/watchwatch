import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import CityCount from '../components/CityCount';
import { Layout } from 'layouts';
import _ from 'lodash';
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

const ShopSectionSubHeading = styled.h3`
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

const Index = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  const rowEdges = data.allGoogleSheetListRow.edges;
  const listEdges = [];
  const maxItems = 12;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);

  const { group } = data.citygroup;
  const cityMapDescSorted = _.orderBy(group, ['totalCount'],['desc']).slice(0,10);


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
      <Header title="reject authoritarianism" date="watchwatch documents authoritarian acts & police violence incidents"></Header>


      <div className="search_main">
      <div className="text_main center">




      </div>
        <Search collapse homepage indices={searchIndices} />
      </div>


      <ShopSectionSubHeading>
        Top 10 Cities
      </ShopSectionSubHeading>

      <ShopWrapper style={{marginTop: "0rem", marginLeft: "3.25rem"}}>

        <CityCount list={cityMapDescSorted} />
<a class="button buttonalt" href="/cities">view all cities</a>
      </ShopWrapper>


      <ShopSectionSubHeading>
        Latest incidents

      </ShopSectionSubHeading>
        <div className="text_main center">
      incident numbers refer to <a href="https://twitter.com/greg_doucette/status/1266751520055459847">@greg_doucette's thread</a> of police violence against george floyd protesters
    </div>
      <PostsWrapper>
        {listEdges.map(({ node }) => {
          return (
            <PostList
              key={node.name}
              cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
              path={`/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0, 40) + "..."}
              tweetdata={node.fields && node.fields.tweetEmbedData}
            />
          );
        })}
      </PostsWrapper>
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
                fluid (srcSetBreakpoints: [200, 400])  {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }

    citygroup : allGoogleSheetListRow {
     group(field: city) {
        totalCount
        fieldValue
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
