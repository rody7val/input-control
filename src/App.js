import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'
import { Container } from 'reactstrap';
import firebase from 'firebase';
import './App.css';

import Menu from './components/menu'
import Admin from './components/admin/index'
import ListItems from './components/listItems'

const Contacto = () => <p>Formulario de contacto.</p>;
const Empresa = () => <p>Descripcion de la empresa.</p>;
const _403 = () => <p><code>403</code> Sección privada, accede al sistema.</p>;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {

      const propsAdminUserRef = firebase.database().ref(`users/${user.uid}`)
      propsAdminUserRef.once('value').then(snapshot => {
        user.admin = snapshot.val().admin
        user.active = snapshot.val().active
        user.created = snapshot.val().created
        this.setState({ user })
      })

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
        this.setState({user: {}})
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

            
              <Container>
                <Route exact path="/" component={ListItems} />
                <Route exact path="/company" component={Empresa} />
                <Route exact path="/contact" component={Contacto} />
                { 
                  this.state.user ? 
                  <Route path="/admin" render={({match}) => (
                    <Admin match={match} user={this.state.user} />
                  )}/> 
                  : 
                  <Route path="/admin" component={_403} />
                }
              </Container>
            
          </div>
        </Router>

        <br/>
      </div>
    );
  }
}


export default App;
