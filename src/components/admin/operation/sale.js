import React, { Component } from 'react'
import SearchInput, {createFilter} from 'react-search-input'
import firebase from 'firebase'
// import Buscador from './buscador'
import {
	Row,
	Col,
	Card,
	CardHeader,
	CardBody,
	Form,
	ButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, ListGroup, CustomInput, Badge } from 'reactstrap';


const KEYS_TO_FILTERS = ['name', 'desc']

function addProperties(snapshot) {
	let item = snapshot.val()
	item.key = snapshot.key
	item.done = false
	item.listSelected = false
	return item
}

export default class Buy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      dropdown: false,
      searchTerm: '',
      items: []
    }
    this.searchUpdated = this.searchUpdated.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle(type) {
    this.setState({
      [type]: !this.state[type]
    });
  }

  searchUpdated(term) {
    this.setState({searchTerm: term})
  }

  componentWillMount = () => {
  	firebase.database()
  		.ref('items/list')
  		.orderByChild('name')
  		.once('value')
  		.then(snapshot => {
  			snapshot.forEach(item => {
  				this.setState({
  					items: this.state.items.concat(addProperties( item )),
  				})
  			})
  		})
  }

	render() {
		let filteredItems = this.state.items.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
		return (
			<div>
			<h3>Nueva Compra</h3>
			<Row>
				<Col md={12}>
					<Card className='shadow'>
						<CardBody>
						<Row>
							<Col md={6} sm={12}>
								<Row>
									<Col md={12}>
										<Card className='shadow'>

											<CardHeader tag="h5">
												Buscadorrr
                        <div style={{display: 'inline'}}>
                          <Button onClick={()=>this.toggle('modal')} style={{float: 'right'}}>Buscar producto</Button>
                          <Modal size='lg' isOpen={this.state.modal} toggle={()=>this.toggle('modal')}>
                            <ModalHeader toggle={()=>this.toggle('modal')}>
                              <SearchInput className="search-input" onChange={this.searchUpdated} />
                            </ModalHeader>
                            <ModalBody>
                              {filteredItems.map(item => {
                                return (
                                  <div >
                                    <CustomInput
                                      key={item.key}
                                      id={item.key}
                                      name='done'
                                      type="checkbox"
                                      label={
                                        <div>
                                          {item.name}{' '}
                                          <small>- {item.desc}</small>{' '}
                                          <Badge size='sm' color={item.qty > 0 ? 'primary' : 'danger'} pill>{item.qty}</Badge>
                                        </div>
                                      }
                                      checked={item.done}
                                      
                                      className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
                                  </div>
                                )
                              })}
                            </ModalBody>
                            <ModalFooter>
                              <Button size='sm' color="secondary" onClick={()=>this.toggle('dropdown')}>Ocultar</Button>
                              <Button size='sm' color="primary">Añadir a la lista</Button>{' '}
                            </ModalFooter>
                          </Modal>
                        </div>
                      </CardHeader>

										</Card>
      					    <br/>
      					  </Col>
									<Col md={12}>
										<Card className='shadow'>
											<CardHeader tag="h5">
												Listado
												<ButtonDropdown size='sm' style={{float: 'right'}} isOpen={this.state.dropdown} toggle={this.toggle}>
      									  <DropdownToggle caret>
      									    Acciones
      									  </DropdownToggle>
      									  <DropdownMenu>
      									    <DropdownItem onClick={this.listToSearch}>Quitar item(s)</DropdownItem>
      									  </DropdownMenu>
      									</ButtonDropdown>
											</CardHeader>
											<CardBody>
                         
                      </CardBody>
                    </Card>
                    <br/>
                  </Col>
                </Row>
              </Col>
              <Col md={6} sm={12}>
                  <Card className='shadow'>
                  <CardHeader tag="h5">Compra</CardHeader>
                    <CardBody>
                      <Form onSubmit={this.crear}>
                      </Form>
                    </CardBody>
                  </Card>
                  <br/>
              </Col>
            </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      </div>
    )
  }
}
            						// <List 
                         // items={this.state.itemsList}
                         // change={this.changeInputsList}
                         // filter={false}
            						 // noItemLabel={'Ningun producto seleccionado'}/>