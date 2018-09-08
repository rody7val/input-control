import React from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom'
import { ListGroup, ListGroupItem, Badge, Card, CardBody, Row, Col } from 'reactstrap';
import moment from 'moment'

export default class Products extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			items: [],
			load: 'cargando...'
		}
	}

  componentDidMount = () => {
    firebase.database()
      .ref('items/list')
      .orderByChild('created')
      .once('value')
      .then(snapshot => {
        snapshot.forEach(Item => {
          var item = Item.val();
          item.key = Item.key;
          this.setState({
            items: this.state.items.concat(item)
          });
        })
      })
  }

render() {
  const { match } = this.props

    return (
    	<div>
    		<h3>Productos</h3>
    		<Card className='shadow'>
    			<CardBody>
      			<ListGroup>
    					{
    						this.state.items.length ? this.state.items.map( (item, index) => (
      			  		<ListGroupItem key={index}>
                    <Row>
                      <Link style={{display: 'flex'}} className='btn btn-link listUser' to={`${match.url}/${item.key}`}>
                        <Col md={2}>
                          <img src={item.img} style={{
                            maxWidth: '40px'
                          }} alt='img-user'/>
                        </Col>
                        <Col md={10}>
                          {item.name} <Badge pill>{moment(item.created).calendar()}</Badge>
                        </Col>
                      </Link>
                    </Row>
                  </ListGroupItem>
    						)) : <small>{this.state.load}</small>
    					}
      			</ListGroup>
    			</CardBody>
      	</Card>
    	</div>
    );
	}
}