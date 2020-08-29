import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, PostList } from 'components';
import CityCount from '../components/CityCount';
import { Layout } from 'layouts';
import { navigate } from "@reach/router";
import _ from 'lodash';
import Search from 'components/search'
import StateCityNavigator from 'components/StateCityNavigator'
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

const TextWrapper = styled.div`
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
  
  const allStates = data.allstates.distinct;
  const allCities = data.allcities.edges;

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

      <ShopSectionSubHeading style={{ marginTop: "5rem", 'text-align': "center" }}>
        Police brutality cases are widespread<br/>
      </ShopSectionSubHeading>
      <ShopWrapper style={{ margin: "1rem auto", 'text-align': "center", width:"67%", display: "block" }}>
      WatchWatch documents hundreds of cases of police violence in cities across the United States.<br/> Search for a location or click to view a police brutaliy case. 
      </ShopWrapper>
      <div className="search_main">
        <div className="text_main center">
        </div>
        <Search collapse homepage indices={searchIndices} />
      </div>
      <ShopWrapper style={{ margin: "3rem auto", 'text-align': "center", width:"67%", display: "block" }}>
        <StateCityNavigator allStates={allStates} allCities={allCities} />
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
<TextWrapper>
<h3>Beginning to Understand Police Brutality</h3>

<p ><a href="https://www.nbcnews.com/think/opinion/i-came-cover-aggression-minneapolis-then-i-became-victim-it-ncna1221241">Minneapolis, Minnesota</a>: Police arrest Black/Latino CNN reporter Omar Jimenez and his crew in the middle of a live broadcast on spurious charges. Later that night they shoot photojournalist Linda Tirado in the face with &ldquo;less lethal&rdquo; ammunition, likely a rubber bullet (which are, for the record, actually metal bullets coated in rubber), causing her to lose an eye. Twenty protesters, medics, bystanders, and members of the press were&nbsp;<a href="https://khn.org/news/rubber-bullets-protesters-police-often-violate-own-policies-crowd-control-less-lethal-weapons/">shot directly in the eye</a>&nbsp;in the first month of protests alone, seven of whom lost an eye entirely. Tirado and Jimenez&nbsp;<a href="https://www.vox.com/identities/2020/5/31/21276013/police-targeted-journalists-covering-george-floyd-protests">are just two of dozens</a>&nbsp;of foreign and domestic journalists whom police harassed, arrested, and violently attacked during the protests.</p>
<p ><a href="https://www.bbc.com/news/world-us-canada-52952237">Buffalo, New York</a>: Two police officers violently shove 75-year-old Martin Gugino to the ground, then step over him without a second glance as his head splits open on the pavement. In a rare move, the two officers who did the pushing are suspended without pay and criminally charged for their actions. Gugino is hospitalized for a month. He is one of 60 protesters, medics, bystanders, and members of the press to sustain serious head injuries including fractured skulls and brain damage in the months of May and June alone.</p>
<p ><a href="https://www.independent.co.uk/news/world/americas/austin-police-being-investigated-after-video-of-cop-pepper-spraying-bystander-goes-viral-10305422.html">Austin, Texas</a>;&nbsp;<a href="https://gothamist.com/news/video-cop-suspended-without-pay-after-pepper-spraying-bystander-during-demonstrations">New York, New York</a>;&nbsp;<a href="https://www.vox.com/2020/5/31/21275994/police-violence-peaceful-protesters-images">Dallas, Texas</a>;&nbsp;<a href="https://www.cleveland.com/court-justice/2020/07/video-shows-police-shot-downtown-cleveland-resident-in-head-back-with-pepper-balls-as-he-tried-to-enter-his-apartment-they-just-lit-me-up.html">Cleveland, Ohio</a>;&nbsp;<a href="https://www.vox.com/2020/5/31/21275994/police-violence-peaceful-protesters-images">Salt Lake City, Utah</a>;&nbsp;<a href="https://www.cnn.com/2020/06/06/us/police-excessive-force-us-protests/index.html">Atlanta, Georgia</a>: Police attack bystanders using stun guns, pepper spray, &ldquo;bean bag&rdquo; rounds (fabric bags, discharged from shotgun, full of lead shot), and other &ldquo;less lethal&rdquo; projectiles. The individuals in question are heading home from the grocery store, standing at the front door to their own homes, or waiting to cross the street. Some injuries are collateral damage, innocent victims of the wildly excessive force police are using against peaceful protesters. Some can only be the result of unmitigated malice.&nbsp;</p>
<p >The Black Lives Matter protests that swept the planet in the spring and summer of 2020 are less frequent, less well-attended now, but those demonstrations have left a mark the nation that will not soon rub away. A&nbsp;<a href="https://news.gallup.com/poll/316106/two-three-americans-support-racial-justice-protests.aspx">recent Gallup poll</a>&nbsp;found that for the first time, 65% of Americans now support the Black Lives Matter movement, and 54% say that the protests over the death of George Floyd have improved their understanding of racial justice. It&rsquo;s a small victory, getting a little over half of Americans to acknowledge that Black lives matter, but it&rsquo;s something. More people who aren&rsquo;t Black are attending rallies. More white people are putting in actual labor. It has taken centuries of physical, mental, and emotional labor on the part of Black Americans, but it seems that white America is finally starting to understand the true meanings of the word justice, of equality, of freedom.</p>
<p >A bit of the fuel for this white awakening may have come from an unlikely source: the police themselves. Normally, even when a police officer is caught on video murdering a someone who&rsquo;s unarmed, there&rsquo;s an inclination, among white people, at least, to wonder whether the police officer&rsquo;s side of the story &ndash; no matter how absurd &ndash; is true. We wonder what happened before the camera turned on in the lead-up to the event or to wonder if the officer saw something from his or her vantage point that we can&rsquo;t see from ours.&nbsp;</p>
<p >But the footage from the protests on the nightly news, the cell phone videos lighting up our social media feeds, they left no room for the possibility of other sides to the story. We could think of no &ldquo;other side&rdquo; to police stopping to&nbsp;<a href="https://www.theguardian.com/us-news/2020/jun/06/police-violence-protests-us-george-floyd">rip a young Black man&rsquo;s mask off</a>&nbsp;before attacking him with pepper spray, all while the young man stood silent with his hands in the air. We could think of no precipitating events that would justify police pepper spraying a&nbsp;<a href="https://slate.com/news-and-politics/2020/06/nypd-reform-protests-pepper-spray-zellnor-myrie.html">New York state senator and assemblywoman</a>, both black; nor could we imagine what justification police might have had for pepper-spraying a&nbsp;<a href="https://www.cleveland.com/open/2020/05/us-rep-joyce-beatty-other-politicians-pepper-sprayed-by-columbus-police-during-protest.html">septuagenarian member of the U.S. House of Representatives</a>, also Black, and the two Black politicians who were protesting with her.&nbsp;</p>
<p >Police violence during the protests was so severe that Amnesty International, in a report titled &ldquo;<a href="https://www.amnesty.org/download/Documents/AMR5128072020ENGLISH.PDF">USA: The World Is Watching</a>,&rdquo;&nbsp;found that &ldquo;police forces across the USA committed widespread and egregious human rights violations.&rdquo; Between May 26th&nbsp;and June 5th, Amnesty counted 89 incidents in which tear gas was used unnecessarily. It also found countless incidents in which protestors were injured by police and then taken into custody without being given access to medical treatment for those injuries.</p>
<p >Police from sea to shining sea came together during those protests to show all of America exactly what police brutality looks like, how truly pervasive a problem it is, and the air of utter entitlement with which some officers behaved, as if there was nothing unusual about their violence, as if, surrounded by witnesses and cameras, they knew they could get away with anything. And for the most part, they did.</p>
<p >When confronted with hundreds of videos, images, and news stories showing incontrovertible proof of unprovoked police violence, it becomes apparent that the problem of excessive force was far vaster than many of us had imagined. But how vast is it, exactly? The answer is hard to say. For one thing, we don&rsquo;t actually know how many people the police kill each year because the federal government does not keep track. The&nbsp;<a href="https://www.congress.gov/bill/113th-congress/house-bill/1447">Death in Custody Reporting Act</a>&nbsp;passed after the 2014 death of Michael Brown was supposed to require that all states receiving federal criminal justice funding record and report all instances of suspects dying in police custody or in the process of being arrested. However, six years later, that law&nbsp;<a href="https://oig.justice.gov/reports/2018/e1901.pdf">has yet to be fully implemented</a>. The Washington Post estimates that 1,000 people are shot and killed by police each year, but doesn&rsquo;t take into account deaths from other causes, such as beatings or medical neglect. One thing we can say for certain is that police in the United States kill more people in days than police in other countries do in years.</p>
<p >Likewise, the US Bureau of Justice Statistics attempts to track police use of force by surveying 18,000 police departments across the country and collecting the data in its periodic &ldquo;Contacts Between Police and the Public&rdquo; reports. However, former BJS statistician and current Seattle University Department of Criminal Justice chair Mathew Hickman calls the process of data collection for these reports &ldquo;<a href="https://www.jacksonville.com/news/20190902/police-use-of-force-data-a-huge-mess-across-us">a huge mess</a>.&rdquo; He says, &ldquo;There&rsquo;s no regulation at the national level&hellip;&rdquo; and that the individual police departments &ldquo;can each do whatever the hell they want.&rdquo;</p>
<p >Without much solid data to take hold of, the best option, for those of us who aren&rsquo;t statisticians at any rate, might be to listen to people who have had violent interactions with the police and believe them. Maybe when calculating the human cost of police violence, the only number that matters should be zero. Zero is the only number of men who should spend 8 minutes dying, begging for breath, while a police officer kneels on their neck. Zero is the number of young women who should be shot 8 times when the police burst unannounced into their apartments in the middle of the night, zero is the number of peaceful protesters who should be shot in the face with sponges or rubber or beanbags, and zero is the number of septuagenarian protesters who should be assaulted by police.&nbsp;</p>
<p >Police brutality is, of course, horrible no matter who it happens to, but research shows that Black and Indigenous people of color (BIPOC) are far more likely to be on the receiving end of police brutality than white people. That BIPOC are profiled by police is a closed question &ndash; our own&nbsp;<a href="https://nij.ojp.gov/topics/articles/racial-profiling-and-traffic-stops">National Institute of Justice has acknowledged</a>&nbsp;this repeatedly. Police are more likely to stop BIPOC, and when they stop them, they are more likely to search them than a white person they stopped for the same reason. When police find contraband, police are more likely to arrest BIPOC than they are white suspects with the same amount of the same contraband. In the process, police are more likely to use&nbsp;<a href="https://www.pnas.org/content/116/34/16793">excessive force on BIPOC, and they&rsquo;re more likely to kill BIPOC</a>.&nbsp;</p>
<p >In the face of all this, it&rsquo;s hard not to feel hopeless. It&rsquo;s hard not to feel like this fight is too big, like police and brutality are hopelessly inextricable, like racism is so deeply ingrained in the justice system that we will never root it out. But it may help to look at the words of the late Representative John Lewis, who said that freedom isn&rsquo;t a state we&rsquo;ll one day reach, rather, &ldquo;freedom is the continuous action we all must take, and each generation must do its part to create an even more fair, more just society.&rdquo; And there are a great many ways for lovers of freedom to do their part.</p>
<p >So far, dozens of pieces of legislation have been introduced on the federal, state, and local levels aimed at ending needless violence and death. Laws proposed range from banning chokeholds to whistleblower protections, to requiring officers to intervene when their fellow officers use excessive force. A lot of the legislation has been criticized for lacking teeth or for replicating existing law, however.</p>
<p >Pennsylvania has already passed&nbsp;<a href="https://apnews.com/c6658f30f875f76c6521ca513a1e5801">two bills</a>&nbsp;inspired by George Floyd (only after, however, Black democrats in the Pennsylvania House&nbsp;<a href="https://apnews.com/da52ef60cc9e6a29fc721875b7055c33">staged a demonstration</a>&nbsp;of their own, commandeering the podium one Monday morning and vowing not to leave until there was actual progress made). Pennsylvania law now bans chokeholds and makes it easier for police departments to share the disciplinary records of officers.</p>
<p >Minneapolis has agreed to disband its police force, and several more cities have agreed to divert some police funding to social programs. The city of&nbsp;<a href="https://www.forbes.com/sites/rachelsandler/2020/07/14/berkeley-may-become-1st-us-city-to-remove-police-from-traffic-stops/#6809689470fa">Berkley, California has voted</a>&nbsp;to shift traffic enforcement duties away from police and on to unarmed civil servants. They&rsquo;ve also voted to create a Specialized Care Unit that would send crisis care workers to handle non-criminal police calls involving people who are homeless or have a mental illness.</p>
<p >Allies looking to get involved have options to help.</p>
<div >
<a href="/random" className="button ">WatchWatch a police brutality case</a><div></div>
<a className="button buttonalt" href="javascript:void(0)" onClick={() => setOpen(true)}>
  Help end police Violence
</a>

</div>
</TextWrapper>

<ShopWrapper>

</ShopWrapper>


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

    allstates : allGoogleSheetListRow {
      distinct(field: state)
    }

    allcities : allGoogleSheetListRow {
      edges {
        node {
          state
          statecode
          city
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
