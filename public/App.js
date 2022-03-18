"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

var IssueFilter = /*#__PURE__*/function (_React$Component) {
  _inherits(IssueFilter, _React$Component);

  var _super = _createSuper(IssueFilter);

  function IssueFilter() {
    _classCallCheck(this, IssueFilter);

    return _super.apply(this, arguments);
  }

  _createClass(IssueFilter, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("div", null, "Welcome");
    }
  }]);

  return IssueFilter;
}(React.Component);

function IssueRow(props) {
  var issue = props.issue;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, issue.id), /*#__PURE__*/React.createElement("td", null, issue.name), /*#__PURE__*/React.createElement("td", null, issue.phone), /*#__PURE__*/React.createElement("td", null, issue.seatid), /*#__PURE__*/React.createElement("td", null, issue.created.toString().slice(0, 25)));
}

function DisplayTraveller(props) {
  var issueRows = props.issues.map(function (issue) {
    return /*#__PURE__*/React.createElement(IssueRow, {
      key: issue.seatid,
      issue: issue
    });
  });
  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Phone Number"), /*#__PURE__*/React.createElement("th", null, "Seat No."), /*#__PURE__*/React.createElement("th", null, "Timestamp"))), /*#__PURE__*/React.createElement("tbody", null, issueRows));
}

var IssueAdd = /*#__PURE__*/function (_React$Component2) {
  _inherits(IssueAdd, _React$Component2);

  var _super2 = _createSuper(IssueAdd);

  function IssueAdd() {
    var _this;

    _classCallCheck(this, IssueAdd);

    _this = _super2.call(this);
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(IssueAdd, [{
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      var form = document.forms.issueAdd;
      var seatNum = Number(form.seat.value);

      if (seatNum >= 1 && seatNum <= 25) {
        var issue = {
          name: form.name.value,
          phone: form.phone.value,
          seatid: form.seat.value
        };
        this.props.createIssue(issue);
      } else {
        this.props.msgDisplay("Error: Invalid Seat Number");
      }

      form.name.value = "";
      form.phone.value = "";
      form.seat.value = "";
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("form", {
        name: "issueAdd",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        name: "name",
        placeholder: "Name"
      }), /*#__PURE__*/React.createElement("input", {
        type: "text",
        name: "phone",
        placeholder: "Phone"
      }), /*#__PURE__*/React.createElement("input", {
        type: "text",
        name: "seat",
        placeholder: "Seat No."
      }), /*#__PURE__*/React.createElement("button", null, "Add"));
    }
  }]);

  return IssueAdd;
}(React.Component);

var BlackIssueAdd = /*#__PURE__*/function (_React$Component3) {
  _inherits(BlackIssueAdd, _React$Component3);

  var _super3 = _createSuper(BlackIssueAdd);

  function BlackIssueAdd() {
    var _this2;

    _classCallCheck(this, BlackIssueAdd);

    _this2 = _super3.call(this);
    _this2.handleSubmit = _this2.handleSubmit.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(BlackIssueAdd, [{
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      var form = document.forms.blacklistAdd;
      var blackissue = {
        name: form.name.value
      };
      this.props.createBlackIssue(blackissue);
      form.name.value = "";
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("form", {
        name: "blacklistAdd",
        onSubmit: this.handleSubmit
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        name: "name",
        placeholder: "Name"
      }), /*#__PURE__*/React.createElement("button", null, "Block"));
    }
  }]);

  return BlackIssueAdd;
}(React.Component);

