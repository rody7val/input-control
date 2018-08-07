import React from 'react';
import {
	Card,
	CardImg,
	CardBody,
	CardTitle,
	CardSubtitle,
	CardText,
	Button,
	Badge } from 'reactstrap';

export default class ProductView extends React.Component {

  render() {
  	const { 
  		name,
			qty,
			price,
			salePrice,
			img,
			viewPrice,
			desc,
			categories } = this.props

    return (
    	<div>
				<Card>
					<CardImg className='cover' top width="100%" src={img} alt="item-img" />
					<CardBody>
					  <CardTitle>{name}</CardTitle>
					  {
					    viewPrice ? (
					      <CardSubtitle>$ {salePrice}</CardSubtitle>
					    ) : null
					  }
					  <CardText className='ellipsis'>{desc}</CardText>
					  <Button size='sm' color='info'>Añadir al pedido</Button>
					</CardBody>
				</Card>
				<br/>
			</div>
    );
  }
}