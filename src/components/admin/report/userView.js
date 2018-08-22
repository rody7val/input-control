import React from 'react';
import { Row, Col, Card, CardBody, Badge } from 'reactstrap';
import firebase from 'firebase'

export default class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {}
    }
  }

  componentDidMount = () => {
    firebase.database()
      .ref(`users/list/${this.props.match.params.uid}`)
      .once('value')
      .then( snapshot => {
        this.setState({ user: snapshot.val() })
      })
  }

  render() {
    return (
      <div>
        <Card className='shadow'>
          <CardBody>
            <Row>
              <Col md={4}>
                <img src={this.state.user.photoURL} style={{
                  maxWidth: '100%',
                  borderRadius: '50%'
                }} alt='img-user'/>
              </Col>
              <Col md={8}>
                <p className='lead'>{this.state.user.displayName}</p>
                <p className='lead'><b>{this.state.user.email}</b></p>
                {
                  this.state.user.admin ? <Badge color='primary' pill>Admin</Badge> : null
                }
              </Col>
            </Row>
          </CardBody>
        </Card>
        <br/>
      </div>
    );
  }
}