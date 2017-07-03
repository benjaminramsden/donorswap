import React, { Component } from 'react'

class Pledge extends Component {
    componentDidMount() {
    }
    render() {
        return (
        )
    }
}

import React from 'react';

export default class Pledge extends React.Component {
    constructor() {
        super();
        this.state = { pledges: [] };
    }

    componentDidMount() {
        fetch(`/api/pledges`)
            .then(result=> {
                this.setState({items:result.json()});
            });
    }

    render() {
        return(
            <div>
                <div>Pledges:</div>
                { this.state.pledges.map(item=> { return <div>{http://pledge.name}</div>}) }
            </div>
        );
    }
}
