import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'reactstrap';
import firebase from 'firebase';
import './App.css';

import Menu from './components/menu'
import Admin from './components/admin/index'
import ListItems from './components/listItems'
import Footer from './components/footer'

const _403 = () => <p><code>403</code> Sección privada, accede al sistema.</p>;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      var _user = user || {};
      var myVar;
      myVar = setTimeout(() => {
        firebase.database()
          .ref(`users/list/${user.uid}`)
          .on('value', snapshot => {
            if (snapshot.val() && snapshot.val().active) {
              this.setState({load: false})
              console.log('clear!')  
              clearTimeout(myVar);
            }
            _user.admin = snapshot.val().admin
            _user.active = snapshot.val().active
            _user.created = snapshot.val().created
            this.setState({ user: _user })
        })
      }, 3000);
    })
  }

  auth = (cb) => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        this.setState({user: result.user})
        console.log(`${result.user.email} ha iniciado sesión.`)
        cb()
      })
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  signout = (cb) => {
    firebase.auth().signOut()
      .then(result => {
        this.setState({user: null})
        console.log(`sesión cerrada.`)
        cb()
      })
      .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  render() {

    return (
      <div>
        <Router>
          <div>
            <Menu signout={this.signout} auth={this.auth} user={this.state.user}/>
            
            <Container style={{minHeight: '-webkit-fill-available'}}>
              <Route exact path="/" component={ListItems} />
              { 
                this.state.user ? 
                <Route path="/admin" render={({match}) => (
                  <Admin match={match} user={this.state.user} />
                )}/> 
                : 
                <Route path="/admin" component={_403} />
              }
            </Container>
            
            <br/>
            <br/>
            <Footer/>
          </div>
        </Router>

      </div>
    );
  }
}


export default App;
