import React, { Component } from 'react'
import update from 'react-addons-update';
import SearchInput, {createFilter} from 'react-search-input'
import firebase from 'firebase'
import List from '../utils/list'
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
      items: [],
      itemsEdition: []

    }
    this.toggle = this.toggle.bind(this)
    this.searchUpdated = this.searchUpdated.bind(this)
    this.changeInputsSearch = this.changeInputsSearch.bind(this)
    this.flush = this.flush.bind(this)
    this.changeInputsEditor = this.changeInputsEditor.bind(this)
    
  }

  toggle(type) {
    this.setState({
      [type]: !this.state[type]
    });
  }

  searchUpdated(term) {
    this.setState({searchTerm: term})
  }

  changeInputsSearch(event) {
    let id = event.target.id;
    let position = this.state.items.map(item => {return item.key}).indexOf(id);
    let value = !this.state.items[position].done;
    
    this.setState({
      items: update(this.state.items, {
        [position]: {done: {$set: value}}
      })
    });
  }
  
  changeInputsEditor(event) {
    let id = event.target.id;
    let position = this.state.itemsEdition.map(item => {return item.key}).indexOf(id);
    let value = this.state.itemsEdition[position] ? !this.state.itemsEdition[position].done : null;
    
    this.setState({
      itemsEdition: update(this.state.itemsEdition, {
        [position]: {done: {$set: value}}
      })
    });
  }

  flush(from, to){
    console.log(from, to)
    // agregar items froms
    this.state[from].forEach( (item, index) => {
      this.setState({
        [to]: update(this.state[to], {
          $push: this.state[from].filter(item => { return item.done })
        })
      });
    });
    // Limpiar editor
    this.setState({
     [from]: this.state[from].filter(item => {
        return item.done == false
      })
    });
  }

  componentWillMount() {
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
			<h3 className='title'>Venta</h3>
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
												Edición

                        <div style={{float: 'right'}}>
                          <ButtonDropdown size='sm' style={{float: 'right'}} isOpen={this.state.dropdown} toggle={()=>this.toggle('dropdown')}>
                            <DropdownToggle caret>
                              Acciones
                            </DropdownToggle>
                            <DropdownMenu>
                            {
                              this.state.itemsEdition.length > 0
                              ? <DropdownItem onClick={()=>this.flush('itemsEdition', 'items')}>Quitar item(s)</DropdownItem>
                              : <DropdownItem disabled style={{cursor: 'not-allowed'}}>Quitar item(s)</DropdownItem>
                            }
                            </DropdownMenu>
                          </ButtonDropdown>

                          <Button color='info' size='sm' onClick={()=>this.toggle('modal')} style={{float: 'right'}}>Buscar producto</Button>
                          <Modal size='lg' isOpen={this.state.modal} toggle={()=>this.toggle('modal')}>
                            <ModalHeader toggle={()=>this.toggle('modal')}>
                              <SearchInput onChange={this.searchUpdated} />
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
                                      onChange={this.changeInputsSearch}
                                      className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
                                  </div>
                                )
                              })}
                            </ModalBody>
                            <ModalFooter>
                              <Button size='sm' color="secondary" onClick={()=>this.toggle('modal')}>Ocultar</Button>
                              <Button size='sm' onClick={()=>this.flush('items','itemsEdition')} color="primary">Añadir a la lista</Button>{' '}
                            </ModalFooter>
                          </Modal>
                        </div>

											</CardHeader>
											<CardBody>
                        <List 
                         items={this.state.itemsEdition}
                         change={this.changeInputsEditor}
                         filter={false}
                         noItemLabel={'Ningun producto seleccionado'}/>
                      </CardBody>
                    </Card>
                    <br/>
                  </Col>
                </Row>
              </Col>
              <Col md={6} sm={12}>
                  <Card className='shadow'>
                  <CardHeader tag="h5">Movimiento</CardHeader>
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