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
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const PostSectionHeading = styled.h1`
  margin-top: 4rem;
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
  margin-top: 4rem;
`;

const ShopSectionSubHeading = styled.h3`
  margin-top: 4rem;
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
  const maxItems = 15;
  const [limit, setLimit] = React.useState(maxItems);
  const [showMore, setShowMore] = React.useState(true);
  const [open, setOpen] = React.useState(false)

  const { group } = data.citygroup;
  const cityMapDescSorted = _.orderBy(group, ['totalCount'], ['desc']).slice(0, 10);


  const searchIndices = [
    { name: `watchwatch`, title: `incidents`, type: `hit` },
  ]

  const increaseLimit = () => {
    setLimit(limit + maxItems);
    if (
      typeof twttr !== `undefined` &&
      window.twttr.widgets &&
      typeof window.twttr.widgets.load === `function`
    ) {
      console.log("******* reloading tweets")
      window.twttr.widgets.load()
    }
  }

  //filtering home and food items maximum to 6 items
  rowEdges.map((edge) => {
    if (edge.node.category && edge.node.category != "" && listEdges.length < limit) {
      listEdges.push(edge);
    }
  })
  if (listEdges.length >= rowEdges.length) setShowMore(false);

  return (
    <Layout>
      <Helmet title={'WatchWatch Police Brutality Cases | Police Violence '} />
      <Header title="WatchWatch Police Brutality Cases" date=""></Header>


      <div className="search_main">
        <div className="text_main center">




        </div>
        <Search collapse homepage indices={searchIndices} />
      </div>
      <ShopSectionSubHeading style={{ marginTop: "5rem", 'text-align': "center" }}>
        Police brutality cases are widespread.<br/>
      </ShopSectionSubHeading>
      <ShopWrapper style={{ margin: "1rem auto", 'text-align': "center", width:"67%", display: "block" }}>
      WatchWatch documents hundreds of cases of police violence and law enformcement brutality.
      </ShopWrapper>

        <ShopWrapper style={{ margin: "3rem auto", 'text-align': "center", width:"67%", display: "block" }}>
      <a href="/random" className="button ">WatchWatch a police brutality case</a><div></div>
      <a className="button buttonalt" href="javascript:void(0)" onClick={() => setOpen(true)}>
        Help end police Violence
      </a>
      <Modal open={open} onClose={() => setOpen(false)} center>
        <h3>Police brutality cases are widespread!<br/>Help end police violence.</h3>

        <p>
          <strong>Color Of Change</strong> helps you do something real about injustice. They design campaigns powerful enough to end practices that unfairly hold Black people back, and champion solutions that move us all forward. Until justice is real.
        </p>
        <a target="_blank" href="https://colorofchange.org/" rel="noopener noreferrer" className="button">Support Color of Change</a>
        <p>
          <strong>Fair Fight</strong> workds to promote fair elections across the country. Voting is the bedrock on which our community’s future and your ambitions are built. Join the fight to ensure access to democracy for all.
        </p>
        <a target="_blank" href="https://fairfight.com/" rel="noopener noreferrer" className="button">Support Fair Fight</a>
      </Modal>
      </ShopWrapper>



      <ShopSectionSubHeading style={{ margin: "8rem 0 0 0", 'text-align': "center", }}>
        WatchWatch police brutality cases from <a href="/category/george-floyd-protests/">George Floyd protests</a>

      </ShopSectionSubHeading>
      <div className="text_main center">
        incident numbers refer to <a href="https://twitter.com/greg_doucette/status/1266751520055459847">@greg_doucette's thread</a> of police brutality incidents
    </div>
      <PostsWrapper>
        {listEdges.map(({ node }) => {
          return (
            <PostList
              key={node.name}
              cover={node.localImageUrl && node.localImageUrl.childImageSharp.fluid}
              path={`/case/${node.slug}`}
              title={node.name}
              excerpt={node.about && node.about.substring(0, 40) + "..."}
              tweetdata={node.fields && node.fields.tweetEmbedData}
            />
          );
        })}
      </PostsWrapper>
      {showMore && listEdges.length > 0 &&
        <div className="center">
          <button className="button" onClick={increaseLimit} style={{ cursor: "pointer" }}>
            Load More
            </button>
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
