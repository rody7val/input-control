import React from 'react';
import { Card, CardBody, Form, CustomInput, ListGroup, ListGroupItem, ListGroupItemHeading, Collapse, Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, FormText, Badge } from 'reactstrap';

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.change = this.change.bind(this);
    this.state = {
      collapse: [],
      gain: 0
    };
  }

  toggle(index) {
    let arr = this.state.collapse;
    arr[index] = !this.state.collapse[index]
    this.setState({ collapse: arr });
  }

  componentDidMount(){
    this.props.items.forEach((item, index) => {
      this.setState({
        collapse: this.state.collapse.concat({[index]: false })
      })
    });
  }
  
  change(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    if (name === 'salePrice') {
     //calcular % de ganancia
      let dif = Number(Number(value - this.state.price).toFixed(2));
      let porcentaje = Number(Number(dif / value).toFixed(2));
      this.setState({
       gain: porcentaje > 0 ? Number(Number(porcentaje * 100).toFixed(2)) : 0
      })
    }

    this.setState({
      [name]: value
    })
  }

  render(){
    const { items, change, noItemLabel, filter } = this.props;

    return (
      <ListGroup>
      {
        items.length ? items.map((item, index) => (
        	<div key={index}>
        	{
        		filter===true ? (
        			<div>
        				{
        					!item.listSelected ? (
                    <CustomInput
                      id={item.key}
                      name='done'
                      type="checkbox"
                      label={
                        <div>
                          {item.name}{' '}
                          <Badge size='sm' color={item.qty > 0 ? 'primary' : 'danger'} pill>{item.qty}</Badge>
                        </div>
                      }
                      checked={item.done}
                      onChange={change}
                      className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
        					) : null
        				}
        			</div>
        		) : (
              <div>
                
                <CustomInput
                  id={item.key}
                  name={item.key}
                  type="checkbox"
                  label={
                    <div>
                      {item.name}{' '}
                      <Badge size='sm' color={item.qty > 0 ? 'primary' : 'danger'} pill>{item.qty}</Badge>
                      <Button size='sm' color="primary" onClick={() => this.toggle(index)} style={{float: 'right'}}>Edit</Button>
                    </div>
                  }
                  checked={item.done}
                  onChange={change}
                  className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
                    
                
                <Collapse isOpen={this.state.collapse[index]}>
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label for="qty">Stock</Label>
                        <Input required onChange={this.change} value={this.state.qty} type="number" name="qty" id="qty" placeholder="Cantidad de unidades" />
                        <Label for="price">Pcio. Compra</Label>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                          <Input required onChange={this.change} value={this.state.price} step='0.05' type="number" name="price" id="price" placeholder="Precio de compra" />
                        </InputGroup>
                        <Label for="salePrice">Pcio. Venta</Label>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                          <Input required onChange={this.change} value={this.state.salePrice} step='0.05' type="number" name="salePrice" id="salePrice" placeholder="Precio de venta" />
                        </InputGroup>
                        <FormText><Badge>{this.state.gain}%</Badge> de ganancia</FormText>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Collapse>
              </div>
 					  )
        	}
        	</div>
        )) : <small>{noItemLabel}</small>
      }
      </ListGroup>
    )
  }
}