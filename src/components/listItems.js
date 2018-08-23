import React from 'react';
import firebase from 'firebase';
import ProductView from './productView'
import { Container, Button, Row, Col } from 'reactstrap';

export default class ListItems extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      firstLoading: 'cargando...',
      items: [],
      loading: false,
      loadMore: true,
      startAt: 0,
      child: 'name',
      limit: 5
    }
  }

  snapshotToArray = (snapshot) => {
    var returnArr = [];
    snapshot.forEach(childSnapshot => {
      var item = childSnapshot.val();
      console.log(childSnapshot.key)
      item.key = childSnapshot.key;
      returnArr.push(item);
    });
    return returnArr;
  }

  toPgination = (items) => {
    //save the last key
    var index = items.length - 1;
    if (items.length < this.state.limit) {
      this.setState({ loadMore: false });
      return items;
    }
    
    this.setState({
      startAt: items[index][this.state.child]
    });
    //and remove it
    items.splice(index, 1);
    return items;
  }

  componentDidMount = () => {
    firebase.database().ref('items/list')
      .orderByChild('name')
      .limitToFirst(this.state.limit)
      .once('value').then(this.pagination)
  }

  pagination = (snapshot) => {
    var items = this.snapshotToArray(snapshot)
    if (items.length > 0) {
      var itemsPrintList = this.toPgination(items)
      itemsPrintList.forEach(item => {
        this.setState({
          items: this.state.items.concat(item)
        })
      })
      return this.setState({loading: false})
    }
    return this.setState({firstLoading: 'No hay productos...'})
  }

  loadItems = () => {
    this.setState({loading: true})
    firebase.database().ref('items')
      .orderByChild('name')
      .startAt(this.state.startAt)
      .limitToFirst(this.state.limit)
      .once('value').then(this.pagination)
  }

  render() {

    return (
    	<Container style={{minHeight: '-webkit-fill-available'}}>  
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
                          desc={item.desc}
                          img={item.img}
                          qty={item.qty}
                          price={item.price}
                          salePrice={item.salePrice}
                          viewPrice={item.viewPrice}
                          offer={item.offer}
                          categories={item.categories}/>
                      </Col>
                    )) 
                  }
                </Row>
                <Row>
                {
                    this.state.loadMore ? (
                      <div>
                        {
                          this.state.loading ? (
                            <Button size='sm' color='primary' disabled>cargando...</Button>
                          ) : (
                            <Button size='sm' color='primary' onClick={this.loadItems}>Mas productos...</Button>
                          )
                        }
                      </div>
                    ) : null
                  }
                </Row>
              </div>
            ) : (
              <p>{this.state.firstLoading}</p>
            )
          }
      </Container>
    );
  }
}