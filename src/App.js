import React, { Component } from 'react';
import logo from './heartbulbcolor.svg';
import './App.css';
import 'whatwg-fetch';

class PledgeCategoryRow extends React.Component {
  render() {
    return <tr><th colSpan="2">{this.props.category}</th></tr>;
  }
}

class PledgeRow extends React.Component {
  render() {
    var name = this.props.pledge.active ?
      this.props.pledge.name :
      <span style={{color: 'red'}}>
        {this.props.pledge.name}
      </span>;
    var button = this.props.pledge.active ?
      <button type="submit" onclick="UserAction()">Match Pledge</button> :
      <button disabled>Match Pledge</button>
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.pledge.price}</td>
        <td>{this.props.pledge.tax_ded}</td>
        <td>{this.props.pledge.tax_res}</td>
        <td>{button}</td>
      </tr>
    );
  }
}

class PledgeTable extends React.Component {
  render() {
    var rows = [];
    var lastCategory = null;
    this.props.pledges.forEach((pledge) => {
      if ((pledge.tax_ded.indexOf(this.props.filterText) === -1 ||
          (!pledge.active && this.props.activeOnly))) {
        return;
      }
      if (pledge.category !== lastCategory) {
        rows.push(<PledgeCategoryRow category={pledge.category} key={pledge.category} />);
      }
      rows.push(<PledgeRow pledge={pledge} key={pledge.id} />);
      lastCategory = pledge.category;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Charity</th>
            <th>Pledge</th>
            <th>Tax deductible countries</th>
            <th>Tax residency of donor</th>
            <th>Match</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this);
    this.handleActiveInputChange = this.handleActiveInputChange.bind(this);
  }

  handleFilterTextInputChange(e) {
    this.props.onFilterTextInput(e.target.value);
  }

  handleActiveInputChange(e) {
    this.props.onActiveInput(e.target.checked);
  }

  render() {
    return (
      <form>
        <input
          className="Search-box"
          type="text"
          placeholder="Enter your country of tax residency"
          value={this.props.filterText}
          onChange={this.handleFilterTextInputChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.activeOnly}
            onChange={this.handleActiveInputChange}
          />
          {' '}
          Only show pledges that are active
        </p>
      </form>
    );
  }
}

class FilterablePledgeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      activeOnly: false
    };

    this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
    this.handleActiveInput = this.handleActiveInput.bind(this);
  }

  handleFilterTextInput(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  handleActiveInput(activeOnly) {
    this.setState({
      activeOnly: activeOnly
    })
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          activeOnly={this.state.activeOnly}
          onFilterTextInput={this.handleFilterTextInput}
          onActiveInput={this.handleActiveInput}
        />
        <PledgeTable
          pledges={this.props.pledges}
          filterText={this.state.filterText}
          activeOnly={this.state.activeOnly}
        />
      </div>
    );
  }
}


// Could have another table of charities tax-deductible status. Better to have
// drop-down for charity they want to donate to and then only show those
// eligible.
var PLEDGES =
// [
//   {"_id": "5959e5ce15f9b540bc999d23", category: 'Poverty', price: '$1000', active: true, name: 'AMF', id:'1', tax_ded:'UK', tax_res:'Canada'},
//   {category: 'Poverty', price: '$200', active: true, name: 'SCI', id:'2', tax_ded:'Australia, Canada, EU, UK, US', tax_res:'Mexico'},
//   {category: 'Poverty', price: '$253', active: false, name: 'AMF', id:'3', tax_ded:'UK'},
//   {category: 'X-Risk', price: '$824', active: true, name: 'MIRI', id:'4', tax_ded:'US'},
//   {category: 'Animal Welfare', price: '$400', active: false, name: 'Humane League', id:'5', tax_ded:'US'},
//   {category: 'Animal Welfare', price: '$10000', active: true, name: 'Good Food Institute', id:'6', tax_ded:'Canada, US'},
// ];
fetch('/api/pledges')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Donation Swapper</h2>
          <p>This table shows all pledges for donations that need pairing for
            maximum tax effectiveness. Enter the country you are tax resident in
            below to find matches.
          </p>
        </div>
        <div>
          <FilterablePledgeTable pledges={PLEDGES} />
        </div>
      </div>
    );
  }
}

export default App;
