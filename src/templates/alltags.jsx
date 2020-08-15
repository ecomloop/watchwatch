import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Container } from 'layouts';
import { Header, TagsBlock, SEO } from 'components';
import config from '../../config/site';
import _ from 'lodash';


const Tags = ({ pageContext }) => {
    const { tags } = pageContext;

    const title = "All Tags Page";

    const maxItems = 10;
    const [limit, setLimit] = React.useState(maxItems);
    const [showMore, setShowMore] = React.useState(true);

    const increaseLimit = () => {
        setLimit(limit + maxItems);
    }

    //remove blank tags
    const filteredList = _.filter(tags, (tag) => (tag!=null && tag.length>0))

    //Now limiting the items as per limit
    const limitedList = _.slice(filteredList, 0, limit)

  return (
    <Layout>
      <SEO
        title={`${title} | ${config.title}`}
      />
      <Header title={title}>All Tags</Header>
      <Container>
        <TagsBlock list={limitedList} />
        {showMore && limitedList.length > 0 && limitedList.length < filteredList.length &&
            <div className="center">
                <a className="button" onClick={increaseLimit} style={{ cursor: "pointer" }}>
                    Load More
                </a>
            </div>
        }
      </Container>
    </Layout>
  );
};

export default Tags;

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tags: PropTypes.array,
  }),
};
