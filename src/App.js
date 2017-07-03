import React, { Component } from 'react';
import logo from './heartbulbcolor.svg';
import './App.css';

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
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.pledge.price}</td>
        <td>{this.props.pledge.tax_ded}</td>
        <td>{this.props.pledge.tax_res}</td>
      </tr>
    );
  }
}

class PledgeTable extends React.Component {
  render() {
    var rows = [];
    var lastCategory = null;
    this.props.pledges.forEach((pledge) => {
      if ((pledge.name.indexOf(this.props.filterText) === -1 ||
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
            <th>Donation to match</th>
            <th>Countries with tax deductibility</th>
            <th>Country the donor is tax resident in</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  render() {
    return (
      <form>
        <input type="text" placeholder="Search..." />
        <p>
          <input type="checkbox" />
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
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.activeOnly}
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
var PLEDGES = [
  {category: 'Poverty', price: '$1000', active: true, name: 'AMF', id:'1', tax_ded:'UK', tax_res:'Canada'},
  {category: 'Poverty', price: '$200', active: true, name: 'SCI', id:'2', tax_ded:'US, UK, Australia', tax_res:'Mexico'},
  {category: 'Poverty', price: '$253', active: false, name: 'AMF', id:'3', tax_ded:'UK'},
  {category: 'X-Risk', price: '$824', active: true, name: 'MIRI', id:'4', tax_ded:'US'},
  {category: 'Animal Welfare', price: '$400', active: false, name: 'Humane League', id:'5'},
  {category: 'Animal Welfare', price: '$10000', active: true, name: 'Good Food Institute', id:'6'}
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Donation Swapper</h2>
        </div>
        <div>
          <FilterablePledgeTable pledges={PLEDGES} />
        </div>
      </div>
    );
  }
}

export default App;
