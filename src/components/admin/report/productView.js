import React from 'react';
import { Row, Col, Card, CardBody, Badge } from 'reactstrap';
import firebase from 'firebase'

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: {}
    }
  }

  componentDidMount() {
    firebase.database()
      .ref(`items/list/${this.props.match.params.id}`)
      .once('value')
      .then( snapshot => {
        this.setState({ item: snapshot.val() })
      })
  }

  render() {
    return (
      <div>
        <Card className='shadow'>
          <CardBody>
            <Row>
              <Col md={3}>
                <img src={this.state.item.img} style={{
                  maxWidth: '100%',
                }} alt='img-item'/>
              </Col>
              <Col md={9}>
                <p className='lead'>{this.state.item.name}</p>
                <p className='lead'><b>{this.state.item.desc}</b></p>
                {
                  this.state.item.admin ? <Badge color='primary' pill>Admin</Badge> : null
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