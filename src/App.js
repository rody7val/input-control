import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Container, Button, Modal, ModalBody } from 'reactstrap';
import firebase from 'firebase';
import './App.css';

import Menu from './components/menu'
import Admin from './components/admin/index'
import ListItems from './components/listItems'
import Footer from './components/footer'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      load: false,
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
    this.setState({ load: true })
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        this.setState({user: result.user})
        cb()
      })
      .catch(error => {
        this.setState({load: false})
        console.log(`Error ${error.code}: ${error.message}`)
      })
  }

  signout = (cb) => {
    firebase.auth().signOut().then(result => {
      this.setState({user: null})
      cb()
    })
    .catch(error => {
      console.log(`Error ${error.code}: ${error.message}`)
    })
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <Menu signout={this.signout} auth={this.auth} user={this.state.user}/>
            
            <Container style={{minHeight: '-webkit-fill-available'}}>
              <Switch>
                <Route exact path="/" component={ListItems} />
                {
                  this.state.user ? (
                      <Route path="/admin" render={({match}) => (
                        <Admin match={match} user={this.state.user} />
                      )}/> 
                  ) : (
                    <Route path="/admin" component={_403} />
                  )
                }
                <Route component={_404}/>
              </Switch>
            </Container>
            
            <Modal isOpen={this.state.load} >
              <ModalBody>
                <p className='lead'>Registrando..</p>
              </ModalBody>
            </Modal>

            <Footer/>
          </div>
        </Router>

      </div>
    );
  }
}

const _404 = () => (
  <Container style={{padding: '50px'}}>
    <h1 className='text-center'>INSUMAX</h1>
    <br/>
    <h1 className='text-center'><code>404 - Extraviado</code></h1>
    <p className='text-center lead'>¿No encuentras lo que estás buscando? <Link to='/'>Ve a la página principal</Link></p>
  </Container>
);

const _403 = () => (
  <Container style={{padding: '50px'}}>
    <h1 className='text-center'>INSUMAX</h1>
    <br/>
    <h1 className='text-center'><code>403 - Acceso denegado</code></h1>
    <p className='text-center lead'>¿No encuentras lo que estás buscando? <Link to='/'>Ve a la página principal</Link></p>
    <p className='text-center lead'>¿No estas registrado? <Button onClink={this.auth} color='primary'>Rigistrarme</Button></p>
  </Container>
);