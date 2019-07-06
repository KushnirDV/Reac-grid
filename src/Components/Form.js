import React from 'react';
import PropTypes from 'prop-types';
import './Form.css';

const Form = (props) => {
    return(
        <div className="form">
            <div className="form_item">
                <div className="label">Rows:</div>
                <input type="text" name="rows" id="rows" placeholder="5" onChange={props.setRows} />
            </div>
            <div className="form_item">
                <div className="label">Columns:</div>
                <input type="text" name="clumns" id="columns" placeholder="5" onChange={props.setColumns} />
            </div> 
            <div className="form_item">
                <div className="label">Selected cells:</div>
                <input type="text" name="cells" id="cells" placeholder="2" onChange={props.setSelectedCells} />
            </div> 
        </div> 
    );
}

Form.propTypes = {
    setRows: PropTypes.func,
    setColumns: PropTypes.func,
    setSelectedCells: PropTypes.func
};

export default Form;