var DisplaySeat = /*#__PURE__*/function (_React$Component4) {
  _inherits(DisplaySeat, _React$Component4);

  var _super4 = _createSuper(DisplaySeat);

  function DisplaySeat() {
    _classCallCheck(this, DisplaySeat);

    return _super4.apply(this, arguments);
  }

  _createClass(DisplaySeat, [{
    key: "render",
    value: function render() {
      var seatDict = this.props.seatDict;
      var seats = [];

      for (var rr = 0; rr < 5; rr++) {
        var temps = {
          rowid: rr,
          cols: [],
          colors: []
        };

        for (var cc = 1; cc < 6; cc++) {
          var checkNum = rr * 5 + cc;
          temps.cols.push(checkNum);

          if (seatDict[checkNum] == "Available") {
            temps.colors.push("lightgrey");
          } else {
            temps.colors.push("lightcoral");
          }
        }

        seats.push(temps);
      }

      return /*#__PURE__*/React.createElement("table", {
        id: "sTable"
      }, /*#__PURE__*/React.createElement("thead", null), /*#__PURE__*/React.createElement("tbody", null, seats.map(function (seat) {
        return /*#__PURE__*/React.createElement("tr", {
          key: seat.rowid
        }, /*#__PURE__*/React.createElement("td", {
          style: {
            textAlign: "center",
            background: seat.colors[0]
          }
        }, seat.cols[0]), /*#__PURE__*/React.createElement("td", {
          style: {
            textAlign: "center",
            background: seat.colors[1]
          }
        }, seat.cols[1]), /*#__PURE__*/React.createElement("td", {
          style: {
            textAlign: "center",
            background: seat.colors[2]
          }
        }, seat.cols[2]), /*#__PURE__*/React.createElement("td", {
          style: {
            textAlign: "center",
            background: seat.colors[3]
          }
        }, seat.cols[3]), /*#__PURE__*/React.createElement("td", {
          style: {
            textAlign: "center",
            background: seat.colors[4]
          }
        }, seat.cols[4]));
      })));
    }
  }]);

  return DisplaySeat;
}(React.Component);

function graphQLFetch(_x) {
  return _graphQLFetch.apply(this, arguments);
}

function _graphQLFetch() {
  _graphQLFetch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(query) {
    var variables,
        response,
        body,
        result,
        error,
        details,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            variables = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
            _context4.prev = 1;
            _context4.next = 4;
            return fetch('/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: query,
                variables: variables
              })
            });

          case 4:
            response = _context4.sent;
            _context4.next = 7;
            return response.text();

          case 7:
            body = _context4.sent;
            result = JSON.parse(body, jsonDateReviver);

            if (result.errors) {
              error = result.errors[0];

              if (error.extensions.code == 'BAD_USER_INPUT') {
                details = error.extensions.exception.errors.join('\n ');
                alert("".concat(error.message, ":\n ").concat(details));
              } else {
                alert("".concat(error.extensions.code, ": ").concat(error.message));
              }
            }

            return _context4.abrupt("return", result.data);

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](1);
            alert("Error in sending data to server: ".concat(_context4.t0.message));

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 13]]);
  }));
  return _graphQLFetch.apply(this, arguments);
}

