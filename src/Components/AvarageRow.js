import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import { avarageRowWithSouldComponentUpdate } from '../Utils/HOGs';

const AvarageRow = (props) => {
    const getColumnAvarage = cell => {
        let number = cell.amount / props.columnLen;
        return +number.toFixed(2);
    }

    const getCells = props => {
        return props.data.map( cell => {
            return(
                <Cell classic="sum" 
                      value={getColumnAvarage(cell)} 
                      changedRow={props.changedRow}
                      cell={cell} 
                      key={cell.id}
                    />
            )
        })
    }

    return (
        <tr className="avarage" onMouseOver={props.handlerCleartable}>
            {getCells(props)}
        </tr>        
    )

}

AvarageRow.propTypes = {
    data: PropTypes.array,
    changedRow: PropTypes.object,
    columnLen:  PropTypes.number,
    handlerCleartable: PropTypes.func
};

export default avarageRowWithSouldComponentUpdate(AvarageRow);