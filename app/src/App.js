import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {STATES} from './states.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {state: 'UT', endpoint: 'representatives', results: []}
    this.onStatesSelected = this.onStatesSelected.bind(this);
    this.onRepTypeSelected = this.onRepTypeSelected.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.state.state, this.state.endpoint);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.state !== prevState.state || this.state.endpoint !== prevState.endpoint) {
      this.fetchData(this.state.state, this.state.endpoint);
    }
  }

  fetchData(state, endpoint) {
    fetch("http://localhost:3000/" + endpoint + "/" + state)
      .then(res => res.json())
      .then((ret) => {
        if (ret.success === true) {
          this.setState({results: ret.results});
        } else {
          this.setState({results: []});
        }
      })
  }

  createStatesSelectItems() {
    return STATES.map((s) => {
      return (<option key={s.abbreviation} value={s.abbreviation}>{s.name}</option>)
    })
  };

  onStatesSelected(e) {
    this.setState({state: e.target.value})
  }

  onRepTypeSelected(e) {
    this.setState({endpoint: e.target.value})
  }

  search() {
    console.log("State:", this.Control)
    console.log("Endpoint:")
  }

  render() {
    const results = this.state.results;

    return (
      <div className="App">
        <header className="App-header">
        </header>
        <div className="rep-form">
          <Form>

            <Form.Group controlId="repForm.ControlRepType">
              <Form.Label>Search Type</Form.Label>
              <Form.Control as="select" onChange={this.onRepTypeSelected}>
                <option value="representatives">Representative</option>
                <option value="senators">Senator</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="repForm.ControlState">
              <Form.Label>State</Form.Label>
              <Form.Control as="select" onChange={this.onStatesSelected} defaultValue={this.state.state}>
                {this.createStatesSelectItems()}
              </Form.Control>
            </Form.Group>

          </Form>
        </div>

        <div className="results-container">
          <Results results={results} />
        </div>

      </div>
    );
  }
}

function Results(props) {
  const hasResults = props.results && props.results.length > 0;
  if (!hasResults) {
    return <div className="no-results">No results to display</div>
  } else {

    // Note: This React Bootstrap Accordion may throw this error:
    // index.js:1 Warning: findDOMNode is deprecated in StrictMode.
    // This is expected. See https://stackoverflow.com/a/60869339/1457295

    let resultCards = props.results.map((r, index) => {
      return <Card>
                <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                  {r.name} - {r.party}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index + 1}>
                  <Card.Body>
                    Phone Number: {r.phone}  <br />
                    Website: <a href={r.link} target="_blank" >{r.link}</a>  <br />
                    Office: {r.office}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
    })
    return <div className="results">
            <Accordion>
              {resultCards}
            </Accordion>
          </div>
  }


}

export default App;
