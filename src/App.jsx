const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

class IssueFilter extends React.Component {
  render() {
    return (
      <div>Welcome</div>
    );
  }
}

function IssueRow(props) {
  const issue = props.issue;
  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.name}</td>
      <td>{issue.phone}</td>
      <td>{issue.seatid}</td>
      <td>{issue.created.toString().slice(0, 25)}</td>
    </tr>
  );
}

function DisplayTraveller(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.seatid} issue={issue} />
  );

  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone Number</th>
          <th>Seat No.</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    let seatNum = Number(form.seat.value);
    if (seatNum >= 1 && seatNum <= 25) {
      const issue = {
        name: form.name.value, phone: form.phone.value, seatid: form.seat.value,
      }
      this.props.createIssue(issue);
    }
    else {
      this.props.msgDisplay("Error: Invalid Seat Number");
    }
    form.name.value = ""; form.phone.value = ""; form.seat.value = "";
  }

  render() {
    return (
      <form name="issueAdd" onSubmit={this.handleSubmit}>
        <input type="text" name="name" placeholder="Name" />
        <input type="text" name="phone" placeholder="Phone" />
        <input type="text" name="seat" placeholder="Seat No." />
        <button>Add</button>
      </form>
    );
  }
}

class BlackIssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.blacklistAdd;
    const blackissue = {
        name: form.name.value,
    }
    this.props.createBlackIssue(blackissue);
    form.name.value = "";
  }

  render() {
    return (
        <form name="blacklistAdd" onSubmit={this.handleSubmit}>
        <input type="text" name="name" placeholder="Name" />
        <button>Block</button>
        </form>
    );
  }
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class HomePage extends React.Component {
  constructor() {
    super();
    this.state = { issues: [], blackissues: [], showIssueFilter: false, showIssueTable: false, showIssueAdd: true, showBlackIssueAdd: true };
    this.createIssue = this.createIssue.bind(this);
    this.msgDisplay = this.msgDisplay.bind(this);
    this.createBlackIssue = this.createBlackIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      issueList {
        id name phone seatid created
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }


  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
      issueAdd(issue: $issue) {
        id
      }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
      this.msgDisplay("Successful!");
    }
    else {
      this.msgDisplay("Failed~");
    }
  }

  async createBlackIssue(blackissue) {
    const query = `mutation blackissueAdd($blackissue: BlackIssueInputs!) {
      blackissueAdd(blackissue: $blackissue) {
          name
      }
    }`;

    const data = await graphQLFetch(query, { blackissue });
  }

  msgDisplay(msg) {
    const msgDisp = document.getElementById("msgDisplay");
    msgDisp.textContent=msg;
  }

  render() {
    return (
      <React.Fragment>
        <h1>Singapore Railway System</h1>
        <nav>
          <a href="#" onClick={()=>{this.setState({showIssueFilter: !this.state.showIssueFilter})}}>Home</a>
          {' | '}
          <a href="#" onClick={()=>{this.setState({showIssueAdd: !this.state.showIssueAdd})}}>Add Traveller</a>
          {' | '}
          <a href="#" onClick={()=>{this.setState({showBlackIssueAdd: !this.state.showBlackIssueAdd})}}>Add BlackList</a>
          {' | '}
          <a href="#" onClick={()=>{this.setState({showIssueTable: !this.state.showIssueTable})}}>Display Reservation</a>
        </nav>
        {this.state.showIssueFilter? (<IssueFilter />): null}
        <hr />
        {this.state.showIssueAdd? (<IssueAdd createIssue={this.createIssue} msgDisplay = {this.msgDisplay}/> ):null}
        {this.state.showIssueAdd? (<p id="msgDisplay"></p>):null}
        <hr />
        {this.state.showBlackIssueAdd? (<BlackIssueAdd createBlackIssue={this.createBlackIssue} />):null}
        <hr />
        {this.state.showIssueTable? (<DisplayTraveller issues={this.state.issues} />):null}
        <hr />
      </React.Fragment>
    );
  }
}

const element = <HomePage />;

ReactDOM.render(element, document.getElementById('contents'));
