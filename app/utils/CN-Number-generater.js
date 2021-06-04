// unique CN number Generate
const uniquCN = (Number) => {
    const str = "" + Number;
    const pad = "0000";
    return ("CN" + pad.substring(0, pad.length - str.length) + str);
};

export default uniquCN;