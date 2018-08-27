import React, { Component } from 'react'
import update from 'react-addons-update';
import SearchInput, {createFilter} from 'react-search-input'
import firebase from 'firebase'
import moment from 'moment'
import { Collapse, FormGroup, Label, InputGroup, InputGroupAddon, FormText, Row, Col, Card, CardHeader, CardBody, Form, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, ListGroup, CustomInput, Badge } from 'reactstrap';

const KEYS_TO_FILTERS = ['name', 'desc']

function addProperties(snapshot) {
	let item = snapshot.val()
	item.key = snapshot.key
  item.collapse = false
  item.done = false
  item.gain = 0
  item.qty = item.qty || 0
  item._qty = 0
  item._salePrice = 0
  item._buyPrice = 0
	return item
}

export default class Buy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //toggle
      modal: false,
      dropdown: false,
      //motion
      items: [],
      itemsEdition: [],
      searchTerm: '',
      grossTotal: 0,
      netTotal: 0,
      date: moment().format('YYYY-MM-DD'),
    }
    
    this.toggle = this.toggle.bind(this)
    this.changeMotion = this.changeMotion.bind(this)
    this.changeEdit = this.changeEdit.bind(this)
    this.collapse = this.collapse.bind(this)
    this.changeInputs = this.changeInputs.bind(this)
    this.searchUpdated = this.searchUpdated.bind(this)
    this.flushItems = this.flushItems.bind(this)    
  }

  toggle(type) {
    this.setState({
      [type]: !this.state[type]
    });
  }

  changeMotion(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  changeEdit(index, event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    //calcular % de ganancia
    if (name === '_salePrice') {
      let dif = Number(Number(value - this.state.itemsEdition[index]._buyPrice).toFixed(2));
      let porcentaje = Number(Number(dif / value).toFixed(2));
      let gain = porcentaje > 0 ? Number(Number(porcentaje * 100).toFixed(2)) : 0;

      this.state.itemsEdition[index].gain = gain;
      this.forceUpdate()
    }

    this.setState({
      itemsEdition: update(this.state.itemsEdition, {
        [index]: {[name]: {$set: value}}
      })
    })

    this.calc()
  }

  collapse(index, event) {
    this.setState({
      itemsEdition: update(this.state.itemsEdition, {
        [index]: {
          collapse: {
            $set: !this.state.itemsEdition[index].collapse
          }
        }
      })
    });
  }

  changeInputs(type, event) {
    let id = event.target.id;
    let position = this.state[type].map(item => {return item.key}).indexOf(id);
    let value = !this.state[type][position].done;
    
    this.setState({
      [type]: update(this.state[type], {
        [position]: {
          done: {
            $set: value
          }
        }
      })
    });
  }

  searchUpdated(term) {
    this.setState({searchTerm: term})
  }

  flushItems(from, to){
    // agregar items froms
    this.setState({
      [to]: update(this.state[to], {
        $push: this.state[from].filter(item => { return item.done })
      })
    });
    // Limpiar editor
    this.setState({
     [from]: this.state[from].filter(item => {
        return item.done == false
      })
    });
  }

  calc(){
    let motinData = this.state.itemsEdition.map(item => { 
      return {
        grossTotal: item._qty * item._buyPrice,
        netTotal: item._qty * item._salePrice
      }
    });

    Array.prototype.joinBy = function(key) {
      var suma = 0;
      Array.forEach(item => {
        suma = suma + Array[key]
      })
      return suma
    };
    
    // this.setState({
    //   grossTotal: this.state.itemsEdition.map(),
    //   netTotal:
    // })
    console.log(motinData)
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
		const {user} = this.props;
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
                              ? <DropdownItem onClick={()=>this.flushItems('itemsEdition', 'items')}>Quitar item(s)</DropdownItem>
                              : <DropdownItem disabled style={{cursor: 'not-allowed'}}>Quitar item(s)</DropdownItem>
                            }
                            </DropdownMenu>
                          </ButtonDropdown>

                          <Button color='info' size='sm' onClick={()=>this.toggle('modal')} style={{float: 'right'}}>Buscar</Button>
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
                                          <Badge size='sm' color={item.qty > 0 ? 'primary' : 'danger'} pill>{item.qty + Number(item._qty)}</Badge>
                                        </div>
                                      }
                                      checked={item.done}
                                      onChange={(event) => this.changeInputs("items", event)}
                                      className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
                                  </div>
                                )
                              })}
                            </ModalBody>
                            <ModalFooter>
                              <Button size='sm' color="secondary" onClick={()=>this.toggle('modal')}>Ocultar</Button>
                              <Button size='sm' onClick={()=>this.flushItems('items','itemsEdition')} color="primary">Añadir a la lista</Button>{' '}
                            </ModalFooter>
                          </Modal>
                        </div>

											</CardHeader>
											<CardBody>

                        <ListGroup>
                          {
                            this.state.itemsEdition.length ? this.state.itemsEdition.map((item, index) => (
                              <div key={index}>
                                <CustomInput
                                  id={item.key}
                                  name='done'
                                  type="checkbox"
                                  label={
                                    <div>
                                      {item.name}{' '}
                                      <Badge size='sm' color={item.qty > 0 ? 'primary' : 'danger'} pill>{item.qty + Number(item._qty)}</Badge>
                                      <Button size='sm' onClick={(event) => this.collapse(index, event)} style={{float: 'right'}}>{item.collapse ? 'Close' : 'Edit'}</Button>
                                    </div>
                                  }
                                  checked={item.done}
                                  onChange={(event) => this.changeInputs("itemsEdition", event)}
                                  className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
                                <Collapse isOpen={item.collapse}>
                                  <Card>
                                    <CardBody>
                                      <FormGroup>
                                        <Label for="qty">Stock</Label>
                                        <Input required onChange={(event) => this.changeEdit(index, event)} value={item._qty} type="number" name="_qty" id="qty" placeholder="Cantidad de unidades" />
                                        <Label for="price">Pcio. Compra</Label>
                                        <InputGroup>
                                          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                          <Input required onChange={(event) => this.changeEdit(index, event)} value={item._buyPrice} step='0.05' type="number" name="_buyPrice" id="price" placeholder="Precio de compra" />
                                        </InputGroup>
                                        <Label for="salePrice">Pcio. Venta</Label>
                                        <InputGroup>
                                          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                                          <Input required onChange={(event) => this.changeEdit(index, event)} value={item._salePrice} step='0.05' type="number" name="_salePrice" id="salePrice" placeholder="Precio de venta" />
                                        </InputGroup>
                                        <FormText><Badge color={item.gain > 10 ? 'success' : 'danger' }>{item.gain}%</Badge> de ganancia</FormText>
                                      </FormGroup>
                                    </CardBody>
                                  </Card>
                                </Collapse>
                              </div>
                            )) : <small>Busca unos productos..</small>
                          }
                        </ListGroup>
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
                        <FormGroup>
                          <Label for="date">Fecha</Label>
                          <Input required type="date" name="date" onChange={this.changeMotion} value={this.state.date} id="date" />
                          <Label for="user">Usuario</Label>
                          <Input required type="text" name="user" id="user" />
                          <Input required type="text" readonly name="userName" id="user" />
                          <Label for="total">Total Bruto</Label>
                          <Input required type="number" readonly onChange={this.changeMotion} value={this.state.grossTotal} name="grossTotal" id="grossTotal" />
                          <Label for="total">Total Neto</Label>
                          <Input required type="number" readonly onChange={this.changeMotion} value={this.state.netTotal} name="netTotal" id="netTotal" />
                        </FormGroup>
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