const path = require('path');
const _ = require("lodash");
const fetch = require("node-fetch");
const urlExists = require('url-exists');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type googleSheetListRow implements Node {
      id: String
      name: String
      date: String
      city: String
      state: String
      about: String
      imageurl: String
      tweet_url: String
      media_filename: String
      youtube_link: String
      comment: String
      slug: String
      fields: fields
      localImageUrl: File @link(from: "localImageUrl___NODE")
    }
    type fields {
      tweetEmbedData: String
      youtubeEmbedData: String
      videoEmbedData: String
    }
  `)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('src/templates/post.jsx');
    const alltagsPage = path.resolve('src/templates/alltags.jsx');
    const tagPosts = path.resolve('src/templates/tag.jsx');
    const categoryTemplate = path.resolve('src/templates/category.jsx');

    const postsByTag = {};

    //Start of creating pages from Google Sheet Data
    const entryTemplate = path.resolve('src/templates/singleitem.jsx');
    resolve(
      graphql(
        `
          query {
            allGoogleSheetListRow {
              edges {
                node {
                  id
                  name
                  city
                  state
                  tweet_url
                  media_filename
                  youtubelink
                  comment
                  slug
                  tags
                  imageurl
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const sheetRows = result.data.allGoogleSheetListRow.edges;

        // extracting tags from pages
        sheetRows.forEach(({ node }) => {
          if (node.tags) {
            const tagsList = node.tags.split(',')
            let rowPost = {
              frontmatter: {
                title: "",
                path: ""
              }
            }
            tagsList.forEach(tag => {
              rowPost.frontmatter.title = node.name
              rowPost.frontmatter.path = '' + node.slug
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }
              postsByTag[tag].push(node);
            });
          }
        });

        // extracting categories from the page and creating seperate category pages
        let uniqueCategories = []
        sheetRows.forEach(({ node }) => {
          if (node.category) {
            const categoryList = node.category.split(',')
            categoryList.forEach(category => {
              if (uniqueCategories.indexOf(category) === -1) {
                uniqueCategories.push(category)
              }
            });
          }
        });

        // Make category pages
        uniqueCategories.forEach(cat => {
          categoryKebabCase = cat.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase();
          createPage({
            path: `/category/${categoryKebabCase}/`,
            component: categoryTemplate,
            context: {
              category: cat,
            },
          })
        })

        //create pages
        sheetRows.forEach(({ node }, index) => {
          const path = '/' + node.slug;
          const prev = index === 0 ? null : sheetRows[index - 1].node;
          const next =
            index === sheetRows.length - 1 ? null : sheetRows[index + 1].node;
          createPage({
            path,
            component: entryTemplate,
            context: {
              pathSlug: node.slug,
              prev,
              next,
            },
          });
        });
      })
    );
    //End of creating pages from Google Sheet Data

    resolve(
      graphql(
        `
          query {
            allMarkdownRemark(
              sort: { order: ASC, fields: [frontmatter___date] }
            ) {
              edges {
                node {
                  frontmatter {
                    path
                    title
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        // create tags page
        posts.forEach(({ node }) => {
          if (node.frontmatter.tags) {
            node.frontmatter.tags.forEach(tag => {
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }

              postsByTag[tag].push(node);
            });
          }
        });

        const tags = Object.keys(postsByTag);

        //Create All Tags page
        createPage({
          path: '/alltags',
          component: alltagsPage,
          context: {
            tags: tags.sort(),
          },
        });

        //create tags
        tags.forEach(tagName => {
          const posts = postsByTag[tagName];

          createPage({
            path: `/tags/${tagName}`,
            component: tagPosts,
            context: {
              posts,
              tagName,
            },
          });
        });

        //create posts
        posts.forEach(({ node }, index) => {
          const path = node.frontmatter.path;
          const prev = index === 0 ? null : posts[index - 1].node;
          const next =
            index === posts.length - 1 ? null : posts[index + 1].node;
          createPage({
            path,
            component: postTemplate,
            context: {
              pathSlug: path,
              prev,
              next,
            },
          });
        });
      })
    );

  });
};

const momentRegexp = /https:\/\/twitter.com\/i\/moments\/[0-9]+/i;
const tweetRegexp = /https:\/\/twitter\.com\/[A-Za-z0-9-_]*\/status\/[0-9]+/i;

const isTwitterLink = (url) => {
  return url &&
    (tweetRegexp.test(url) ||
     momentRegexp.test(url));
}

const getTweetBlockquote = async (url, opt) => {
  const apiUrl = `https://publish.twitter.com/oembed?url=${
    url
  }&hide_thread=${
    opt.hideThread !== false ? '1' : '0'
  }&align=${
    opt.align || ''
  }&hide_media=${
    opt.hideMedia ? '1' : '0'
  }&theme=${
    opt.theme || ''
  }&link_color=${
    opt.linkColor || ''
  }&widget_type=${
    opt.widgetType || ''
  }&omit_script=true&dnt=true&limit=20&chrome=nofooter`

  const response = await fetch(apiUrl);
  if (response.status !== 200) {
    console.warn("** Bad status code from twitter url '"+url+"' : "+response.status);
    return null;
  }
  return await response.json();
};

const isYoutubeLink = (url) => {
  const { host, pathname, searchParams } = new URL(url);
  return (
    host === 'youtu.be' ||
    (['youtube.com', 'www.youtube.com'].includes(host) &&
      pathname.includes('/watch') &&
      Boolean(searchParams.get('v')))
  );
}
const getYoutubeTimeValueInSeconds = (timeValue) => {
  if (Number(timeValue).toString() === timeValue) {
    return timeValue;
  }
  const {
    2: hours = '0',
    4: minutes = '0',
    6: seconds = '0',
  } = timeValue.match(/((\d*)h)?((\d*)m)?((\d*)s)?/);
  return String((Number(hours) * 60 + Number(minutes)) * 60 + Number(seconds));
};
const getYouTubeIFrameSrc = (urlString) => {
  const url = new URL(urlString);
  let id = url.searchParams.get('v');
  if (url.host === 'youtu.be') {
    id = url.pathname.slice(1);
  }
  const embedUrl = new URL(
    `https://www.youtube-nocookie.com/embed/${id}?rel=0`
  );
  url.searchParams.forEach((value, name) => {
    if (name === 'v') {
      return;
    }
    if (name === 't') {
      embedUrl.searchParams.append('start', getTimeValueInSeconds(value));
    } else {
      embedUrl.searchParams.append(name, value);
    }
  });
  return embedUrl.toString();
};
const getYouTubeEmbedHTML = (url) => {
  const iframeSrc = getYouTubeIFrameSrc(url);
  return `<iframe width="100%" height="315" src="${iframeSrc}" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>`;
};

