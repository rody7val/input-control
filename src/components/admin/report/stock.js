import React from 'react';
import firebase from 'firebase';
import { ListGroup, ListGroupItem, Badge, Card, CardBody } from 'reactstrap';
import moment from 'moment'

export default class Stock extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			items: [],
			load: 'cargando...'
		}
	}

  componentDidMount = () => {
    firebase.database()
      .ref('items')
      .orderByChild('created')
      .on('child_added', snapshot => {
          this.setState({
            items: this.state.items.concat(snapshot.val())
          })
      })
  }

render() {

    return (
    	<div>
    		<h3>Productos</h3>
    		<Card className='shadow'>
    			<CardBody>
      			<ListGroup>
    					{
    						this.state.items.length ? this.state.items.map( (item, index) => (
      			  		<ListGroupItem key={index} className="justify-content-between">{item.name} <Badge pill>{moment(item.created).calendar()}</Badge></ListGroupItem>
    						)) : <small>{this.state.load}</small>
    					}
      			</ListGroup>
    			</CardBody>
      	</Card>
    	</div>
    );
	}
}