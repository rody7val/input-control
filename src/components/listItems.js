import React from 'react';
import { Link } from 'react-router-dom'
import firebase from 'firebase';
import ProductView from './productView'
import {
	Button,
	Row,
	Col,
	CardDeck } from 'reactstrap';


export default class ListItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = {	
    	items: [],
    	loadMore: true,
    	loading: false,
    	startAt: 0,
    	limit: 5
    }
    this.loadItems = this.loadItems.bind(this)
  }

	snapshotToArray = (snapshot) => {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
	}

	toPgination = (items) => {
		var index = items.length - 1;
    if (items.length < this.state.limit) {
      this.setState({ loadMore: false });
      return items;
    }

    //save the last key
  	this.setState({
  		startAt: items[index].key
  	});

  	//and remove it
  	items.splice(index, 1);
  	return items;
	}

  componentDidMount = () => {
  	const itemsRef = firebase.database().ref('items')
  		.orderByValue()
  		.limitToFirst(this.state.limit)
  		.startAt(this.state.startAt);

  	itemsRef.once('value', (snapshot) => {
			// last key to pagination
  		var items = this.snapshotToArray(snapshot)
  		var itemsPrintList = this.toPgination(items)

  		itemsPrintList.forEach(item => {
  			this.setState({
  				items: this.state.items.concat(item)
  			})
  		})
  	})
  }

	loadItems = () => {
  	const itemsRef = firebase.database().ref('items')
  		.orderByKey()
  		.limitToFirst(this.state.limit)
  		.startAt(this.state.startAt);

  	itemsRef.once('value', (snapshot) => {
			// last key to pagination
  		var items = this.snapshotToArray(snapshot)
      var itemsPrintList = this.toPgination(items)
      console.log(itemsPrintList)

  		itemsPrintList.forEach(item => {
  			this.setState({
  				items: this.state.items.concat(item)
  			})
  		})
  	})
	}

  render() {

    return (
    	<div>
    		<br/>
    		<h3>Productos</h3>
    			{
    				this.state.items.length ? (
    					<div>
    						<Row>
    							{
    								this.state.items.map((item, index) => (
    									<Col key={index} md={3}>
    										<ProductView  
    										  name={item.name}
    										  qty={item.qty}
    										  price={item.price}
    										  salePrice={item.salePrice}
    										  img={item.img}
    										  viewPrice={item.viewPrice}
    										  desc={item.desc}
    										  categories={item.categories}/>
    									</Col>
    							  )) 
    							}
								</Row>
    						<Row>
    							{
    								this.state.loadMore ? (
    									<Button size='sm' color='primary' onClick={this.loadItems}>Mas productos...</Button>
    								) : (
    									<small>Eso es todo...</small>
    								)
    							}
    						</Row>
    					</div>
    				) : (
    					<p>Cargando...</p>
    				)
    			}
    	</div>
    );
	}
}