const getHTML5VideoEmbedHTML = (url) => {
  if(!url || !url.includes('.mp4')) {return ""}
  return `<video width="50%" controls><source src=${url} type="video/mp4">Your browser does not support the video tag.</video>`;
};

exports.onCreateNode = async ({ node, actions }) => {
  const { createNodeField } = actions

    //handling tweets
  if (node.internal
      && node.internal.owner === 'gatsby-source-google-sheets'
      && node.url
      && node.url.startsWith("http")
  ) {
    const tweetLink = node.url;

    let embedDataHTML = "";
    try {
      if(isTwitterLink(tweetLink)){
        const embedData = await getTweetBlockquote(tweetLink, []);
        embedDataHTML = embedData ? embedData.html : ""
      } else {
        //console.warn('SKIPPING NON-TWITTER url = '+tweetLink)
      }
    } catch (er) {
      //console.warn(`failed to get blockquote for ${tweetLink}`, er)
    }
    createNodeField({
        name: 'tweetEmbedData', // field name
        node, // the node on which we want to add a custom field
        value: embedDataHTML // field value
    });
  }

  //handling youtube videos
  if (node.internal
      && node.internal.owner === 'gatsby-source-google-sheets'
      && node.youtubelink
      && node.youtubelink.startsWith("http")
  ) {
    const youtubeLink = node.youtubelink;
    let embedDataHTML = "";
    try {
      if(isYoutubeLink(youtubeLink)){
        const embedData = getYouTubeEmbedHTML(youtubeLink);
        embedDataHTML = embedData || "";
      } else {
        //console.warn('SKIPPING NON-YOUTUBE Link = '+youtubeLink)
      }
    } catch (er) {
      //console.warn(`failed to get embed for ${youtubeLink}`, er)
    }
    createNodeField({
        name: 'youtubeEmbedData', // field name
        node, // the node on which we want to add a custom field
        value: embedDataHTML // field value
    });
  }


  //handling videos inside mediafile
  if (node.internal
      && node.internal.owner === 'gatsby-source-google-sheets'
      && node.mediafile
      && node.mediafile.startsWith("http")
  ) {
    const videoLinks = node.mediafile;
    let embedDataHTML = "";
    try {
        videos = videoLinks ? videoLinks.split(",") : [];
        const embedData = videos.length>0 ? getHTML5VideoEmbedHTML(videos[0]):"";
        embedDataHTML = embedData || "";
    } catch (er) {
      //console.warn(`failed to get embed for ${videoLink}`, er)
    }
    createNodeField({
        name: 'videoEmbedData', // field name
        node, // the node on which we want to add a custom field
        value: embedDataHTML // field value
    });
  }

};


/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};