var HomePage = /*#__PURE__*/function (_React$Component5) {
  _inherits(HomePage, _React$Component5);

  var _super5 = _createSuper(HomePage);

  function HomePage() {
    var _this3;

    _classCallCheck(this, HomePage);

    _this3 = _super5.call(this);
    _this3.state = {
      issues: [],
      blackissues: [],
      showIssueFilter: false,
      showIssueTable: false,
      showIssueAdd: true,
      showBlackIssueAdd: true,
      showSeats: false,
      seatDict: {}
    };
    _this3.createIssue = _this3.createIssue.bind(_assertThisInitialized(_this3));
    _this3.msgDisplay = _this3.msgDisplay.bind(_assertThisInitialized(_this3));
    _this3.msgBlackList = _this3.msgBlackList.bind(_assertThisInitialized(_this3));
    _this3.createBlackIssue = _this3.createBlackIssue.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(HomePage, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadData();
      this.initDict();
    }
  }, {
    key: "loadData",
    value: function () {
      var _loadData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var query, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = "query {\n      issueList {\n        id name phone seatid created\n      }\n    }";
                _context.next = 3;
                return graphQLFetch(query);

              case 3:
                data = _context.sent;

                if (data) {
                  this.setState({
                    issues: data.issueList
                  });
                }

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadData() {
        return _loadData.apply(this, arguments);
      }

      return loadData;
    }()
  }, {
    key: "initDict",
    value: function initDict() {
      var initialDict = {};

      for (var k = 1; k < 26; k++) {
        initialDict[k] = "Available";
      }

      this.setState({
        seatDict: initialDict
      });
    }
  }, {
    key: "createIssue",
    value: function () {
      var _createIssue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(issue) {
        var updateSeatDict, seatNum, query, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                updateSeatDict = this.state.seatDict;
                seatNum = Number(issue.seatid);

                if (!(updateSeatDict[seatNum] == "Available")) {
                  _context2.next = 10;
                  break;
                }

                query = "mutation issueAdd($issue: IssueInputs!) {\n        issueAdd(issue: $issue) {\n          id\n        }\n      }";
                _context2.next = 6;
                return graphQLFetch(query, {
                  issue: issue
                });

              case 6:
                data = _context2.sent;

                if (data) {
                  this.loadData();
                  updateSeatDict[seatNum] = "Occupied";
                  this.setState({
                    seatDict: updateSeatDict
                  });
                  this.msgDisplay("Successful!");
                } else {
                  this.msgDisplay("Failed~");
                }

                _context2.next = 11;
                break;

              case 10:
                this.msgDisplay("Occupied Seat~");

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function createIssue(_x2) {
        return _createIssue.apply(this, arguments);
      }

      return createIssue;
    }()
  }, {
    key: "createBlackIssue",
    value: function () {
      var _createBlackIssue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(blackissue) {
        var query, data;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                query = "mutation blackissueAdd($blackissue: BlackIssueInputs!) {\n      blackissueAdd(blackissue: $blackissue) {\n          name\n      }\n    }";
                _context3.next = 3;
                return graphQLFetch(query, {
                  blackissue: blackissue
                });

              case 3:
                data = _context3.sent;

                if (data) {
                  this.loadData();
                  this.msgBlackList("Successfully add to blacklist");
                }

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function createBlackIssue(_x3) {
        return _createBlackIssue.apply(this, arguments);
      }

      return createBlackIssue;
    }()
  }, {
    key: "msgDisplay",
    value: function msgDisplay(msg) {
      var msgDisp = document.getElementById("msgDisplay");
      msgDisp.textContent = msg;
    }
  }, {
    key: "msgBlackList",
    value: function msgBlackList(msg) {
      var msgDisp = document.getElementById("msgBlackList");
      msgDisp.textContent = msg;
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", null, "Singapore Railway System"), /*#__PURE__*/React.createElement("nav", null, /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: function onClick() {
          _this4.setState({
            showIssueFilter: !_this4.state.showIssueFilter
          });
        }
      }, "Home"), ' | ', /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: function onClick() {
          _this4.setState({
            showIssueAdd: !_this4.state.showIssueAdd
          });
        }
      }, "Add Traveller"), ' | ', /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: function onClick() {
          _this4.setState({
            showBlackIssueAdd: !_this4.state.showBlackIssueAdd
          });
        }
      }, "Add BlackList"), ' | ', /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: function onClick() {
          _this4.setState({
            showIssueTable: !_this4.state.showIssueTable
          });
        }
      }, "Display Reservation"), ' | ', /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: function onClick() {
          _this4.setState({
            showSeats: !_this4.state.showSeats
          });
        }
      }, "Display Seats")), this.state.showIssueFilter ? /*#__PURE__*/React.createElement(IssueFilter, null) : null, /*#__PURE__*/React.createElement("hr", null), this.state.showIssueAdd ? /*#__PURE__*/React.createElement(IssueAdd, {
        createIssue: this.createIssue,
        msgDisplay: this.msgDisplay
      }) : null, this.state.showIssueAdd ? /*#__PURE__*/React.createElement("p", {
        id: "msgDisplay"
      }) : null, /*#__PURE__*/React.createElement("hr", null), this.state.showBlackIssueAdd ? /*#__PURE__*/React.createElement(BlackIssueAdd, {
        createBlackIssue: this.createBlackIssue
      }) : null, this.state.showBlackIssueAdd ? /*#__PURE__*/React.createElement("p", {
        id: "msgBlackList"
      }) : null, /*#__PURE__*/React.createElement("hr", null), this.state.showIssueTable ? /*#__PURE__*/React.createElement(DisplayTraveller, {
        issues: this.state.issues
      }) : null, /*#__PURE__*/React.createElement("hr", null), this.state.showSeats ? /*#__PURE__*/React.createElement(DisplaySeat, {
        seatDict: this.state.seatDict
      }) : null, this.state.showSeats ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
        id: "Ltable"
      }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
        style: {
          background: "lightgrey"
        }
      }, "Available"), /*#__PURE__*/React.createElement("td", {
        style: {
          background: "lightcoral"
        }
      }, "Occupied"))))) : null);
    }
  }]);

  return HomePage;
}(React.Component);

var element = /*#__PURE__*/React.createElement(HomePage, null);
ReactDOM.render(element, document.getElementById('contents'));