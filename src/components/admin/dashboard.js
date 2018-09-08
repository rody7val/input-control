import React from 'react';
import firebase from 'firebase';
import { Link } from 'react-router-dom'
import { Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';

export default class Stock extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			countUsers: 0,
			countOrders: 0,
			countItems: 0,
		}
	}

  componentDidMount = () => {
    firebase.database()
      .ref('items')
      .child('count')
      .on('value', snapshot => {
        this.setState({
          countItems: snapshot.val()
        })
      })

    firebase.database()
      .ref('users')
      .child('count')
      .on('value', snapshot => {
        this.setState({
          countUsers: snapshot.val()
        })
      })
  }

render() {
	const { match } = this.props

    return (
    	<div>
    		<Row>
          <Col md={3}>
          </Col>
          <Col md={3} sm={12}>
            <Link to={`${match.url}/report/motions`}>
              <Card className='shadowHover' inverse color="info">
                <CardBody>
                  <Row>
                    <Col md={4} sm={4} xs={4} className='text-left'>
                      <i className='fa fa-shopping-cart' style={{fontSize: '50px'}}></i>
                    </Col>
                    <Col md={8} sm={8} xs={8} className='text-right'>
                      <CardTitle tag="h1">{this.state.countOrders}</CardTitle>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} className='text-right'>
                      <CardText>Pedidos Nuevos</CardText>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Link>
            <br/>
          </Col>

          <Col md={3} sm={12}>
            <Link to={`${match.url}/report/products`}>
              <Card className='shadowHover' inverse color="danger">
                <CardBody>
                  <Row>
                    <Col md={4} sm={4} xs={4} className='text-left'>
                      <i className='fa fa-archive' style={{fontSize: '50px'}}></i>
                    </Col>
                    <Col md={8} sm={8} xs={8} className='text-right'>
                      <CardTitle tag="h1">{this.state.countItems}</CardTitle>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} className='text-right'>
                      <CardText>Productos</CardText>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Link>
            <br/>
          </Col>

					<Col md={3} sm={12}>
						<Link to={`${match.url}/report/users`}>
    					<Card className='shadowHover' inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
    						<CardBody>
    							<Row>
		    						<Col md={4} sm={4} xs={4} className='text-left'>
    									<i className='fa fa-user' style={{fontSize: '50px'}}></i>
		    						</Col>
		    						<Col md={8} sm={8} xs={8} className='text-right'>
    									<CardTitle tag="h1">{this.state.countUsers}</CardTitle>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12} className='text-right'>
    						      <CardText>Usuarios</CardText>
                    </Col>
                  </Row>
                </CardBody>
      				</Card>
						</Link>
      			<br/>
					</Col>

				</Row>
    	</div>
    );
	}
}