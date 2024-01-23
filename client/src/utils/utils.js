export const formatNrNum = (nrNum) => {
    const match = /(?:\s+|\s|)(\D|\D+|)(?:\s+|\s|)(\d+)(?:\s+|\s|)/;
    const rtnNR = () => ('NR ');
    return nrNum.replace(match, rtnNR('$1') + '$2');
  };
  