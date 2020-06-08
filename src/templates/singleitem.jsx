import React from 'react';
import { graphql, Link } from 'gatsby';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
import '../styles/prism';

const SuggestionBar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background: ${props => props.theme.colors.white.dark};
  box-shadow: ${props => props.theme.shadow.suggestion};
`;
const PostSuggestion = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 3rem 0 3rem;
  @media (max-width: 600px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

const Title = styled.h1`
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 1rem;
  }
`;

const Subtitle = styled.h5`
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.7rem;
  }
`;

const Statistics = styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.colors.white.grey};
  margin-bottom: 15px;
  padding: 5px;
`;

const StatisticItem = styled.div`
  margin-right: 40px;
  @media (max-width: ${props => props.theme.breakpoints.s}) {
    font-size: 0.6rem;
    margin-right: 10px;
  }
`;

const StatisticIcon = styled.img`
  width: 30px;
  margin-left: 7px;
  margin-top: 5px;
`;

const twitterStyles = css`
blockquote.twitter-tweet {
  display: inline-block;
  font-family: "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif;
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
  border-color: #eee #ddd #bbb;
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  margin: 10px 5px;
  padding: 0 16px 16px 16px;
  max-width: 468px;
}

blockquote.twitter-tweet p {
  font-size: 16px;
  font-weight: normal;
  line-height: 20px;
}

blockquote.twitter-tweet a {
  color: inherit;
  font-weight: normal;
  text-decoration: none;
  outline: 0 none;
}

blockquote.twitter-tweet a:hover,
blockquote.twitter-tweet a:focus {
  text-decoration: underline;
}
`

const SingleItem = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const { name, date, slug, imageurl, url, fields, mediafile, category, tags, localImageUrl, about, state, city } = data.googleSheetListRow

  //converting comma seperated tags to tags map
  const tagsList = tags ? tags.split(',') : [];
  const image = localImageUrl ? localImageUrl.childImageSharp.fluid : null;

  return (
    <Layout>
      <SEO
        title={name}
        description={about || ' '}
        banner={image}
        pathname={url}
      />
      <Header title={name} />
      <Container>
        <div style={{ display: "flex" }}>

          <div>
            <Title>{name}</Title>
            <Subtitle>{city}, {state}</Subtitle>
          </div>
        </div>
        <TagsBlock list={tagsList || []} />

        <Content input={fields.youtubeEmbedData} /><br />
        <Content input={about} /><br />
        <Content input={fields.tweetEmbedData} /><br />

         <a href="/random" className="button ">See another incident</a> <a target="_blank" href={url} className="button buttonalt">View on Twitter</a>
{/*<Content input={about} /><br />  */}
      </Container>
      <SuggestionBar>
        <PostSuggestion>
          {prev && (
            <Link to={`/${prev.slug}`}>
              <h4>Previous</h4>
              <p>{prev.name}</p>
            </Link>
          )}
        </PostSuggestion>
        <PostSuggestion>
          {next && (
            <Link to={`/${next.slug}`}>
              <h4>Next</h4>
              <p>{next.name}</p>
            </Link>
          )}
        </PostSuggestion>
      </SuggestionBar>
    </Layout>
  );
};

export default SingleItem;

export const query = graphql`
  query($pathSlug: String!) {
    googleSheetListRow(slug: {eq: $pathSlug}) {
      id
      name
      date
      city
      state
      url
      fields {
        tweetEmbedData
        youtubeEmbedData
      }
      mediafile
      youtube_link
      tags
      about
      slug
      imageurl
      category
    }
  }
`;
