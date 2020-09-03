import React from 'react';
import { navigate } from "@reach/router";
import _ from 'lodash';
import styled from '@emotion/styled';

const StyledSelect = styled.select`
  padding: 0.4rem;
`;

const StateCityNavigator = ({allStates, allCities}) => {
	const [filteredCities, setFilteredCities] = React.useState([])

	const getCitiesFromState = (state) => {
    if(!state || state.length<=0) {
      setFilteredCities([]);
      return;
    }
    const filtered = _.filter(allCities, ({node}) => node.state == state)
    const unique = _.uniqBy(filtered, ({node}) => node.city)
    setFilteredCities(unique)
  }

  const goToCity = (city) => {
    if(!city || city.length<=0) return;
    console.log(city)
    navigate(city);
  }

	return (
		<div>

			<StyledSelect onChange={e=>{getCitiesFromState(e.target.value)}}>
				<option value="">Select State</option>
				{allStates && allStates.map((state)=>(
					<option value={state}>{state}</option>
				))}
			</StyledSelect>
			{` `}
			<StyledSelect onChange={e=>{goToCity(e.target.value)}}>
				<option value="">City</option>
				{filteredCities && filteredCities.map(({node},index)=>(
					<>
					{index==0 &&
						<option key={node.state} value={`/police-brutality/`+_.kebabCase(node.state.trim())}>ALL</option>
					}
					<option key={node.city} value={`/police-brutality/`+_.kebabCase(node.city.trim())+`-`+_.kebabCase(node.statecode.trim())}>{node.city}</option>
					</>
				))}
			</StyledSelect>
		</div>
	);
}

export default StateCityNavigator;
