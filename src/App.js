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

  componentDidMount() {
    firebase.database()
      .ref('load')
      .on('value', snapshot => {
        this.setState({ load: snapshot.val() })
      })
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        return firebase.database()
          .ref(`users/list/${user.uid}`)
          .on('value', snapshot => {
            if (snapshot.val() && snapshot.val().active) {
              this.setState({load: false})
              console.log('clear!')
            }
            user.admin = snapshot.val().admin
            user.active = snapshot.val().active
            user.created = snapshot.val().created
            this.setState({ user: user })
        })
      }
      
      this.setState({user: null})
    })
  }

  auth(cb) {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.database().ref('load').set(true);
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        this.setState({user: result.user})
        cb()
      })
      .catch(error => {
        firebase.database().ref('load').set(false);
        console.log(`Error ${error.code}: ${error.message}`)
      })
  }

  signout(cb) {
    firebase.auth().signOut().then(result => {
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
            
            <div style={{marginTop: '60px'}}>
              <Switch>
                <Route exact path="/" component={ListItems} />
                {
                  this.state.user ? (
                      <Route path="/admin" render={({match}) => (
                        <Container style={{minHeight: '-webkit-fill-available'}}>
                          <Admin match={match} user={this.state.user} />
                        </Container> 
                      )}/> 
                  ) : (
                    <Route path="/admin" component={_403} />
                  )
                }
                <Route component={_404}/>
              </Switch>
            </div>
            
            <Modal isOpen={this.state.load} >
              <ModalBody>
                <p className='lead'>Cargando...</p>
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
  <Container style={{padding: '50px', minHeight: '-webkit-fill-available'}}>
    <h1 className='text-center'>INSUMAX</h1>
    <br/>
    <h1 className='text-center'><code>404 - Extraviado</code></h1>
    <p className='text-center lead'>¿No encuentras lo que estás buscando? <Link to='/'>Ve a la página principal</Link></p>
  </Container>
);

const _403 = () => (
  <Container style={{padding: '50px', minHeight: '-webkit-fill-available'}}>
    <h1 className='text-center'>INSUMAX</h1>
    <br/>
    <h1 className='text-center'><code>403 - Acceso denegado</code></h1>
    <p className='text-center lead'>¿No encuentras lo que estás buscando? <Link to='/'>Ve a la página principal</Link></p>
    <p className='text-center lead'>¿No estas registrado? <Button onClink={()=>{ 
      this.auth(() => {
        console.log('auth')
      }) 
    }} color='primary'>Rigistrarme</Button></p>
  </Container>
);