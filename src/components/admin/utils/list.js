import React from 'react';
import { CustomInput, ListGroup } from 'reactstrap';

export default class List extends React.Component {
  render(){
    const { items, change, noItemLabel, filter } = this.props
    return (
      <ListGroup>
      {
        items.length ? items.map((item, index) => (
        	<small key={index}>
        	{
        		filter==true ? (
        			<div>
        				{
        					!item.listSelected ? (
										<CustomInput
            					id={item.key}
            					name='done'
            					type="checkbox"
            					label={item.name}
            					checked={item.done}
            					onChange={change}
            					className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
        					) : null
        				}
        			</div>
        		) : (
        			 <CustomInput
            		  id={item.key}
            		  name='done'
            		  type="checkbox"
            		  label={item.name}
            		  checked={item.done}
            		  onChange={change}
            		  className={`list-group-item-action list-group-item ${item.done ? 'active' : null}`} />
 					  )
        	}
        	</small>
        )) : <small>{noItemLabel}</small>
      }
      </ListGroup>
    )
  }
}