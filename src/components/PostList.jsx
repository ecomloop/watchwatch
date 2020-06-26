import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import theme from '../../config/theme';

const Wrapper = styled.article`
  display: flex;
  text-decoration: none;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-width: 320px;
  margin-bottom: 2rem;
  position: relative;
  z-index: 100;
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.shadow.feature.small.default};
  transition: ${props => props.theme.transitions.boom.transition};
  flex-basis: calc(99.9% * 1 / 3 - 2.5rem);

  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
    transform: scale(1.04);
  }

  @media (max-width: 1000px) {
    flex-basis: calc(99.9% * 1 / 2 - 1rem);
    max-width: calc(99.9% * 1 / 2 - 1rem);
    width: calc(99.9% * 1 / 2 - 1rem);
    height: 18rem;
  }

  @media (max-width: 700px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    height: 15rem;
  }
`;

const StyledLink = styled(Link)`
  z-index: 3;
  border-radius: ${props => props.theme.borderRadius.default};
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      rgba(0, 0, 0, 0.7) 80%,
      rgba(0, 0, 0, 0.8) 100%
    );
    z-index: -10;
    border-radius: ${theme.borderRadius.default};
    transition: opacity ${theme.transitions.default.duration};
  }
`;


const Title = styled.h2`
  margin: 1rem;
`;

const MainWrapper = styled.article`
  display: flex;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.6) 50%,
      rgba(0, 0, 0, 0.7) 80%,
      rgba(0, 0, 0, 0.8) 100%
    );
  text-decoration: none;
  color: #f5f5f5;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const PostSection = styled.section`
  margin: 1rem;
  width: 90%;

`;

const PostList = ({ cover, path, date, title, excerpt, tweetdata }) => (
  <MainWrapper>
    <Link to={path}>
      <Title>{title}</Title>
    </Link>
    <PostSection
      dangerouslySetInnerHTML={{ __html: tweetdata }}
    />

  </MainWrapper>
);

export default PostList;

PostList.propTypes = {
  cover: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
