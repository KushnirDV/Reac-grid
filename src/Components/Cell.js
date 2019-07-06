import React from 'react';
import PropTypes from 'prop-types';
import { cellWithSouldComponentUpdate } from '../Utils/HOGs';

const Cell = ({classic, styles, cell, value, handlerClick, handlerMouseOver, handlerMouseOut}) => {

    return(
        <td className={classic}
            onClick={handlerClick}
            onMouseOver={handlerMouseOver}
            onMouseOut={handlerMouseOut}
            style={styles}
            selected={cell.selected}
            rel={cell.id}
        >
            {value}
        </td>
    );
}

Cell.propTypes = {
    classic: PropTypes.string,
    styles: PropTypes.object,
    cell: PropTypes.object,
    value:  PropTypes.number,
    handlerClick: PropTypes.func,
    handlerMouseOver: PropTypes.func,
    handlerMouseOut: PropTypes.func
};

export default cellWithSouldComponentUpdate(Cell);