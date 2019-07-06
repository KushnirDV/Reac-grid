import React from 'react';

export const cellWithSouldComponentUpdate = (WrappedComponent) => {
    return class extends React.Component {
        shouldComponentUpdate(nextProps){
            if(nextProps.value !== this.props.value)
                return true;

            if(nextProps.changedRow.chart !== this.props.changedRow.chart)
                return true;

            if(nextProps.cell.selected !== this.props.cell.selected)
                return true;

            return false;
        }
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
  }

export const rowWithSouldComponentUpdate = (WrappedComponent) => {
    return class extends React.Component {
        shouldComponentUpdate(nextProps){
            const sumCol = this.props.data.length - 1;

            if(!nextProps.changedRow.id || parseInt(nextProps.changedRow.id) === parseInt(this.props.data[sumCol].id)){
                return true;
            }
            
            return false;
            
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
}

export const avarageRowWithSouldComponentUpdate = (WrappedComponent) => {
    return class extends React.Component {
        shouldComponentUpdate(nextProps){
            if(nextProps.changedRow.chart === this.props.changedRow.chart)
                return true;

            return false;
        }
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
  }