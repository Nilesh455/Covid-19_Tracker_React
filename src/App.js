import React, { useState, useEffect } from 'react';
import './App.css';
import FormControl from '@material-ui/core/FormControl';
import { Select, MenuItem, Card, CardContent } from '@material-ui/core';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData, prettyPrintStats } from './utilities/util';
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, []);

  // useEffect -> Runs a piece of code based on a given condition
  useEffect(() => {
    // the code inside here will run once when the component loads and not again.
    // async -> send a request, wait for it, do something with the info
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    
    const url = 
      countryCode === 'worldwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
        .then( (response) => response.json())
        .then( (data) => {
          setCountry(countryCode);
          //All of the data from country response
          setCountryInfo(data);
          // Set Latitue and Langitue
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        });
  };

  console.log('countryInfo', countryInfo);

  return (
    <div className="app">

      <div className="app__left">
        {/* Header */}
        {/* Title + Dropdown Input Field */}
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onClick={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* List through the countries and show the dropdown list of of the options */}
              {countries.map( (country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div> 

        {/* InfoBox */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')} 
            title="Corona Virus Cases" 
            cases={prettyPrintStats(countryInfo.todayCases)} 
            total={prettyPrintStats(countryInfo.cases)}
          />
          
          <InfoBox
            active={casesType === 'recovered'} 
            onClick={e => setCasesType('recovered')} 
            title="Recovered" 
            cases={prettyPrintStats(countryInfo.todayRecovered)} 
            total={prettyPrintStats(countryInfo.recovered)}
          />
          
          <InfoBox 
            isRed
            active={casesType === 'deaths'} 
            onClick={e => setCasesType('deaths')} 
            title="Deaths" 
            cases={prettyPrintStats(countryInfo.todayDeaths)} 
            total={prettyPrintStats(countryInfo.deaths)}
          />
        </div>

        {/* Map */}
        <Map
          casesType={casesType} 
          countries={mapCountries} 
          center={mapCenter} 
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Cases By Country</h3>
          <Table countries={tableData} />
          {/* Graph */}  
              <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>

    </div>
  );
}

export default App;
