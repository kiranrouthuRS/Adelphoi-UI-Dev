
const url = typeof window !== 'undefined' ? window.location.pathname : '';
  console.log(url,"urlll")
  let str1 = url.split('/');
  let dom = str1[1];
  export const domainpath = dom;