import React, { Component } from 'react';

import './App.css';
import Form from './Components/Form';
import Row from './Components/Row';
import AvarageRow from './Components/AvarageRow';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      matrixSize:{
        rows: 5,
        columns: 5,
        selectedCells: 2
      },
      matrixData: [],
      changedRow: {id:'', chart: false}
    };

    this.prevBiggestSiblings = [];
  }
    // FORM HANDLERS
  setColumns = e => {
      const columns = e.target.value;
      var reg = new RegExp(/^\d+$/);
      if(!columns || !reg.test(columns))
          return;
      const matrixData = this.prepareMatrix(this.state.matrixSize.rows, parseInt(columns));
      this.setState({
          matrixSize:{
              rows: this.state.matrixSize.rows,
              columns,
              selectedCells: this.state.matrixSize.selectedCells
          },
          matrixData: matrixData,
          changedRow: {id:'', chart: false}
      });
  }

  setRows = e => {
      const rows = e.target.value;
      var reg = new RegExp(/^\d+$/);
      if(!rows || !reg.test(rows))
          return;
      
      const matrixData = this.prepareMatrix(rows, this.state.matrixSize.columns);
      this.setState({
          matrixSize:{
              rows,
              columns: this.state.matrixSize.columns,
              selectedCells: this.state.matrixSize.selectedCells
          },
          matrixData: matrixData,
          changedRow: {id:'', chart: false}
      });
  }

  setSelectedCells = e => {
      const numberCells = e.target.value;
      var reg = new RegExp(/^\d+$/);
      if(!numberCells || !reg.test(numberCells))
          return;

      this.setState({
          matrixSize:{
              rows: this.state.matrixSize.rows,
              columns: this.state.matrixSize.columns,
              selectedCells: parseInt(numberCells),

          }
      });
  }
      // TABLE HANDLERS 
  handlers = {
    clickCell: e => {
                      const [rowNum, col] = this.getCellId(e).split('_');
                      const rowItem = this.prepareRowId(rowNum);
                      
                      this.setState(state => {
                          let data = state;

                          const row = data.matrixData[rowItem].slice(),
                                avarage = data.matrixData.avarage.slice(),
                                newCell = row[col],
                                sumCol = row.length-1,
                                newSum = row[sumCol],
                                newAvarage = avarage[col];

                          data.matrixData[rowItem][col] = { ...newCell, amount: newCell.amount + 1 };
                          data.matrixData[rowItem][sumCol] = { ...newSum, sumRow: newSum.sumRow + 1 };
                          data.matrixData.avarage[col] = { ...newAvarage, amount: newAvarage.amount + 1}
                      
                          data.changedRow = {id:rowItem, chart: false};
                          return {...state, ...data}
                      });
                  },

    mouseOutRowSum: event => {
                    const id = this.getCellId(event);
                    if(this.state.changedRow.chart){
                        this.setState({changedRow:{id, chart: false}});
                    }
                },
            
    mouseOverRowSum: event => {
                if(this.prevBiggestSiblings.length)
                  this.updateCells();
                const id = this.getCellId(event);
                    if(id !== 'avarage'){
                      setTimeout(()=>{
                        this.setState({changedRow:{id, chart: true}});
                      }, 0);
                    }
                },

    removeRow: event => {
                  this.updateCells();
                  const id = this.getCellId(event);
                  setTimeout(()=>{
                    this.setState( state => {
                        let data = {...state};
                        const removedData = [...data.matrixData[id]];
                        delete data.matrixData[id];
                
                        data.matrixData.avarage.forEach( (el, i) => {
                            el.amount -= removedData[i].amount;
                        });
                        data.changedRow.id = id;
                        return {...data};
                    });
                  }, 0);
              },
              
    addRow: event => {
                  const len = Object.keys(this.state.matrixData).length-1;
                  const newId = this.getRowId(len);
                  let data = {...this.state};
                  let avarages = [...this.state.matrixData.avarage]
              
                  const rowId = newId+'row';    
                  const id = parseInt(event.target.attributes.rel.value);
                  const resp = this.prepareRow(newId, avarages, data.matrixSize.columns);
                  
                  data.matrixData = this.getNewMatrixData(id, resp.row, rowId, data.matrixData);;
                  data.matrixData.avarage = resp.avar;
                  data.changedRow.id = rowId;
                  this.setState( state => {
                      return {...state, ...data};
                  });
                  
              },
    mouseOverCell: e => {
                    const selectedId = this.getCellId(e);
                    
                    const siblingsLen = this.state.matrixSize.selectedCells;
                    const closerNums = this.collectClotherNumbers(this.state.matrixData, siblingsLen, parseInt(e.target.innerText), selectedId);
                    const bigestCellSiblings = this.getBiggestSiblings({...closerNums}, siblingsLen);
                    
                    this.updateCells(bigestCellSiblings);
                  },
    hanlerMouseLeaveTable: e => {
      this.updateCells()
    },
  }

    // WORK WITH SELECED CELLS
  updateCells = (bigestCellSiblings = []) => {
    const tempSiblings = Array.prototype.concat(bigestCellSiblings, this.prevBiggestSiblings);

    this.setState(state => {
      let data = state;

      tempSiblings.forEach( cell => {
        const [row, col] = cell.id.split('_');
        const rowId = this.prepareRowId(row);
        const rowData = data.matrixData[rowId].slice();
        const newCell = rowData[col];
        data.matrixData[rowId][col] = { ...newCell, selected: !newCell.selected };
      });

      return {...state, ...data, changedRow:{id: 0, chart: false}}
    });

    this.prevBiggestSiblings = bigestCellSiblings;
  }

  getBiggestSiblings = ({biggerNums, smallerNums, sameNums}, siblingsLen) => {
    let bigestSiblings = [];
    if(sameNums.length >= siblingsLen){
      bigestSiblings = sameNums.splice(0, siblingsLen);
    }else{
      sameNums = sameNums.concat(biggerNums);
    }
    if(sameNums.length >= siblingsLen && smallerNums.length === 0){
      bigestSiblings = sameNums.splice(0, siblingsLen);
    }else{
      sameNums = smallerNums.reverse().concat(sameNums);
      if(sameNums.length === siblingsLen){
        bigestSiblings = sameNums.slice();
        }else{
          const extra = sameNums.length - siblingsLen;
          const startPos = Math.round(extra/2-extra%2);
          bigestSiblings = sameNums.splice(startPos, siblingsLen);
        }
      }
      return bigestSiblings;
    }

    collectClotherNumbers = (matrix, siblingsLen, selectedNum, selectedId) => {
      const matLen = Object.keys(matrix).length-1;

      let biggerNums = [], 
          smallerNums = [],
          sameNums = [];
      
      Object.keys(matrix).forEach( ( row, it ) => {
        if( matLen !== it ){
          const rowLen = matrix[row].length - 1;
          matrix[row].forEach(( cell, i ) => {
            if(rowLen > i){
              const currentNum = cell.amount;
              if(selectedNum === currentNum && selectedId !== cell.id){
                sameNums.push(cell);
              }else if(selectedNum < currentNum){
                if(biggerNums.length >= siblingsLen){
                  biggerNums.splice(-1,1,cell);
                }else{
                  biggerNums.push(cell);
                }
                biggerNums.sort(function(a, b) {
                    return (a.amount - b.amount);
                });
              }else if(selectedNum > currentNum){
                if(smallerNums.length >= siblingsLen){
                  smallerNums.splice(-1, 1, cell);
                }else{
                  smallerNums.push(cell);
                }
                smallerNums.sort(function(a, b) {
                    return (b.amount - a.amount);
                });
              }              
            }
          });

        }
      });

      return {biggerNums, smallerNums, sameNums}
    }

    getCellId = e => e.target.attributes.rel.value;

    prepareRowId = id => id+'row';

    getNewMatrixData = (id, row, rowId, matrixData) => {
        let newMatrixData = {};
        for(let prop in matrixData){
            if(prop === 'avarage')
                continue;
            const pos = parseInt(prop);
            newMatrixData[prop] = matrixData[prop];
            if(row && (pos === id)){
                newMatrixData[rowId] = row;
                row = null;
            }
        }
        if(row)
            newMatrixData[rowId] = row;
    
        return newMatrixData;
    }
    
    getRowId = len => {
        let rowId = len;
        for( let i=len; i<1001; i++){
            if(!this.state.matrixData[i+'row']){
                rowId = i;
                break;
            }
        }
        return rowId;
    }


      // CALCULATE MATRIX DATA
  getRandom(){
    var min = 100;
    var max = 999;
    return Math.floor(Math.random()*(max-min))+min;
  }

  prepareMatrix( rows, columns ){
    let avarages = [];
    let matrixData = {};
    for(let i=0; i<rows; i++){
      const rowItem = i+'row';    
      let data = this.prepareRow(i, avarages, columns);
      matrixData[rowItem] = data.row;
      avarages = data.avar;
    }
    matrixData.avarage = avarages;
    return matrixData;
  }
  
  prepareRow(i, avarages, columns){
    let row = [],
        sumRow = 0,
        avar = avarages;
    for(let j=0; j<columns; j++){
      const amount = this.getRandom();
      if(i)
        avar[j].amount += amount;
      else
        avar[j] = {id:j+1, amount};

      const cell = { id: `${i}_${j}`, amount, selected: false};
      sumRow += amount;
      row.push( cell );

    }
    row.push({id:`${i}sum`, sumRow});

    return {row, avar};
  }

  getRows(){
    let matrix = this.state.matrixData;
    let matLen = Object.keys(matrix).length-1;
    return Object.keys(matrix).map( ( row, it ) => {

      if( matLen === it ){
        return (
          <AvarageRow data={matrix[row]} 
                      columnLen={matLen}
                      changedRow={this.state.changedRow}
                      handlerCleartable={this.handlers.hanlerMouseLeaveTable}
                      key={row}
           />
        );
      }else{
        return (
          <Row data={matrix[row]} 
               handlers={this.handlers} 
               changedRow={this.state.changedRow}
               rowId={row}
               key={row}
            />
        );
      }
    });
  }

  componentWillMount(){
    if(this.state.matrixData.length === 0){
      const matrixData = this.prepareMatrix(this.state.matrixSize.rows, this.state.matrixSize.columns);
      this.setState({
        matrixData
      });
    }
  }

  render(){
    return (
      <div>
          <h1 id='title'>React grid</h1>
          <div className="wrapper">
              <Form setRows={this.setRows} setColumns={this.setColumns} setSelectedCells={this.setSelectedCells}/>
                <table onMouseLeave={this.handlers.hanlerMouseLeaveTable}>
                  <tbody>
                    {this.getRows()}
                  </tbody>
                </table>
          </div>
      </div>
    )
  }
}

export default App;
