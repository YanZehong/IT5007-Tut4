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
      <td>{issue.seatid}</td>
      <td>{issue.name}</td>
      <td>{issue.phone}</td>
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
          <th>Seat No.</th>
          <th>Name</th>
          <th>Phone Number</th>
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

class IssueDelete extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueDelete;
    const name = form.name.value;
    this.props.deleteIssue(name);
    form.name.value = ""; 
  }

  render() {
    return (
      <form name="issueDelete" onSubmit={this.handleSubmit}>
        <input type="text" name="name" placeholder="Name" />
        <button>Delete</button>
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

class DisplaySeat extends React.Component {
  render() {
    const seatDict = this.props.seatDict;
    var seats = [];
    for (let rr=0; rr<5; rr++) {
      var temps = {rowid: rr, cols:[], colors: []};
      for (let cc=1; cc<6; cc++) {
        let checkNum = (rr*5)+cc;
        temps.cols.push(checkNum);
        if (seatDict[checkNum] == "Available") {
          temps.colors.push("lightgrey");
        }
        else {
          temps.colors.push("lightcoral");
        }
      }
      seats.push(temps);
    }
    return (
      <table id="sTable">
        <thead></thead>
        <tbody>
          {seats.map((seat)=>(
            <tr key={seat.rowid}>
              <td style={{textAlign: "center", background: seat.colors[0]}}>{seat.cols[0]}</td>
              <td style={{textAlign: "center", background: seat.colors[1]}}>{seat.cols[1]}</td>
              <td style={{textAlign: "center", background: seat.colors[2]}}>{seat.cols[2]}</td>
              <td style={{textAlign: "center", background: seat.colors[3]}}>{seat.cols[3]}</td>
              <td style={{textAlign: "center", background: seat.colors[4]}}>{seat.cols[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
    this.state = { issues: [], blackissues: [], showIssueFilter: false, showIssueTable: false, showIssueAdd: true, showBlackIssueAdd: true, showIssueDelete: false, showSeats: false, seatDict: {} };
    this.createIssue = this.createIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.msgDisplay = this.msgDisplay.bind(this);
    this.msgBlackList = this.msgBlackList.bind(this);
    this.msgDisplayDel = this.msgDisplayDel.bind(this);
    this.createBlackIssue = this.createBlackIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
    this.initDict();
  }

  async loadData() {
    const query = `query {
      issueList {
        name phone seatid created
      }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }
  
  initDict() {
    var initialDict = {};
      for (let k=1; k<26; k++) {
        initialDict[k] = "Available";
      }
      this.setState({seatDict: initialDict });
  }

  async createIssue(issue) {
    const updateSeatDict = this.state.seatDict;
    let seatNum = Number(issue.seatid);
    if (updateSeatDict[seatNum]=="Available") {
      const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
          seatid
        }
      }`;

      const data = await graphQLFetch(query, { issue });
      if (data) {
        this.loadData();
        updateSeatDict[seatNum] = "Occupied";
        this.setState({ seatDict: updateSeatDict });
        this.msgDisplay("Successful!");
      }
      else {
        this.msgDisplay("Failed~");
      }
    }
    else {
      this.msgDisplay("Occupied Seat~");
    }
  }

  async deleteIssue(name) {
    const updateSeatDictDel = this.state.seatDict;
    const query = `mutation issueDelete($name: String!) {
      issueDelete(name: $name)
    }`;
    const data = await graphQLFetch(query, { name });
    if (data.issueDelete) {
      this.loadData();
      // console.log(data);
      let seatNum = Number(data.issueDelete);
      // console.log(seatNum);
      updateSeatDictDel[seatNum] = "Available";
      this.setState({ seatDict: updateSeatDictDel });
      this.msgDisplayDel("Successful Cancel");
    }
    else {
      this.msgDisplayDel("Not found! No need to delete");
    }
  }

  async createBlackIssue(blackissue) {
    const query = `mutation blackissueAdd($blackissue: BlackIssueInputs!) {
      blackissueAdd(blackissue: $blackissue) {
          name
      }
    }`;

    const data = await graphQLFetch(query, { blackissue });
    if (data) {
      this.loadData();
      this.msgBlackList("Successfully add to blacklist");
    }
  }

  msgDisplay(msg) {
    const msgDisp = document.getElementById("msgDisplay");
    msgDisp.textContent=msg;
  }

  msgBlackList(msg) {
    const msgDisp = document.getElementById("msgBlackList");
    msgDisp.textContent=msg;
  }

  msgDisplayDel(msg) {
    const msgDispDel = document.getElementById("msgDisplayDel");
    msgDispDel.textContent=msg;
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
          <a href="#" onClick={()=>{this.setState({showIssueDelete: !this.state.showIssueDelete})}}>Delete Traveller</a>
          {' | '}
          <a href="#" onClick={()=>{this.setState({showIssueTable: !this.state.showIssueTable})}}>Display Reservation</a>
          {' | '}
          <a href="#" onClick={()=>{this.setState({showSeats: !this.state.showSeats})}}>Display Seats</a>
        </nav>
        {this.state.showIssueFilter? (<IssueFilter />): null}
        <hr />
        {this.state.showIssueAdd? (<IssueAdd createIssue={this.createIssue} msgDisplay = {this.msgDisplay}/> ):null}
        {this.state.showIssueAdd? (<p id="msgDisplay"></p>):null}
        <hr />
        {this.state.showBlackIssueAdd? (<BlackIssueAdd createBlackIssue={this.createBlackIssue} />):null}
        {this.state.showBlackIssueAdd? (<p id="msgBlackList"></p>):null}
        <hr />
        {this.state.showIssueDelete? (<IssueDelete deleteIssue={this.deleteIssue} msgDisplayDel = {this.msgDisplayDel}/> ):null}
        {this.state.showIssueDelete? (<p id="msgDisplayDel"></p>):null}
        <hr />
        {this.state.showIssueTable? (<DisplayTraveller issues={this.state.issues} />):null}
        <hr />
        {this.state.showSeats? (<DisplaySeat seatDict={this.state.seatDict} />):null}
        {this.state.showSeats? (
          <div>
            <table id="Ltable">
              <tbody>
                <tr>
                  <td style={{background: "lightgrey"}}>Available</td>
                  <td style={{background: "lightcoral"}}>Occupied</td>
                </tr>
              </tbody>
            </table>
          </div>
        ):null}
      </React.Fragment>
    );
  }
}

const element = <HomePage />;

ReactDOM.render(element, document.getElementById('contents'));
