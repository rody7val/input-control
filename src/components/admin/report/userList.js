import React from 'react'
import firebase from 'firebase'
import {Link} from 'react-router-dom'
import { Row, Col, ListGroup, ListGroupItem, Badge, Card, CardBody } from 'reactstrap';

export default class userList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  componentDidMount = () => {
    firebase.database()
      .ref('users/list/')
      .once('value')
      .then( snapshot => {
      	snapshot.forEach( user => {
        	this.setState({ users: this.state.users.concat(user.val()) })
      	})
      })
  }
  render() {
  	const { match } = this.props

    return (
			<div>
        <h3>Usuarios registrados</h3>
        <Card className='shadow'>
          <CardBody>
            <ListGroup>
            {
              this.state.users.length ? this.state.users.map((user, index) => (
                <ListGroupItem key={index}>
                 <Row>
                		<Link style={{display: 'flex'}} className='btn btn-link listUser' to={`${match.url}/${user.uid}`}>
                   <Col md={2}>
                    	<img src={user.photoURL} style={{
                      	maxWidth: '40px',
                      	borderRadius: '50%'
                    	}} alt='img-user'/>
                    </Col>
                    <Col md={10}>
                    	<p className='lead'>
                     		{user.displayName}
                     		{' '}
                     		{
                     			user.admin ? <Badge color='primary' pill>admin</Badge> : null
                     		}
                    	</p>
                    </Col>
                 </Link>
                 </Row>
                </ListGroupItem>
              )) : <p className='lead'>cargando...</p>
            }
            </ListGroup>
          </CardBody>
        </Card>
      </div>
    );
  }
}
