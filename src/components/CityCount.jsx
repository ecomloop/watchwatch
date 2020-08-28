import React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import _ from 'lodash';

const TagsContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  a {
    margin: 0 0.75rem 1rem 0.75rem;
    color: ${props => props.theme.colors.black.blue};
    padding: 0.3rem 0.6rem;
    background: ${props => props.theme.colors.white.grey};
    border-radius: 10px;
    &:hover {
      color: ${props => props.theme.colors.white.light};
      background: ${props => props.theme.colors.primary.light};
      border: ${props => props.theme.colors.primary.light};
    }
    .count {
        color: ${props => props.theme.colors.white.light};
        background: ${props => props.theme.colors.primary.light};
        border-radius: 10px;
        padding: 5px;
    }
  }
`;

const CityCount = ({ list }) => (
  <TagsContainer>
    {list &&
      list.map(item => {
        const upperTag = item.fieldValue.charAt(0).toUpperCase() + item.fieldValue.slice(1);
        return (
          <Link key={item.fieldValue} to={`/police-brutality/${_.kebabCase(item.fieldValue.trim())}`}>
            <span>{upperTag} - </span><span className="count">{item.totalCount}</span>
          </Link>
        );
      })}
  </TagsContainer>
);

export default CityCount;

CityCount.propTypes = {
  list: PropTypes.array,
};
