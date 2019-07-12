export const detectCloserToSelectedCellByPosition = ( a, b, selectedNumRow, selectedNumCol ) => {
    const [numRowA, numColA] = a.id.split('_'),
          [numRowB, numColB] = b.id.split('_');
    const distanceA = Math.abs(numRowA - selectedNumRow) + Math.abs(numColA - selectedNumCol);
    const distanceB = Math.abs(numRowB - selectedNumRow) + Math.abs(numColB - selectedNumCol);
    
    return ( distanceA - distanceB );
};

export const getClothestAmounts = ( selectedNum, arrCells, len, selectedId ) => {
    let closestAmounts = [];
    const arrLen = arrCells.length;
    for( let i = 0; i <= arrLen; i++ ){
        if( closestAmounts.length === len) 
            break;
        closestAmounts.push( arrCells.splice( findClosest(selectedNum, arrCells, selectedId), 1).pop() );
    }
    return closestAmounts;
}

const findClosest = (num, arr, selectedId) => {
    const [selectedNumRow, selectedNumCol] = selectedId.split('_');
    let minDist = Infinity;
    let closestIndex = 0;
    for(let i in arr){
            const dist = Math.abs( num - arr[i].amount );
            if( dist < minDist ){ 
                minDist = dist; 
                closestIndex = i; 
            }else if(dist === minDist){
                if( detectCloserToSelectedCellByPosition( arr[closestIndex], arr[i], selectedNumRow, selectedNumCol ) > 0 )
                    closestIndex = i;
            }
        }
    
    return closestIndex;
}