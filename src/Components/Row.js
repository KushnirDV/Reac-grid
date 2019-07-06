import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import { rowWithSouldComponentUpdate } from '../Utils/HOGs';

const Row = (props) => {
    const getStyle = (column, amount) => {
        const numCol = column.length-1;
        const percentage = (column[numCol] && column[numCol].sumRow) ? Math.round(amount*100/column[numCol].sumRow) : 0;
        const styleCell = (props.changedRow.chart) ? { background:`linear-gradient(to top, #39ff00 ${percentage}%, transparent 0%)`} : null;

        return styleCell;
    }
    
    const getCells = () => {
        const rowLen = props.data.length-1;
        
        return props.data.map( ( cell, i ) => {

            const isSum   = rowLen === i;
            const classic = (isSum) ? "sum" : (cell.selected) ? "column selected" : "column";
            const style   = (isSum) ? null : getStyle(props.data, cell.amount);
            const val     = (isSum) ? cell.sumRow : (style) ? null : cell.amount;

            const handlerMouseOver = (isSum) ? props.handlers.mouseOverRowSum : props.handlers.mouseOverCell;
            const handlerMouseOut  = (isSum) ? props.handlers.mouseOutRowSum : null;
            const handlerClick     = (isSum) ? null : props.handlers.clickCell;
            
            return(
                <Cell classic={classic} 
                      value={val} 
                      styles={style}
                      key={cell.id}
                      cell={cell}
                      changedRow={props.changedRow}
                      handlerClick={handlerClick}
                      handlerMouseOver={handlerMouseOver} 
                      handlerMouseOut={handlerMouseOut}
                    />
            )
        })
    }
    const getButtons = (rowId, removeRow, addRow) => {
            return(
                <td className="buttons">
                    <div className="remove_wrapper">
                        <div className="remove" 
                                onClick={props.handlers.removeRow}  
                                rel={rowId}
                                key={`${rowId}del`}
                                >
                                &#10799;
                            </div>
                    </div>
                    <div className="add_wrapper">
                        <div className="add" 
                                onClick={props.handlers.addRow}  
                                rel={rowId}
                                key={`${rowId}add`}
                                >
                                &#43;
                        </div>
                    </div>
                </td>
            );
    }

    const getRow = () => {
        return(
            <tr className="row">
                {getCells()}
                {getButtons(props.rowId)}
            </tr>
        )
    }

    return getRow();

}

Row.propTypes = {
    data: PropTypes.array,
    changedRow: PropTypes.object,
    handlers: PropTypes.object,
    rowId: PropTypes.string
};

export default rowWithSouldComponentUpdate(Row);